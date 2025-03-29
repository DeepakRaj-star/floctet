import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertServiceRequestSchema, 
  updateServiceRequestSchema,
  insertContactMessageSchema
} from "@shared/schema";
import { initializeEmailService, sendContactEmail, sendServiceRequestEmail } from "./emailService";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && (req.user as any).role === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize session
  const MemoryStoreSession = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || "floctet-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 }, // 24 hours
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // Clear expired sessions once a day
    })
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          if (username === 'admin123' && password === 'deepak021830') {
            return done(null, { id: 0, username: 'admin123', role: 'admin' });
          }
          return done(null, false, { message: "Incorrect username or password" });
        }

        if (password !== user.password) {
          return done(null, false, { message: "Incorrect username or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      if (id === 0) {
        done(null, { id: 0, username: 'admin123', role: 'admin' });
      } else {
        const user = await storage.getUser(id);
        done(null, user);
      }
    } catch (error) {
      done(error, null);
    }
  });

  // Update profile endpoint
  app.patch("/api/auth/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Register endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid registration data", errors: validation.error.format() });
      }

      const existingUserByUsername = await storage.getUserByUsername(req.body.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(req.body.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser({
        ...validation.data,
        role: 'user'
      });

      const { password, ...userWithoutPassword } = user;

      res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message || "Authentication failed" });

      req.login(user, (err) => {
        if (err) return next(err);

        const { password, ...userWithoutPassword } = user;
        return res.json({ message: "Logged in successfully", user: userWithoutPassword });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/me", isAuthenticated, (req: Request, res: Response) => {
    const user = req.user as any;
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // SERVICE ROUTES
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services/book", isAuthenticated, async (req: Request, res: Response) => {
    try {
      res.json({ message: "Service booked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to book service" });
    }
  });

  // SERVICE REQUEST ROUTES
  app.post("/api/service-requests", async (req: Request, res: Response) => {
    try {
      const validation = insertServiceRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid service request data", errors: validation.error.format() });
      }

      const serviceRequest = await storage.createServiceRequest(validation.data);

      sendServiceRequestEmail(serviceRequest).catch(err => {
        console.error('Failed to send service request email notification:', err);
      });

      res.status(201).json({ message: "Service request submitted successfully", serviceRequest });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit service request" });
    }
  });

  app.get("/api/service-requests", isAdmin, async (req: Request, res: Response) => {
    try {
      const serviceRequests = await storage.getAllServiceRequests();
      res.json(serviceRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });

  app.patch("/api/service-requests/:id/status", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validation = updateServiceRequestSchema.safeParse({ ...req.body, id });

      if (!validation.success) {
        return res.status(400).json({ message: "Invalid update data", errors: validation.error.format() });
      }

      const updated = await storage.updateServiceRequestStatus(id, validation.data.status);

      if (!updated) {
        return res.status(404).json({ message: "Service request not found" });
      }

      res.json({ message: "Service request updated successfully", serviceRequest: updated });
    } catch (error) {
      res.status(500).json({ message: "Failed to update service request" });
    }
  });

  // CONTACT ROUTES
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validation = insertContactMessageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid contact data", errors: validation.error.format() });
      }

      const contactMessage = await storage.createContactMessage(validation.data);

      sendContactEmail(contactMessage).catch(err => {
        console.error('Failed to send contact email notification:', err);
      });

      res.status(201).json({ message: "Message sent successfully", contactMessage });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/contact", isAdmin, async (req: Request, res: Response) => {
    try {
      const contactMessages = await storage.getAllContactMessages();
      res.json(contactMessages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.patch("/api/contact/:id/read", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      const updated = await storage.markContactMessageAsRead(id);

      if (!updated) {
        return res.status(404).json({ message: "Contact message not found" });
      }

      res.json({ message: "Message marked as read", contactMessage: updated });
    } catch (error) {
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
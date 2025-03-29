import { 
  users, 
  services, 
  serviceRequests, 
  contactMessages,
  type User, 
  type InsertUser,
  type Service,
  type InsertService,
  type ServiceRequest,
  type InsertServiceRequest,
  type UpdateServiceRequest,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

// Storage interface for all models
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service methods
  getAllServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Service Request methods
  getAllServiceRequests(): Promise<ServiceRequest[]>;
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest | undefined>;
  
  // Contact Message methods
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private servicesMap: Map<number, Service>;
  private serviceRequestsMap: Map<number, ServiceRequest>;
  private contactMessagesMap: Map<number, ContactMessage>;
  
  private userId: number;
  private serviceId: number;
  private serviceRequestId: number;
  private contactMessageId: number;

  constructor() {
    this.usersMap = new Map();
    this.servicesMap = new Map();
    this.serviceRequestsMap = new Map();
    this.contactMessagesMap = new Map();
    
    this.userId = 1;
    this.serviceId = 1;
    this.serviceRequestId = 1;
    this.contactMessageId = 1;
    
    // Initialize with default admin user
    this.createUser({
      username: "admin123",
      password: "admin1234567890", // In a real app, this would be hashed
      name: "Admin User",
      email: "admin@floctet.com",
      role: "admin"
    });
    
    // Initialize with services
    this.initializeServices();
  }

  // Initialize default services
  private initializeServices() {
    const servicesData: InsertService[] = [
      {
        title: "Website Design",
        description: "Custom responsive website design with modern UI/UX principles and retro-futuristic aesthetics.",
        price: "From $499",
        icon: "ri-code-s-slash-line",
        iconClass: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
      },
      {
        title: "Full-Stack Development",
        description: "End-to-end web application development with modern frameworks and scalable architecture.",
        price: "From $999",
        icon: "ri-stack-line",
        iconClass: "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]"
      },
      {
        title: "Mobile App Development",
        description: "Native and cross-platform mobile applications with cutting-edge features and smooth performance.",
        price: "From $1299",
        icon: "ri-smartphone-line",
        iconClass: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]"
      },
      {
        title: "AI Development",
        description: "Custom AI solutions, machine learning models, and intelligent automation for your business.",
        price: "From $1499",
        icon: "ri-ai-generate",
        iconClass: "bg-purple-600/10 text-purple-600"
      },
      {
        title: "Bug Bounty Hunting",
        description: "Professional security testing and vulnerability assessments to protect your digital assets.",
        price: "From $799",
        icon: "ri-bug-line",
        iconClass: "bg-red-600/10 text-red-600"
      },
      {
        title: "API Integration",
        description: "Seamless integration of third-party APIs and development of custom RESTful services.",
        price: "From $699",
        icon: "ri-code-box-line",
        iconClass: "bg-blue-600/10 text-blue-600"
      }
    ];
    
    servicesData.forEach(service => this.createService(service));
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    
    // Create a clean user object to ensure types are correct
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name,
      email: insertUser.email,
      role: insertUser.role || "user", // Ensure role is never undefined
      createdAt: now
    };
    
    this.usersMap.set(id, user);
    return user;
  }
  
  // Service methods
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.servicesMap.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.servicesMap.get(id);
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceId++;
    const service: Service = { ...insertService, id };
    this.servicesMap.set(id, service);
    return service;
  }
  
  // Service Request methods
  async getAllServiceRequests(): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequestsMap.values());
  }
  
  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    return this.serviceRequestsMap.get(id);
  }
  
  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const id = this.serviceRequestId++;
    const now = new Date();
    
    // Create a clean service request object to ensure types are correct
    const request: ServiceRequest = { 
      id,
      name: insertRequest.name,
      email: insertRequest.email,
      serviceType: insertRequest.serviceType,
      description: insertRequest.description,
      status: "pending",
      phone: insertRequest.phone || null,
      minBudget: insertRequest.minBudget || null,
      maxBudget: insertRequest.maxBudget || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.serviceRequestsMap.set(id, request);
    return request;
  }
  
  async updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest | undefined> {
    const request = this.serviceRequestsMap.get(id);
    if (!request) return undefined;
    
    const updatedRequest: ServiceRequest = {
      ...request,
      status: status as "pending" | "confirmed" | "completed" | "cancelled",
      updatedAt: new Date()
    };
    this.serviceRequestsMap.set(id, updatedRequest);
    return updatedRequest;
  }
  
  // Contact Message methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessagesMap.values());
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessagesMap.get(id);
  }
  
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const now = new Date();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      read: false,
      createdAt: now
    };
    this.contactMessagesMap.set(id, message);
    return message;
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessagesMap.get(id);
    if (!message) return undefined;
    
    const updatedMessage: ContactMessage = {
      ...message,
      read: true
    };
    this.contactMessagesMap.set(id, updatedMessage);
    return updatedMessage;
  }
}

// Create the storage instance
export const storage = new MemStorage();

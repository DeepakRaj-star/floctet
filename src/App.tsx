import { Switch, Route, Redirect, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminServiceRequests from "@/pages/admin/ServiceRequests";
import AdminLogin from "@/pages/admin/Login";
import JoinTeam from "@/pages/JoinTeam";
import { Suspense, useEffect, useState } from "react";
import CustomCursor from "@/lib/cursor";
import Stars from "@/lib/stars";
import Preloader from "@/components/Preloader";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
// Placeholder import - needs actual implementation
import Profile from "@/pages/Profile";


// Create a client
const queryClient = new QueryClient();

// Protected Route component for admin routes
function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  const [_, setLocation] = useLocation();

  // Check if user is authenticated and is admin
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include"
        });

        if (!response.ok) {
          if (response.status === 401) {
            return null;
          }
          throw new Error("Failed to authenticate");
        }

        return await response.json();
      } catch (err) {
        console.error("Auth error:", err);
        return null;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-glow">Loading...</div>
      </div>
    );
  }

  // If not authenticated or not admin, redirect to login
  if (!userData || userData.role !== "admin") {
    return <Redirect to="/admin" />;
  }

  // If authenticated and admin, render the component
  return <Component />;
}

function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard">
          <ProtectedAdminRoute component={AdminDashboard} />
        </Route>
        <Route path="/admin/service-requests">
          <ProtectedAdminRoute component={AdminServiceRequests} />
        </Route>
        <Route path="/profile" component={Profile} /> {/* Added Profile Route */}
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating loading time for preloader effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <CustomCursor />
          <div className="scanlines"></div>
          <Stars />
          <Suspense fallback={<Preloader />}>
            <Router />
          </Suspense>
          <Toaster />
        </>
      )}
    </>
  );
}

export default App;
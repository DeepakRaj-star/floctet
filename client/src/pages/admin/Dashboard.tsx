import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartLegendItem, PieChart } from "@/components/ui/chart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Briefcase, 
  CheckCircle, 
  ClipboardList, 
  HelpCircle, 
  LogOut, 
  Mail, 
  Users, 
  XCircle 
} from "lucide-react";

const AdminDashboard = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if user is authenticated and is admin
  const { data: userData, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ["/api/auth/me"]
  });
  
  // Get service requests data
  const { data: serviceRequests = [], isLoading: serviceRequestsLoading } = useQuery({
    queryKey: ["/api/service-requests"],
    enabled: !!userData
  });
  
  // Get contact messages data
  const { data: contactMessages = [], isLoading: contactMessagesLoading } = useQuery({
    queryKey: ["/api/contact"],
    enabled: !!userData
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard",
      });
      setLocation("/admin");
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out",
        variant: "destructive"
      });
    }
  });
  
  // Read message mutation
  const readMessageMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("PATCH", `/api/contact/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    }
  });
  
  // If not authenticated or not admin, redirect to login
  useEffect(() => {
    if (userError || (userData && userData.role !== "admin")) {
      setLocation("/admin");
    }
  }, [userData, userError, setLocation]);
  
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-2xl text-[hsl(var(--primary))] animate-pulse">LOADING...</div>
      </div>
    );
  }
  
  // Calculate dashboard stats
  const pendingRequests = serviceRequests.filter((req: any) => req.status === "pending").length;
  const confirmedRequests = serviceRequests.filter((req: any) => req.status === "confirmed").length;
  const completedRequests = serviceRequests.filter((req: any) => req.status === "completed").length;
  const cancelledRequests = serviceRequests.filter((req: any) => req.status === "cancelled").length;
  
  const unreadMessages = contactMessages.filter((msg: any) => !msg.read).length;
  
  // Prepare chart data
  const requestStatusData = [
    { name: "Pending", value: pendingRequests, color: "var(--chart-3)" },
    { name: "Confirmed", value: confirmedRequests, color: "var(--chart-4)" },
    { name: "Completed", value: completedRequests, color: "var(--chart-1)" },
    { name: "Cancelled", value: cancelledRequests, color: "var(--chart-2)" }
  ];
  
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <header className="bg-[hsl(var(--card))] p-4 border-b border-[hsl(var(--border))]">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="font-pixel text-xl text-[hsl(var(--primary))]">FLOCTET</div>
            <span className="text-xs font-code text-[hsl(var(--secondary))] px-2 py-1 border border-[hsl(var(--secondary))]/30 rounded">
              ADMIN
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-code text-[hsl(var(--secondary))]">Logged in as: <span className="text-foreground">{userData?.name}</span></p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => logoutMutation.mutate()} 
              disabled={logoutMutation.isPending}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              {logoutMutation.isPending ? "Logging out..." : "Log Out"}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl mb-2">Admin Dashboard</h1>
          <p className="font-code text-sm text-foreground/70">Manage service requests and communications</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-code flex items-center gap-2">
                  <ClipboardList size={18} className="text-[hsl(var(--primary))]" />
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{serviceRequests.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Service requests received</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-code flex items-center gap-2">
                  <HelpCircle size={18} className="text-[hsl(var(--accent))]" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-code flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedRequests}</div>
                <p className="text-xs text-muted-foreground mt-1">Delivered services</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-code flex items-center gap-2">
                  <Mail size={18} className="text-[hsl(var(--secondary))]" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contactMessages.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {unreadMessages > 0 && (
                    <span className="text-[hsl(var(--primary))]">{unreadMessages} unread</span>
                  )}
                  {unreadMessages === 0 && "All read"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-pixel flex items-center gap-2">
                  <BarChart3 size={20} className="text-[hsl(var(--primary))]" />
                  Request Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ChartContainer className="h-[240px]">
                  <PieChart
                    data={requestStatusData}
                    innerRadius={40}
                  />
                </ChartContainer>
                <ChartLegend className="mt-4 justify-center gap-6">
                  <ChartLegendItem name="Pending" color="var(--chart-3)" />
                  <ChartLegendItem name="Confirmed" color="var(--chart-4)" />
                  <ChartLegendItem name="Completed" color="var(--chart-1)" />
                  <ChartLegendItem name="Cancelled" color="var(--chart-2)" />
                </ChartLegend>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-pixel flex items-center gap-2">
                  <Briefcase size={20} className="text-[hsl(var(--secondary))]" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="requests">
                  <TabsList className="mb-4">
                    <TabsTrigger value="requests">Service Requests</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="requests">
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-left" 
                        onClick={() => setLocation("/admin/service-requests")}
                      >
                        <ClipboardList size={16} className="mr-2" />
                        View All Requests
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-left"
                        onClick={() => setLocation("/admin/service-requests?status=pending")}
                      >
                        <HelpCircle size={16} className="mr-2 text-[hsl(var(--accent))]" />
                        View Pending Requests ({pendingRequests})
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-left"
                        onClick={() => setLocation("/admin/service-requests?status=confirmed")}
                      >
                        <CheckCircle size={16} className="mr-2 text-[hsl(var(--secondary))]" />
                        View Confirmed Requests ({confirmedRequests})
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="messages">
                    <div className="space-y-4">
                      {contactMessages.length === 0 && (
                        <p className="text-center py-4 text-muted-foreground">No messages received yet</p>
                      )}
                      
                      {contactMessages.slice(0, 3).map((message: any) => (
                        <div key={message.id} className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
                                  {message.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{message.name}</p>
                                <p className="text-xs text-muted-foreground">{message.email}</p>
                              </div>
                            </div>
                            
                            {!message.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs"
                                onClick={() => readMessageMutation.mutate(message.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                          
                          <div className="pl-10">
                            <p className="text-sm font-medium">{message.subject}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {message.message}
                            </p>
                          </div>
                          
                          <Separator />
                        </div>
                      ))}
                      
                      {contactMessages.length > 3 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setLocation("/admin/service-requests?tab=messages")}
                        >
                          View All Messages ({contactMessages.length})
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="flex justify-between mt-12">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2"
          >
            <i className="ri-home-4-line"></i>
            View Website
          </Button>
          
          <Button 
            variant="default" 
            onClick={() => setLocation("/admin/service-requests")}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-center gap-2"
          >
            <ClipboardList size={16} />
            Manage Service Requests
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

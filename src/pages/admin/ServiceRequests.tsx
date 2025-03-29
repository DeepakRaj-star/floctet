import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getServiceRequests, updateServiceRequestStatus } from "@/lib/api";

interface ServiceRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  description: string;
  minBudget?: string;
  maxBudget?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const ServiceRequests = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["serviceRequests"],
    queryFn: getServiceRequests
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      updateServiceRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceRequests"] });
      toast({ description: "Status updated successfully" });
      setShowStatusDialog(false);
    },
    onError: (error) => {
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to update status"
      });
    }
  });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <header className="bg-[hsl(var(--card))] p-4 border-b border-[hsl(var(--border))]">
        <div className="container mx-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/admin/dashboard")}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="font-pixel text-xl text-[hsl(var(--primary))]">
            SERVICE REQUESTS
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid gap-4">
          {requests.map((request: ServiceRequest) => (
            <div 
              key={request.id}
              className="p-4 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{request.name}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {request.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowStatusDialog(true);
                  }}
                >
                  Update Status
                </Button>
              </div>
              <div className="mt-2">
                <p><strong>Service:</strong> {request.serviceType}</p>
                <p><strong>Description:</strong> {request.description}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Submitted on {format(new Date(request.createdAt), "PPP")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {["pending", "confirmed", "completed", "cancelled"].map((status) => (
              <Button
                key={status}
                variant={selectedRequest?.status === status ? "default" : "outline"}
                onClick={() => {
                  if (selectedRequest) {
                    updateStatusMutation.mutate({
                      id: selectedRequest.id,
                      status
                    });
                  }
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceRequests;
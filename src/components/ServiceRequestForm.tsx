import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const serviceSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  serviceType: z.string().min(1, { message: "Please select a service type" }),
  description: z.string().min(10, { message: "Please provide more details about your project" }),
  minBudget: z.string().refine((val) => !isNaN(Number(val)), { message: "Please enter a valid number" }).optional(),
  maxBudget: z.string().refine((val) => !isNaN(Number(val)), { message: "Please enter a valid number" }).optional(),
});

type ServiceRequest = z.infer<typeof serviceSchema>;

const ServiceRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Extract service type from URL if present
  const getInitialServiceType = () => {
    if (typeof window !== 'undefined') {
      const hashParams = window.location.hash.split('?')[1];
      if (hashParams) {
        const params = new URLSearchParams(hashParams);
        const serviceParam = params.get('service');
        
        // Map service title to service type value
        if (serviceParam) {
          const serviceMap: Record<string, string> = {
            'Website Design': 'website',
            'Full-Stack Development': 'fullstack',
            'Mobile App Development': 'mobile',
            'AI Development': 'ai',
            'Bug Bounty Hunting': 'security',
            'API Integration': 'api'
          };
          
          return serviceMap[serviceParam] || '';
        }
      }
    }
    return '';
  };

  const form = useForm<ServiceRequest>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: getInitialServiceType(),
      description: "",
      minBudget: "",
      maxBudget: "",
    },
  });

  const serviceRequestMutation = useMutation({
    mutationFn: (data: ServiceRequest) => {
      return apiRequest("POST", "/api/service-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Service request submitted",
        description: "We've received your request and will get back to you shortly!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message || "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: ServiceRequest) => {
    setIsSubmitting(true);
    serviceRequestMutation.mutate(data);
  };

  return (
    <section id="service-request" className="py-20 bg-[hsl(var(--card))] relative">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-code text-[hsl(var(--secondary))] text-sm tracking-wider">// INITIATE REQUEST</span>
          <h2 className="font-pixel text-3xl sm:text-4xl text-[hsl(var(--primary))] mt-2 mb-4">BOOK A CUSTOM SERVICE</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mx-auto"></div>
          <p className="font-code text-sm mt-6 max-w-xl mx-auto text-foreground/80">
            Tell us what you need and we'll create a tailored solution for you
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="gradient-border bg-background rounded-lg p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">NAME:</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-[hsl(var(--card))] border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">EMAIL:</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="bg-[hsl(var(--card))] border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">PHONE:</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            className="bg-[hsl(var(--card))] border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">SERVICE TYPE:</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="bg-[hsl(var(--card))] border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="website">Website Design</SelectItem>
                            <SelectItem value="fullstack">Full-Stack Development</SelectItem>
                            <SelectItem value="mobile">Mobile App Development</SelectItem>
                            <SelectItem value="ai">AI Development</SelectItem>
                            <SelectItem value="security">Bug Bounty Hunting</SelectItem>
                            <SelectItem value="api">API Integration</SelectItem>
                            <SelectItem value="custom">Custom Service</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">PROJECT DESCRIPTION:</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="bg-[hsl(var(--card))] border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormLabel className="block font-code text-xs text-[hsl(var(--secondary))] mb-2">BUDGET RANGE:</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minBudget"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-[hsl(var(--secondary))]">$</span>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Min"
                                  className="bg-[hsl(var(--card))] border border-[hsl(var(--secondary))]/30 rounded py-2 pl-8 pr-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maxBudget"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-[hsl(var(--secondary))]">$</span>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Max"
                                  className="bg-[hsl(var(--card))] border border-[hsl(var(--secondary))]/30 rounded py-2 pl-8 pr-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <motion.button
                    type="submit"
                    className="gradient-border bg-[hsl(var(--card))] px-8 py-3 rounded font-pixel text-sm text-[hsl(var(--primary))] hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all duration-300"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT REQUEST"}
                  </motion.button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceRequestForm;

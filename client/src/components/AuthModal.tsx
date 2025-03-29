import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  terms: z.boolean().refine(val => val === true, { message: "You must accept the terms" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, activeTab = "login" }: AuthModalProps) => {
  const [currentTab, setCurrentTab] = useState<"login" | "register">(activeTab);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => {
      return apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: () => {
      toast({
        title: "Logged in successfully",
        description: "Welcome back to FLOCTET TECHNOLOGIES!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => {
      const { confirmPassword, terms, ...registerData } = data;
      return register(registerData);
    },
    onSuccess: () => {
      toast({
        title: "Registered successfully",
        description: "Your account has been created. You can now log in.",
      });
      registerForm.reset();
      setCurrentTab("login");
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onLoginSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div 
            className="relative w-full max-w-md mx-4"
            variants={contentVariants}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="gradient-border bg-[hsl(var(--card))] rounded-lg p-6">
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-foreground/60 hover:text-[hsl(var(--primary))] transition-colors duration-300"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
              
              <div className="flex mb-6">
                <button 
                  onClick={() => setCurrentTab("login")}
                  className={`flex-1 py-2 font-pixel text-sm ${
                    currentTab === "login" 
                      ? "text-[hsl(var(--secondary))] border-b-2 border-[hsl(var(--secondary))]" 
                      : "text-foreground/60 border-b-2 border-foreground/20 hover:text-[hsl(var(--primary))] transition-colors duration-300"
                  }`}
                >
                  LOGIN
                </button>
                <button 
                  onClick={() => setCurrentTab("register")}
                  className={`flex-1 py-2 font-pixel text-sm ${
                    currentTab === "register" 
                      ? "text-[hsl(var(--secondary))] border-b-2 border-[hsl(var(--secondary))]" 
                      : "text-foreground/60 border-b-2 border-foreground/20 hover:text-[hsl(var(--primary))] transition-colors duration-300"
                  }`}
                >
                  REGISTER
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {currentTab === "login" ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">EMAIL:</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  className="bg-background border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">PASSWORD:</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  className="bg-background border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex items-center justify-between">
                          <FormField
                            control={loginForm.control}
                            name="rememberMe"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[hsl(var(--secondary))]"
                                  />
                                </FormControl>
                                <FormLabel className="text-xs font-code text-foreground/80">Remember me</FormLabel>
                              </FormItem>
                            )}
                          />
                          <a href="#" className="text-xs font-code text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors duration-300">
                            Forgot password?
                          </a>
                        </div>
                        
                        <button 
                          type="submit" 
                          className="w-full gradient-border bg-background py-3 rounded font-pixel text-sm text-[hsl(var(--primary))] hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all duration-300"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "LOGGING IN..." : "LOG IN"}
                        </button>
                      </form>
                    </Form>
                    
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-foreground/20"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-4 bg-[hsl(var(--card))] text-xs font-code text-foreground/60">OR CONTINUE WITH</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-4 mt-6">
                        <motion.button 
                          className="h-10 w-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <i className="ri-facebook-fill"></i>
                        </motion.button>
                        <motion.button 
                          className="h-10 w-10 rounded-full bg-[#DB4437]/10 flex items-center justify-center text-[#DB4437] hover:bg-[#DB4437] hover:text-white transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <i className="ri-google-fill"></i>
                        </motion.button>
                        <motion.button 
                          className="h-10 w-10 rounded-full bg-[#171515]/10 flex items-center justify-center text-[#171515] hover:bg-[#171515] hover:text-white transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <i className="ri-github-fill"></i>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">FULL NAME:</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-background border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">EMAIL:</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  className="bg-background border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">PASSWORD:</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  className="bg-background border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">CONFIRM PASSWORD:</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  className="bg-background border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="terms"
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-2 mt-4">
                              <FormControl className="mt-1">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-[hsl(var(--secondary))]"
                                />
                              </FormControl>
                              <div className="space-y-1">
                                <FormLabel className="text-xs font-code text-foreground/80">
                                  I agree to the <a href="#" className="text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors duration-300">Terms of Service</a> and <a href="#" className="text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors duration-300">Privacy Policy</a>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <button 
                          type="submit" 
                          className="w-full gradient-border bg-background py-3 rounded font-pixel text-sm text-[hsl(var(--accent))] hover:shadow-[0_0_20px_rgba(255,255,0,0.5)] transition-all duration-300"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "REGISTERING..." : "REGISTER"}
                        </button>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { FlickerText } from "@/components/FlickerText";
import { loginAdmin } from "@/lib/api";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values: z.infer<typeof loginSchema>) => {
      return loginAdmin(values.username, values.password);
    },
    onSuccess: () => {
      setLocation("/admin/dashboard");
    },
    onError: (error: Error) => {
      setLoginError(error.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoginError(null);
    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>

      <motion.div 
        className="w-full max-w-md px-8 py-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="font-pixel text-3xl text-[hsl(var(--primary))] mb-2">ADMIN ACCESS</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mx-auto mb-4"></div>
          <p className="font-code text-sm text-[hsl(var(--secondary))]">
            <FlickerText text="ENTER CREDENTIALS TO CONTINUE" />
          </p>
        </div>

        <div className="gradient-border bg-[hsl(var(--card))] rounded-lg p-6">
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md mb-6 font-code">
              {loginError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">USERNAME:</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        className="font-code bg-background/50"
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">PASSWORD:</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="password"
                        className="font-code bg-background/50"
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <button 
                type="submit"
                className="w-full gradient-border bg-background py-3 rounded font-pixel text-sm text-[hsl(var(--primary))] hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all duration-300"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "LOGGING IN..." : "LOG IN"}
              </button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
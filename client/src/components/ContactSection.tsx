import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactForm = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Thank you for contacting us! We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Sending failed",
        description: error.message || "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="contact" className="py-20 bg-[hsl(var(--card))] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-code text-[hsl(var(--secondary))] text-sm tracking-wider">// 05</span>
          <h2 className="font-pixel text-3xl sm:text-4xl text-[hsl(var(--primary))] mt-2 mb-4">CONTACT US</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mx-auto"></div>
          <p className="font-code text-sm mt-6 max-w-xl mx-auto text-foreground/80">
            Reach out to discuss your project requirements
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="gradient-border bg-background rounded-lg p-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.h3 
                className="font-pixel text-xl text-[hsl(var(--secondary))] mb-6"
                variants={itemVariants}
              >
                DROP US A MESSAGE
              </motion.h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <motion.div variants={itemVariants}>
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
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
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
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">SUBJECT:</FormLabel>
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
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-code text-xs text-[hsl(var(--secondary))]">MESSAGE:</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              className="bg-[hsl(var(--card))] border border-[hsl(var(--secondary))]/30 rounded py-2 px-3 font-body text-foreground focus:outline-none focus:border-[hsl(var(--secondary))] focus:shadow-[0_0_8px_rgba(0,255,255,0.3)] transition-all resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      className="w-full gradient-border bg-[hsl(var(--card))] py-3 rounded font-pixel text-sm text-[hsl(var(--primary))] hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all duration-300"
                      disabled={contactMutation.isPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {contactMutation.isPending ? "SENDING..." : "SEND MESSAGE"}
                    </motion.button>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
            
            <div>
              <motion.div 
                className="gradient-border bg-background rounded-lg p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-pixel text-xl text-[hsl(var(--secondary))] mb-6">CONNECT WITH US</h3>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mr-4">
                      <i className="ri-mail-line text-xl text-[hsl(var(--primary))]"></i>
                    </div>
                    <div>
                      <p className="font-code text-xs text-[hsl(var(--secondary))] mb-1">EMAIL:</p>
                      <a href="mailto:floctettechnologies@gmail.com" className="font-body text-sm text-foreground hover:text-[hsl(var(--primary))] transition-colors duration-300">floctettechnologies@gmail.com</a>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--secondary))]/10 flex items-center justify-center mr-4">
                      <i className="ri-phone-line text-xl text-[hsl(var(--secondary))]"></i>
                    </div>
                    <div>
                      <p className="font-code text-xs text-[hsl(var(--secondary))] mb-1">PHONE:</p>
                      <a href="tel:+916381687588" className="font-body text-sm text-foreground hover:text-[hsl(var(--primary))] transition-colors duration-300">+91 6381687588</a>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--accent))]/10 flex items-center justify-center mr-4">
                      <i className="ri-map-pin-line text-xl text-[hsl(var(--accent))]"></i>
                    </div>
                    <div>
                      <p className="font-code text-xs text-[hsl(var(--secondary))] mb-1">LOCATION:</p>
                      <p className="font-body text-sm text-foreground">Chennai, Tamil Nadu, India</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="gradient-border bg-background rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="font-pixel text-xl text-[hsl(var(--secondary))] mb-6">FOLLOW US</h3>
                
                <div className="flex justify-center space-x-4">
                  <motion.a 
                    href="https://www.linkedin.com/in/deepak-raj-r-290856235/" 
                    target="_blank"
                    className="h-12 w-12 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-background transition-all duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="ri-linkedin-fill text-xl"></i>
                  </motion.a>
                  <motion.a 
                    href="https://x.com/Venom021830" 
                    target="_blank"
                    className="h-12 w-12 rounded-full bg-[hsl(var(--secondary))]/10 flex items-center justify-center text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-background transition-all duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="ri-twitter-x-fill text-xl"></i>
                  </motion.a>
                  <motion.a 
                    href="https://www.instagram.com/dee_pakrajr/" 
                    target="_blank"
                    className="h-12 w-12 rounded-full bg-[hsl(var(--accent))]/10 flex items-center justify-center text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))] hover:text-background transition-all duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="ri-instagram-fill text-xl"></i>
                  </motion.a>
                  <motion.a 
                    href="https://github.com/deepakraj-sys" 
                    target="_blank"
                    className="h-12 w-12 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-background transition-all duration-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="ri-github-fill text-xl"></i>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Navigation from "../components/Navigation";
import { apiRequest } from "@/lib/queryClient";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  position: z.string().min(1, "Please select a position"),
  experience: z.string().min(1, "Please select your experience level"),
  portfolio: z.string().url("Valid URL is required").optional().or(z.literal("")),
  message: z.string().min(10, "Please tell us about yourself (min 10 characters)"),
  skills: z.string().min(5, "Please list your key skills")
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const JoinTeam = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema)
  });
  
  const onSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);
    
    try {
      // Send application data to backend
      await apiRequest("POST", "/api/job-applications", data);
      
      // Success!
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in joining our team. We'll review your application and get back to you soon.",
        variant: "default",
      });
      
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-[hsl(var(--background))]">
      <Navigation />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[hsl(var(--primary))] opacity-5 blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 rounded-full bg-[hsl(var(--secondary))] opacity-5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h1 className="font-pixel text-4xl text-[hsl(var(--primary))] mb-4">JOIN OUR TEAM</h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-transparent mx-auto mb-6"></div>
            <p className="text-[hsl(var(--foreground))] opacity-80 max-w-2xl mx-auto">
              Join FLOCTET TECHNOLOGIES and be part of our innovative freelancing team. 
              We're looking for talented individuals who are passionate about pushing boundaries 
              and creating exceptional digital experiences.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 bg-[rgba(0,20,40,0.3)] p-5 rounded-lg border border-[rgba(0,210,255,0.2)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]"></div>
              <h3 className="font-code text-lg text-[hsl(var(--primary))]">Important Notes</h3>
            </div>
            <ul className="space-y-2 pl-5 text-[hsl(var(--muted-foreground))]">
              <li className="list-disc">
                <span className="text-[hsl(var(--foreground))]">Remote Positions:</span> We're primarily a remote team, allowing you to work from anywhere.
              </li>
              <li className="list-disc">
                <span className="text-[hsl(var(--foreground))]">Freelancing Structure:</span> As a freelancing company, our collaboration model is project-based.
              </li>
              <li className="list-disc">
                <span className="text-[hsl(var(--foreground))]">Performance-Based Compensation:</span> Salary will be provided based on your performance and contribution to projects.
              </li>
              <li className="list-disc">
                <span className="text-[hsl(var(--foreground))]">Portfolio Required:</span> Please include links to your previous work or GitHub profile.
              </li>
            </ul>
          </motion.div>
          
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[rgba(0,255,200,0.1)] border border-[rgba(0,255,200,0.3)] rounded-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-[rgba(0,255,200,0.2)] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-3xl text-[hsl(var(--accent))]"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Submitted Successfully!</h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-6">
                Thank you for your interest in joining FLOCTET TECHNOLOGIES. Our team will review your application 
                and contact you soon for the next steps.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-transparent rounded-lg border border-[rgba(0,255,200,0.3)] hover:bg-[rgba(0,255,200,0.1)] text-[hsl(var(--accent))] font-code transition-all duration-300"
              >
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-[rgba(10,15,25,0.5)] backdrop-blur-sm rounded-lg p-6 border border-[rgba(0,210,255,0.15)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="fullName" className="block text-sm font-code text-[hsl(var(--muted-foreground))] mb-2">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    {...register("fullName")}
                    className="w-full bg-[rgba(0,10,20,0.3)] border border-[rgba(0,210,255,0.2)] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:border-[rgba(0,210,255,0.5)]"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-[hsl(var(--destructive))] text-xs">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-code text-[hsl(var(--muted-foreground))] mb-2">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full bg-[rgba(0,10,20,0.3)] border border-[rgba(0,210,255,0.2)] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:border-[rgba(0,210,255,0.5)]"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-[hsl(var(--destructive))] text-xs">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone" className="block text-sm font-code text-[hsl(var(--muted-foreground))] mb-2">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    className="w-full bg-[rgba(0,10,20,0.3)] border border-[rgba(0,210,255,0.2)] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:border-[rgba(0,210,255,0.5)]"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[hsl(var(--destructive))] text-xs">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="position" className="block text-sm font-code text-[hsl(var(--muted-foreground))] mb-2">
                    POSITION
                  </label>
                  <select
                    id="position"
                    {...register("position")}
                    className="w-full bg-[rgba(0,10,20,0.3)] border border-[rgba(0,210,255,0.2)] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:border-[rgba(0,210,255,0.5)]"
                  >
                    <option value="">Select a position</option>
                    <option value="Web Developer">Web Developer</option>
                    <option value="Mobile App Developer">Mobile App Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="AI/ML Engineer">AI/ML Engineer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                  </select>
                  {errors.position && (
                    <p className="mt-1 text-[hsl(var(--destructive))] text-xs">{errors.position.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience" className="block text-sm font-code text-[hsl(var(--muted-foreground))] mb-2">
                    EXPERIENCE LEVEL
                  </label>
                  <select
                    id="experience"
                    {...register("experience")}
                    className="w-full bg-[rgba(0,10,20,0.3)] border border-[rgba(0,210,255,0.2)] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:border-[rgba(0,210,255,0.5)]"
                  >
                    <option value="">Select your experience level</option>
                    <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                    <option value="Mid Level (2-5 years)">Mid Level (2-5 years)</option>
                    <option value="Senior (5+ years)">Senior (5+ years)</option>
                  </select>
                  {errors.experience && (
                    <p className="mt-1 text-[hsl(var(--destructive))] text-xs">{errors.experience.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="portfolio" className="block text-sm font-code text-[hsl(var(--muted-foreground))] mb-2">
                    PORTFOLIO URL (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    id="portfolio"
                    {...register("portfolio")}
                    className="w-full bg-[rgba(0,10,20,0.3)] border border-[rgba(0,210,255,0.2)] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:border-[rgba(0,210,255,0.5)]"
                    placeholder="https://your-portfolio.com"
                  />
                  {errors.portfolio && (
                    <p className="mt-1 text-[hsl(var(--destructive))] text-xs">{errors.portfolio.message}</p>
                  )}
                </div>
                
                <div className="form-group md:col-span-2">
                  <label htmlFor="skills" className="block text-sm font-code text-[hsl(var(--muted-foreground))] mb-2">
                    SKILLS
                  </label>
                  <input
                    type="text"
                    id="skills"
                    {...register("skills")}
                    className="w-full bg-[rgba(0,10,20,0.3)] border border-[rgba(0,210,255,0.2)] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:border-[rgba(0,210,255,0.5)]"
                    placeholder="e.g. JavaScript, React, Node.js, UI/UX Design"
                  />
                  {errors.skills && (
                    <p className="mt-1 text-[hsl(var(--destructive))] text-xs">{errors.skills.message}</p>
                  )}
                </div>
                
                <div className="form-group md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-code text-[hsl(var(--muted-foreground))] mb-2">
                    COVER LETTER / MESSAGE
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register("message")}
                    className="w-full bg-[rgba(0,10,20,0.3)] border border-[rgba(0,210,255,0.2)] rounded-lg px-4 py-3 text-[hsl(var(--foreground))] focus:outline-none focus:border-[rgba(0,210,255,0.5)]"
                    placeholder="Tell us about yourself, your experience, and why you want to join our team..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-[hsl(var(--destructive))] text-xs">{errors.message.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative overflow-hidden inline-block px-10 py-3 bg-[rgba(0,210,255,0.1)] border border-[rgba(0,210,255,0.3)] rounded-lg hover:bg-[rgba(0,210,255,0.15)] text-[hsl(var(--primary))] font-code uppercase tracking-wider text-sm transition-all duration-300"
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[hsl(var(--primary))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </span>
                </button>
              </div>
            </motion.form>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Already applied? <a href="/#contact" className="text-[hsl(var(--primary))] hover:underline">Contact us</a> for status updates on your application.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JoinTeam;
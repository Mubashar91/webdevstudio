import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/use-seo";
import { UserPlus, Shield, User, Mail, Lock, Sparkles } from "lucide-react";

const schema = z.object({
  adminCode: z.string().min(1, "Admin code is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminSignup() {
  // Auth screens must never appear in search results.
  useSEO({ title: "Sign up | WebDevStudio Admin", description: "WebDevStudio admin sign up.", noindex: true });

  const navigate = useNavigate();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { adminCode: "", name: "", email: "", password: "" } });
  const API_URL = ((import.meta as unknown) as { env?: Record<string, string | undefined> }).env?.VITE_API_URL || "http://localhost:5000";

  const signup = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await fetch(`${API_URL}/api/auth/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error((await res.text()) || `Signup failed (${res.status})`);
      return res.json();
    },
    onSuccess: () => {
      toast.success("Admin account created. Please login.");
      navigate("/admin/login");
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Please check your details and code.";
      toast.error("Signup failed", { description: msg });
    },
  });

  const onSubmit = (values: FormValues) => signup.mutate(values);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Create your admin account</p>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-xl border-primary/20">
          <CardHeader className="space-y-1 border-b bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserPlus className="h-5 w-5 text-primary" />
              Create Account
            </CardTitle>
            <CardDescription>Enter the admin code and your details to get started</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="adminCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Admin Code
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="ADMIN2024" className="pl-10 h-11" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Admin User" className="pl-10 h-11" {...field} />
                      </div>
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
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder="admin@example.com" className="pl-10 h-11" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" className="pl-10 h-11" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={signup.isPending}
                className="w-full gap-2 h-11 shadow-md hover:shadow-lg transition-all"
              >
                <UserPlus className="h-4 w-4" />
                {signup.isPending ? "Creating..." : "Create account"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/admin/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
    </div>
  );
}

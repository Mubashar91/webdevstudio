import { useState } from "react";
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
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password is required"),
});

type FormValues = z.infer<typeof schema>;
type LoginResponse = {
  success?: boolean;
  message?: string;
  accessToken?: string;
  token?: string;
  user?: { id: string; email: string; role: string; name?: string };
};

export default function AdminLogin() {
  // Auth screens must never appear in search results.
  useSEO({ title: "Sign in | WebDevStudio Admin", description: "WebDevStudio admin sign in.", noindex: true });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const API_URL = ((import.meta as unknown) as { env?: Record<string, string | undefined> }).env?.VITE_API_URL || "http://localhost:5000";

  const login = useMutation<LoginResponse, Error, FormValues>({
    mutationFn: async (values: FormValues): Promise<LoginResponse> => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error((await res.text()) || `Login failed (${res.status})`);
      return res.json();
    },
    onSuccess: (data: LoginResponse) => {
      const token = data?.accessToken || data?.token;
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("token", token);
      }
      toast.success("Logged in");
      navigate("/admin/projects/new");
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Invalid credentials";
      toast.error("Login failed", { description: msg });
    },
  });

  const onSubmit = (values: FormValues) => login.mutate(values);

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
          <p className="text-sm text-muted-foreground">Sign in to manage your projects</p>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-xl border-primary/20">
          <CardHeader className="space-y-1 border-b bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <LogIn className="h-5 w-5 text-primary" />
              Sign In
            </CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-11" {...field} />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={login.isPending}
                className="w-full gap-2 h-11 shadow-md hover:shadow-lg transition-all"
              >
                <LogIn className="h-4 w-4" />
                {login.isPending ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/admin/signup" className="text-primary hover:underline font-medium">
                  Sign up
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

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const projectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  photo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  video: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  technologies: z
    .string()
    .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean))
    .refine((arr) => arr.length > 0, { message: "Add at least one technology" }),
  type: z.enum(["MERN", "Node", "React", "Other"], {
    required_error: "Project type is required",
  }),
  githubLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function AdminEditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", photo: "", video: "", technologies: "", type: "MERN", githubLink: "" },
    mode: "onChange",
  });

  const { isLoading } = useQuery({
    queryKey: ["project", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/projects/${id}`);
      if (!res.ok) throw new Error(`Failed to load project (${res.status})`);
      return res.json();
    },
    onSuccess: (p: any) => {
      form.reset({
        title: p.title || "",
        description: p.description || "",
        photo: p.photo || "",
        video: p.video || "",
        technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : "",
        type: p.type || "MERN",
        githubLink: p.githubLink || "",
      });
    },
    onError: (e: any) => toast.error("Failed to load project", { description: e?.message }),
  });

  const updateProject = useMutation({
    mutationFn: async (payload: any) => {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || `Update failed (${res.status})`);
      return res.json();
    },
    onSuccess: () => {
      toast.success("Project updated");
      navigate("/admin/projects");
    },
    onError: (e: any) => toast.error("Failed to update", { description: e?.message }),
  });

  const onSubmit = (values: ProjectFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      photo: values.photo || undefined,
      video: values.video || undefined,
      technologies: Array.isArray(values.technologies)
        ? (values.technologies as unknown as string[])
        : String(values.technologies)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      type: values.type,
      githubLink: values.githubLink || undefined,
    };
    updateProject.mutate(payload);
  };

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>Update project details</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Amazing Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node, MongoDB" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Comma-separated list</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MERN">MERN</SelectItem>
                            <SelectItem value="Node">Node</SelectItem>
                            <SelectItem value="React">React</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="githubLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username/repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateProject.isPending}>
                    {updateProject.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

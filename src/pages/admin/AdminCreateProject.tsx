import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderPlus, FileText, Image, Video, Code2, Github, RotateCcw, Save } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  // photo will be set automatically after upload, no need for URL validation
  photo: z.string().optional().or(z.literal("")),
  video: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  technologies: z.string().min(1, "Add at least one technology"),
  type: z.enum(["MERN", "Node", "React", "Other"], {
    required_error: "Project type is required",
  }),
  githubLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveDemo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;
type CreateProjectPayload = {
  title: string;
  description: string;
  image?: string;
  video?: string;
  technologies: string[];
  type: "MERN" | "Node" | "React" | "Other";
  githubLink?: string;
  demoLink?: string;
};

export default function AdminCreateProject() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const defaultValues = useMemo<ProjectFormValues>(
    () => ({
      title: "",
      description: "",
      photo: "",
      video: "",
      technologies: "",
      type: "MERN",
      githubLink: "",
      liveDemo: "",
    }),
    []
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: "onChange",
  });

  const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

  const handleImageUpload = async (file: File) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/api/uploads/projects`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Upload failed with ${res.status}`);
      }
      const data = await res.json();
      if (data?.imageUrl) {
        form.setValue("photo", data.imageUrl, { shouldValidate: true });
        toast.success("Image uploaded", { description: "Photo URL field has been updated." });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error("Image upload failed", { description: msg });
    } finally {
      setUploading(false);
    }
  };

  const createProject = useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      form.reset(defaultValues);
      navigate("/admin/projects");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to create project";
      if (msg.toLowerCase().includes("401") || msg.toLowerCase().includes("403")) {
        toast.error("Authorization required", { description: "Please login as admin to create a project." });
      } else {
        toast.error("Failed to create project", { description: msg });
      }
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    const payload: CreateProjectPayload = {
      title: values.title,
      description: values.description,
      image: values.photo || undefined,
      video: values.video || undefined,
      technologies: String(values.technologies)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      type: values.type,
      githubLink: values.githubLink || undefined,
      demoLink: values.liveDemo || undefined,
    };
    createProject.mutate(payload);
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <FolderPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Create Project</h1>
            <p className="text-sm text-muted-foreground mt-1">Add a new project to your portfolio</p>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            Project Details
          </CardTitle>
          <CardDescription>Fill in the information below to create a new project</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Amazing Project" className="h-11" {...field} />
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
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="What is this project about?" rows={5} className="resize-none" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-primary" />
                        Project Image
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="h-11"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              void handleImageUpload(file);
                            }
                          }}
                        />
                      </FormControl>
                      {uploading && (
                        <span className="text-xs text-muted-foreground mt-1">Uploading image...</span>
                      )}
                      {/* keep field in form state so upload handler can set the URL */}
                      <input type="hidden" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        Video URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." className="h-11" {...field} />
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
                    <FormLabel className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-primary" />
                      Technologies
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="React, Node, MongoDB" className="h-11" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        Project Type
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
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
                      <FormLabel className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-primary" />
                        GitHub Link
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username/repo" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="liveDemo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-primary" />
                        Live Demo URL
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-live-site.com" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset(defaultValues)}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProject.isPending}
                  className="gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Save className="h-4 w-4" />
                  {createProject.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

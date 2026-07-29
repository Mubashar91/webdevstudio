import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, RefreshCw, Plus, Eye, Pencil, Trash2, FolderOpen } from "lucide-react";

type Project = {
  _id: string;
  title: string;
  description?: string;
  photo?: string;
  video?: string;
  technologies?: string[];
  type: "MERN" | "Node" | "React" | "Other";
  githubLink?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminProjects() {
  const API_URL = ((import.meta as unknown) as { env?: Record<string, string | undefined> }).env?.VITE_API_URL || "http://localhost:5000";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/projects`);
      if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
      return res.json();
    },
  });

  const projects = useMemo<Project[]>(() => (Array.isArray(data) ? data as Project[] : []), [data]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return projects;
    const q = query.toLowerCase();
    return projects.filter((p) =>
      [p.title, p.type, (p.technologies || []).join(", ")]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [projects, query]);

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error((await res.text()) || `Delete failed (${res.status})`);
      return true;
    },
    onSuccess: async () => {
      toast.success("Project deleted");
      await refetch();
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast.error("Failed to delete", { description: msg });
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and organize your portfolio projects</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold mt-1">{projects.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20 hover:shadow-lg hover:shadow-accent/10 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Filtered Results</p>
                <p className="text-3xl font-bold mt-1">{filtered.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <Search className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
                <div className="flex gap-2 mt-2">
                  <Link to="/admin/projects/new">
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      New
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, type, technology..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            All Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Skeleton className="col-span-4 h-6" />
                  <Skeleton className="col-span-2 h-6" />
                  <Skeleton className="col-span-3 h-6" />
                  <Skeleton className="col-span-2 h-6" />
                  <Skeleton className="col-span-1 h-6" />
                </div>
              ))}
            </div>
          )}
          {isError && <p className="text-destructive">Failed to load projects</p>}

          {!isLoading && !isError && (
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <FolderOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">No projects found</p>
                <p className="text-sm text-muted-foreground mb-6">{query ? `No results for "${query}"` : "Get started by creating your first project"}</p>
                <div className="flex gap-2">
                  {query && <Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>}
                  <Link to="/admin/projects/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Project
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Technologies</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p: Project) => (
                      <TableRow key={p._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30">
                            {p.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {Array.isArray(p.technologies) && p.technologies.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {p.technologies.map((t) => (
                                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link to={`/projects/${p._id}`}>
                              <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10 hover:text-primary">
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                            </Link>
                            <Link to={`/admin/projects/${p._id}/edit`}>
                              <Button variant="ghost" size="sm" className="gap-1 hover:bg-accent/10 hover:text-accent">
                                <Pencil className="h-4 w-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => {
                                if (deleteProject.isPending) return;
                                const ok = window.confirm(`Delete project "${p.title}"?`);
                                if (ok) deleteProject.mutate(p._id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">{deleteProject.isPending ? "Deleting..." : "Delete"}</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

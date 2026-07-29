import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { LayoutDashboard, FolderOpen, FileText, Sparkles, ArrowRight, Users, CheckCircle2, Mail } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  isFeatured?: boolean;
}

interface Requirement {
  _id: string;
  name: string;
  email: string;
  status?: "New" | "In Progress" | "Done" | string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

  const {
    data: projects,
    isLoading: projectsLoading,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/projects`);
      if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
      return res.json();
    },
  });

  const {
    data: requirements,
    isLoading: requirementsLoading,
  } = useQuery<Requirement[]>({
    queryKey: ["requirements"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/requirements`);
      if (!res.ok) throw new Error(`Failed to load requirements (${res.status})`);
      return res.json();
    },
  });

  const totalProjects = projects?.length ?? 0;
  const featuredProjects = useMemo(
    () => (projects || []).filter((p) => p.isFeatured).length,
    [projects]
  );

  const totalRequirements = requirements?.length ?? 0;
  const newRequirements = useMemo(
    () => (requirements || []).filter((r) => (r.status || "New") === "New").length,
    [requirements]
  );

  const latestRequirement = useMemo(
    () => (requirements && requirements.length > 0 ? requirements[0] : undefined),
    [requirements]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 shadow-sm">
            <LayoutDashboard className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your portfolio projects and incoming client requirements.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/projects/new">
            <Button size="sm" className="gap-2 shadow-md hover:shadow-lg">
              <Sparkles className="h-4 w-4" />
              New Project
            </Button>
          </Link>
          <Link to="/admin/requirements">
            <Button size="sm" variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              View Requirements
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-card to-card/60 border-primary/20 shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Projects</p>
              <p className="text-3xl font-bold mt-1">
                {projectsLoading ? <Skeleton className="h-8 w-16" /> : totalProjects}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Showcased on your public portfolio.</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/60 border-accent/20 shadow-md hover:shadow-lg hover:shadow-accent/10 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Featured Projects</p>
              <p className="text-3xl font-bold mt-1">
                {projectsLoading ? <Skeleton className="h-8 w-16" /> : featuredProjects}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Highlighted prominently on the homepage.</p>
            </div>
            <div className="p-3 rounded-xl bg-accent/10">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/60 border-border shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">New Requirements</p>
              <p className="text-3xl font-bold mt-1">
                {requirementsLoading ? <Skeleton className="h-8 w-16" /> : newRequirements}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Waiting for your review.</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/60">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section: Recent activity + quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent requirement */}
        <Card className="bg-gradient-to-br from-card to-card/60 backdrop-blur-sm shadow-md border border-border/60">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Latest Requirement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {requirementsLoading && (
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
            )}
            {!requirementsLoading && !latestRequirement && (
              <p className="text-sm text-muted-foreground">
                No requirements yet. Once someone submits the contact form, the latest request will appear here.
              </p>
            )}
            {latestRequirement && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {latestRequirement.name}
                      {latestRequirement.status && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {latestRequirement.status}
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {latestRequirement.email}
                    </p>
                  </div>
                  {latestRequirement.createdAt && (
                    <p className="text-xs text-muted-foreground text-right">
                      {new Date(latestRequirement.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {/* description is not on Requirement type here, but we keep layout flexible */}
                  Recent project requirement from your contact form.
                </p>
                <Link to="/admin/requirements">
                  <Button variant="ghost" size="sm" className="gap-1 px-0 text-xs">
                    View all requirements
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick admin shortcuts */}
        <Card className="bg-gradient-to-br from-card to-card/60 backdrop-blur-sm shadow-md border border-border/60">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/80 px-3 py-2">
              <div>
                <p className="font-medium flex items-center gap-1">
                  Manage Projects
                </p>
                <p className="text-xs text-muted-foreground">
                  Edit, feature, or remove portfolio projects.
                </p>
              </div>
              <Link to="/admin/projects">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  Open
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/80 px-3 py-2">
              <div>
                <p className="font-medium flex items-center gap-1">
                  Review Requirements
                </p>
                <p className="text-xs text-muted-foreground">
                  Follow up with potential clients and update statuses.
                </p>
              </div>
              <Link to="/admin/requirements">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  Open
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/80 px-3 py-2">
              <div>
                <p className="font-medium flex items-center gap-1">
                  Create New Project
                </p>
                <p className="text-xs text-muted-foreground">
                  Add a new case study to your portfolio.
                </p>
              </div>
              <Link to="/admin/projects/new">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  Open
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

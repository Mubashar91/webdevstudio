import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, FileText, CalendarRange, FolderOpen, Search } from "lucide-react";

type Requirement = {
  _id: string;
  name: string;
  email: string;
  projectType: "MERN" | "Node" | "React" | "Other" | string;
  description: string;
  budget?: string;
  timeline?: string;
  createdAt?: string;
  status?: "New" | "In Progress" | "Done" | string;
};

export default function AdminRequirements() {
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["requirements"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/requirements`);
      if (!res.ok) throw new Error(`Failed to load requirements (${res.status})`);
      return res.json();
    },
  });

  const requirements = useMemo<Requirement[]>(
    () => (Array.isArray(data) ? (data as Requirement[]) : []),
    [data]
  );

  const people = useMemo(
    () => {
      const seen = new Set<string>();
      const list: { name: string; email: string }[] = [];
      for (const r of requirements) {
        if (!r.email) continue;
        if (seen.has(r.email)) continue;
        seen.add(r.email);
        list.push({ name: r.name || r.email, email: r.email });
      }
      return list;
    },
    [requirements]
  );

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Requirements
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View all project requirements submitted via the contact form
            </p>
          </div>
        </div>
      </div>

      {/* Stats + Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requirements</p>
                <p className="text-3xl font-bold mt-1">{requirements.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20 hover:shadow-lg hover:shadow-accent/10 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                <p className="text-sm mt-1 text-muted-foreground">
                  {requirements[0]?.createdAt
                    ? new Date(requirements[0].createdAt).toLocaleString()
                    : "No submissions yet"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <CalendarRange className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Quick Filter</p>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    disabled
                    placeholder="Search coming soon..."
                    className="pl-7 h-9 bg-card/50 backdrop-blur-sm border-border text-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* People list (simple view) */}
      <Card className="mb-6 bg-gradient-to-br from-card to-card/60 backdrop-blur-sm shadow-md border border-border/60">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            People (Name & Email)
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              {people.length} unique contacts
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading && <p className="text-xs text-muted-foreground">Loading contacts...</p>}
          {!isLoading && people.length === 0 && (
            <p className="text-xs text-muted-foreground">No contacts yet. Once someone submits the form, they will appear here.</p>
          )}
          {!isLoading && people.length > 0 && (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {people.map((p) => (
                <div
                  key={p.email}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-card/80 px-3 py-2 text-xs hover:bg-muted/40 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {p.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirements Table */}
      <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            Submitted Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <Skeleton className="col-span-3 h-6" />
                  <Skeleton className="col-span-3 h-6" />
                  <Skeleton className="col-span-2 h-6" />
                  <Skeleton className="col-span-2 h-6" />
                  <Skeleton className="col-span-2 h-6" />
                </div>
              ))}
            </div>
          )}
          {isError && <p className="text-destructive">Failed to load requirements</p>}

          {!isLoading && !isError && requirements.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Mail className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">No requirements submitted yet</p>
              <p className="text-sm text-muted-foreground mb-2">
                Once someone submits the contact form, their project details will appear here.
              </p>
            </div>
          )}

          {!isLoading && !isError && requirements.length > 0 && (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Project Type</TableHead>
                    <TableHead className="font-semibold">Budget</TableHead>
                    <TableHead className="font-semibold">Timeline</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements.map((r) => (
                    <TableRow
                      key={r._id}
                      className="hover:bg-muted/30 transition-colors align-top cursor-pointer"
                      onClick={() => navigate(`/admin/requirements/${r._id}`)}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{r.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {r.email}
                          </span>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {r.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-gradient-to-r from-primary/15 to-accent/15 text-primary border-primary/20 text-xs">
                          {r.projectType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {r.budget || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {r.timeline || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {r.status || "New"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
 }

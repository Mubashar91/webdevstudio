import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowLeft, CalendarRange, Clock, FileText, CheckCircle2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Requirement {
  _id: string;
  name: string;
  email: string;
  projectType: "MERN" | "Node" | "React" | "Other" | string;
  description: string;
  budget?: string;
  timeline?: string;
  status?: "New" | "In Progress" | "Done" | string;
  createdAt?: string;
}

const STATUS_OPTIONS: Array<Requirement["status"]> = ["New", "In Progress", "Done"];

export default function AdminRequirementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

  const {
    data,
    isLoading,
    isError,
  } = useQuery<Requirement | null>({
    queryKey: ["requirement", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/requirements/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to load requirement (${res.status})`);
      return res.json();
    },
  });

  const deleteRequirement = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/requirements/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to delete requirement (${res.status})`);
      }
      return true;
    },
    onSuccess: () => {
      toast({ title: "Requirement deleted" });
      queryClient.invalidateQueries({ queryKey: ["requirements"] });
      navigate("/admin/requirements");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to delete requirement";
      toast({ title: "Delete failed", description: msg, variant: "destructive" });
    },
  });

  const [status, setStatus] = useState<Requirement["status"]>("New");

  useEffect(() => {
    if (data?.status) {
      setStatus(data.status as Requirement["status"]);
    }
  }, [data?.status]);

  const updateStatus = useMutation({
    mutationFn: async (newStatus: Requirement["status"]) => {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/requirements/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to update status (${res.status})`);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Status updated" });
      queryClient.invalidateQueries({ queryKey: ["requirement", id] });
      queryClient.invalidateQueries({ queryKey: ["requirements"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast({ title: "Update failed", description: msg, variant: "destructive" });
    },
  });

  const requirement = data ?? undefined;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">Loading requirement...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-destructive">Failed to load requirement.</p>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="py-10 flex flex-col items-center gap-4">
            <p className="text-lg font-semibold">Requirement not found</p>
            <Button variant="ghost" onClick={() => navigate("/admin/requirements")}> 
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requirements
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="mb-2 gap-2 text-sm text-muted-foreground hover:text-primary"
        onClick={() => navigate("/admin/requirements")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Requirements
      </Button>

      <Card className="bg-gradient-to-br from-card to-card/60 shadow-xl border border-border/60">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            Requirement Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{requirement.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{requirement.email}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary" className="bg-gradient-to-r from-primary/15 to-accent/15 text-primary border-primary/20">
                  {requirement.projectType}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarRange className="h-3 w-3" />
                  <span>
                    {requirement.createdAt
                      ? new Date(requirement.createdAt).toLocaleString()
                      : "Created at unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Project Details
            </h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {requirement.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Estimated Budget</p>
              <p className="text-sm">{requirement.budget || "Not specified"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Timeline</p>
              <p className="text-sm">{requirement.timeline || "Not specified"}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Status
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Requirement["status"])}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                className="gap-2"
                disabled={updateStatus.isPending || status === requirement.status}
                onClick={() => updateStatus.mutate(status)}
              >
                <CheckCircle2 className="h-4 w-4" />
                {updateStatus.isPending ? "Saving..." : "Save Status"}
              </Button>
              {requirement.status && (
                <Badge variant="outline" className="text-xs">
                  Current: {requirement.status}
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                disabled={deleteRequirement.isPending}
                onClick={() => {
                  if (deleteRequirement.isPending) return;
                  const ok = window.confirm("Delete this requirement? This action cannot be undone.");
                  if (ok) deleteRequirement.mutate();
                }}
              >
                <Trash2 className="h-4 w-4" />
                {deleteRequirement.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

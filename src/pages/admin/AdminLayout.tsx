import { PropsWithChildren, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderPlus, LogOut, Home, Sparkles, FileText, Moon, Sun } from "lucide-react";

const navItems = [
  { to: "/admin/projects", label: "Projects", icon: LayoutDashboard },
  { to: "/admin/requirements", label: "Requirements", icon: FileText },
  { to: "/admin/projects/new", label: "Create Project", icon: FolderPlus },
];

export default function AdminLayout(_props: PropsWithChildren) {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-gradient-to-br from-background via-background to-primary/5">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col border-r bg-gradient-to-b from-card/50 to-card backdrop-blur-sm">
        <div className="h-16 flex items-center px-5 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <Link to="/admin/projects" className="flex items-center gap-2 font-bold text-lg group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-3">
          <ul className="space-y-2">
            {navItems.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      "hover:bg-primary/10 hover:text-primary hover:shadow-md",
                      isActive
                        ? "bg-gradient-to-r from-primary/15 to-primary/10 text-primary shadow-md border border-primary/20"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <n.icon className="h-5 w-5" />
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-3 border-t bg-gradient-to-r from-card to-card/50">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-col">
        {/* Topbar */}
        <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center px-4 md:px-6 gap-3 shadow-sm">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Link to="/admin" className="text-sm font-semibold hover:text-primary transition-colors">
            Dashboard
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1.5 shadow-sm">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/70 to-accent/70 flex items-center justify-center text-xs font-semibold text-primary-foreground">
                A
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs text-muted-foreground">Signed in as</span>
                <span className="text-xs font-medium">Admin</span>
              </div>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full border-border/60 bg-card/70 hover:bg-accent/10 hover:text-primary"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Link to="/admin/projects/new">
              <Button size="sm" className="gap-2 shadow-md hover:shadow-lg transition-all">
                <FolderPlus className="h-4 w-4" />
                <span className="hidden sm:inline">New Project</span>
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2 md:flex hidden hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

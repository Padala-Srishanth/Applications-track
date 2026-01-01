import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getApplications, logout, deleteApplication } from "@/lib/api";
import {
  Briefcase,
  Plus,
  Search,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  LogOut,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ApplicationStatus = "applied" | "interviewing" | "offer" | "rejected";

interface Application {
  id: string;
  company: string;
  position: string;
  url: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  date?: string; // Add date field mapped from backend
  link?: string; // Add link field mapped from backend
}

const statusConfig = {
  applied: { label: "Applied", color: "bg-primary/10 text-primary border-primary/20", icon: Clock },
  interviewing: { label: "Online Assessment / Interview", color: "bg-accent/10 text-accent border-accent/20", icon: MessageSquare },
  offer: { label: "Offer", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [userName, setUserName] = useState<string>("User");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name) {
      setUserName(user.name);
    }

    const fetchApps = async () => {
      try {
        const data = await getApplications();
        // Map backend fields to frontend interface if needed
        const mappedApps = data.map((app: any) => ({
          id: app.id,
          company: app.company,
          position: app.position,
          url: app.link || "",
          status: app.status || "applied",
          appliedDate: app.date || app.createdAt, // Fallback
          notes: "", // Backend doesn't explicitly store notes yet unless in 'content' JSON blob not fully spec'd, assuming simple for now
        }));
        setApplications(mappedApps);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      }
    };
    fetchApps();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interviewing: applications.filter((a) => a.status === "interviewing").length,
    offers: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteApplication(deleteId);
      setApplications(prev => prev.filter(a => a.id !== deleteId));
      toast({
        title: "Application deleted",
        description: "The application has been removed from your list.",
      });
    } catch (e) {
      console.error("Failed to delete", e);
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-4 hidden lg:flex flex-col">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-lg gradient-primary shadow-soft">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">JobTrackr</span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
          >
            <Briefcase className="h-5 w-5" />
            Applications
          </Link>
        </nav>

        {/* User section */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome, {userName}</h1>
              <p className="text-muted-foreground mt-1">Track and manage your job applications</p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/dashboard/new">
                <Plus className="h-4 w-4" />
                Add Application
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, color: "bg-secondary" },
              { label: "Applied", value: stats.applied, color: "bg-primary/10" },
              { label: "Interviewing", value: stats.interviewing, color: "bg-accent/10" },
              { label: "Offers", value: stats.offers, color: "bg-success/10" },
              { label: "Rejected", value: stats.rejected, color: "bg-destructive/10" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`${stat.color} rounded-lg p-4 border border-border`}
              >
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies or positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Company</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Position</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Applied</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredApplications.map((app) => {
                    const StatusIcon = statusConfig[app.status].icon;
                    return (
                      <tr key={app.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg font-semibold text-foreground">
                              {app.company[0]}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{app.company}</p>
                              {app.notes && (
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{app.notes}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">{app.position}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`${statusConfig[app.status].color} gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[app.status].label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(app.appliedDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={app.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/dashboard/edit/${app.id}`)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setDeleteId(app.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No applications found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first job application"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button variant="hero" asChild>
                    <Link to="/dashboard/new">
                      <Plus className="h-4 w-4" />
                      Add Application
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;

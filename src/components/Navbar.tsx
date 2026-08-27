import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Menu,
  X,
  Briefcase,
  FileText,
  LogOut,
  LogIn,
  UserPlus,
  Home,
  User,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-lg font-bold tracking-tight"
        >
          <Briefcase className="h-5 w-5 text-primary" />
          IndoKerja
        </Link>

        <div className="hidden h-5 w-px bg-border sm:block" />

        {/* Desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {user ? (
            <>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      to="/jobs"
                      className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    />
                  }
                >
                  <Home className="h-4 w-4" />
                  <span>Jobs</span>
                </TooltipTrigger>
                <TooltipContent>Browse &amp; apply to jobs</TooltipContent>
              </Tooltip>

              {user.role === "JOB_SEEKER" && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Link
                        to="/my-applications"
                        className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      />
                    }
                  >
                    <FileText className="h-4 w-4" />
                    <span>Applications</span>
                  </TooltipTrigger>
                  <TooltipContent>Track your job applications</TooltipContent>
                </Tooltip>
              )}

              {user.role === "COMPANY" && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Link
                        to="/company/jobs"
                        className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      />
                    }
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>My Jobs</span>
                  </TooltipTrigger>
                  <TooltipContent>Manage your job listings</TooltipContent>
                </Tooltip>
              )}

              <div className="mx-2 h-5 w-px bg-border" />

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.fullName || user.companyName || user.email}</span>
              </div>

              <div className="mx-2 h-5 w-px bg-border" />

              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={handleLogout}
                      className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    />
                  }
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </TooltipTrigger>
                <TooltipContent>Sign out</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      to="/login"
                      className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    />
                  }
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </TooltipTrigger>
                <TooltipContent>Sign in to your account</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link to="/register">
                      <Button size="sm" className="h-8 gap-1.5">
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Register</span>
                      </Button>
                    </Link>
                  }
                >
                  <TooltipContent>Create a new account</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass-nav border-t px-4 pb-4 pt-2 sm:hidden">
          <div className="flex flex-col gap-1">
            {user?.role === "JOB_SEEKER" && (
              <Link
                to="/my-applications"
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={closeMobile}
              >
                <FileText className="h-4 w-4" />
                My Applications
              </Link>
            )}
            {user?.role === "COMPANY" && (
              <Link
                to="/company/jobs"
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={closeMobile}
              >
                <Briefcase className="h-4 w-4" />
                My Jobs
              </Link>
            )}
            {user && (
              <>
                <div className="my-1 h-px bg-border" />
                <div className="flex items-center gap-2 px-2.5 py-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {user.fullName || user.companyName || user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" onClick={closeMobile}>
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <LogIn className="h-3.5 w-3.5" />
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMobile}>
                  <Button size="sm" className="w-full gap-1.5">
                    <UserPlus className="h-3.5 w-3.5" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

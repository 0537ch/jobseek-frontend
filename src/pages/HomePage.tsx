import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Briefcase,
  Building2,
  FileText,
  Shield,
  ArrowRight,
  Zap,
  Users,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Browse Jobs",
    desc: "Find opportunities that match your skills and interests.",
  },
  {
    icon: Building2,
    title: "Top Companies",
    desc: "Connect with leading companies across Indonesia.",
  },
  {
    icon: FileText,
    title: "Track Applications",
    desc: "Monitor your application status in real-time.",
  },
  {
    icon: Shield,
    title: "Secure & Fast",
    desc: "Enterprise-grade security with instant notifications.",
  },
];

const stats = [
  { icon: Briefcase, value: "10+", label: "Open Positions" },
  { icon: Building2, value: "4", label: "Companies" },
  { icon: Users, value: "5", label: "Job Seekers" },
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-1 items-center justify-center px-4 py-16 text-center sm:py-24">
        <div className="max-w-2xl">
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            Job Application Platform
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Find Your Next
            <span className="text-primary"> Dream Job</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground sm:text-lg">
            IndoKerja.id connects talented job seekers with top companies across
            Indonesia. Apply with one click and track your progress.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link to={user ? "/jobs" : "/register"}>
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                }
              />
              <TooltipContent>
                {user ? "Go to job listings" : "Create your free account"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Link to="/jobs">
                    <Button variant="outline" size="lg">
                      Browse Jobs
                    </Button>
                  </Link>
                }
              />
              <TooltipContent>View all available positions</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t px-4 py-12">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="glass flex flex-col items-center rounded-xl p-4 text-center">
              <s.icon className="h-6 w-6 text-primary" />
              <p className="mt-2 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold">
            Why IndoKerja?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-xl p-5">
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            {[
              { step: "1", text: "Create an account" },
              { step: "2", text: "Browse & apply" },
              { step: "3", text: "Get hired" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4">
                <div className="glass flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary">
                  {s.step}
                </div>
                <span className="text-sm font-medium">{s.text}</span>
                {i < 2 && (
                  <ArrowRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="glass mx-auto max-w-2xl rounded-2xl p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Ready to Start?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join IndoKerja.id and find your next opportunity today.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link to={user ? "/jobs" : "/register"}>
                    <Button>
                      {user ? "Go to Jobs" : "Sign Up Free"}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                }
              />
              <TooltipContent>
                {user ? "Go to job listings" : "Create your free account"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        IndoKerja.id &copy; {new Date().getFullYear()}. Job Application Management.
      </footer>
    </div>
  );
}

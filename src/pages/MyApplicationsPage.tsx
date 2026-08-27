import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react";
import type { Application } from "@/types";

function ApplicationSkeleton() {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="skeleton h-4 w-48" />
          <div className="skeleton h-3 w-40" />
        </div>
        <div className="skeleton h-5 w-20" />
      </div>
    </div>
  );
}

export function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get<Application[]>("/applications/my");
        setApplications(data);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Link to="/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Jobs
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">My Applications</h1>
          {!loading && applications.length > 0 && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {applications.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            <ApplicationSkeleton />
            <ApplicationSkeleton />
            <ApplicationSkeleton />
          </div>
        ) : applications.length === 0 ? (
          <div className="glass flex flex-col items-center justify-center rounded-xl p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">No applications yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Browse jobs and start applying
            </p>
            <Link to="/jobs" className="mt-4">
              <Button size="sm" variant="outline">
                Browse Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map((app) => (
              <div key={app.id} className="glass rounded-xl p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">
                      {app.job?.title}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {app.job?.company.companyName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {app.job?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(app.appliedAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

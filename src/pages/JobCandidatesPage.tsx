import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Users,
  Calendar,
  Mail,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import type { Application, ApplicationHistory } from "@/types";

const STATUSES = [
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
] as const;

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

const STATUS_COLORS: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  REVIEWING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  SHORTLISTED: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400",
  ACCEPTED: "bg-green-500/10 text-green-600 dark:text-green-400",
};

function CandidateSkeleton() {
  return (
    <div className="liquid-glass rounded-xl p-4">
      <div className="flex items-center gap-4">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton h-4 w-40" />
          <div className="skeleton h-3 w-56" />
        </div>
        <div className="skeleton h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function JobCandidatesPage() {
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId] = useState<string | null>(null);

  const [confirmTarget, setConfirmTarget] = useState<{
    app: Application;
    newStatus: string;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const [historyAppId, setHistoryAppId] = useState<string | null>(null);
  const [history, setHistory] = useState<ApplicationHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get<Application[]>(
          `/jobs/${id}/applications`,
        );
        setApplications(data);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [id]);

  const requestStatusChange = (app: Application, newStatus: string) => {
    if (newStatus === app.status) return;
    setConfirmTarget({ app, newStatus });
  };

  const confirmStatusChange = async () => {
    if (!confirmTarget) return;
    setConfirming(true);
    try {
      const { data } = await api.patch<Application>(
        `/applications/${confirmTarget.app.id}/status`,
        { status: confirmTarget.newStatus },
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === confirmTarget.app.id ? { ...app, status: data.status } : app,
        ),
      );
      toast.success(
        `Status updated to ${STATUS_LABELS[confirmTarget.newStatus]}`,
      );
      setConfirmTarget(null);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setConfirming(false);
    }
  };

  const openHistory = async (applicationId: string) => {
    setHistoryAppId(applicationId);
    setHistoryLoading(true);
    try {
      const { data } = await api.get<ApplicationHistory[]>(
        `/applications/${applicationId}/history`,
      );
      setHistory(data);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="liquid-page">
      <Navbar />
      <main className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="liquid-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <Link to="/company/jobs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" />
                My Jobs
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Candidates</h1>
            {!loading && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {applications.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              <CandidateSkeleton />
              <CandidateSkeleton />
              <CandidateSkeleton />
            </div>
          ) : applications.length === 0 ? (
            <div className="liquid-glass flex flex-col items-center justify-center rounded-xl p-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">No applications yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Candidates will appear here once they apply
            </p>
          </div>
        ) : (
            <div className="space-y-3">
            {applications.map((app) => {
              const name = app.jobSeeker?.fullName || app.jobSeeker?.email || "";
              const initials = name
                ? name
                    .trim()
                    .split(/\s+/)
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "?";

              return (
                <div key={app.id} className="liquid-glass rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium">
                        {app.jobSeeker?.fullName || "Unknown"}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {app.jobSeeker?.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(app.appliedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          requestStatusChange(app, e.target.value)
                        }
                        disabled={updatingId === app.id}
                        className={`flex h-8 appearance-none rounded-lg border border-input bg-transparent px-2 py-1 text-xs font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 ${STATUS_COLORS[app.status] || ""}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => openHistory(app.id)}
                      >
                        <Clock className="h-3 w-3" />
                        History
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </main>

      {/* Confirm Status Change */}
      <Dialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
      >
        <DialogContent className="glass sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          {confirmTarget && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Change{" "}
                <span className="font-medium text-foreground">
                  {confirmTarget.app.jobSeeker?.fullName || confirmTarget.app.jobSeeker?.email}
                </span>
                &apos;s status from{" "}
                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ${STATUS_COLORS[confirmTarget.app.status]}`}>
                  {STATUS_LABELS[confirmTarget.app.status]}
                </span>{" "}
                to{" "}
                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ${STATUS_COLORS[confirmTarget.newStatus]}`}>
                  {STATUS_LABELS[confirmTarget.newStatus]}
                </span>
                ?
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmTarget(null)}
              disabled={confirming}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={confirmStatusChange}
              disabled={confirming}
            >
              {confirming ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History */}
      <Dialog
        open={historyAppId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setHistoryAppId(null);
            setHistory([]);
          }
        }}
      >
        <DialogContent className="glass sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Application History</DialogTitle>
          </DialogHeader>
          {historyLoading ? (
            <div className="space-y-2">
              <div className="skeleton h-10 w-full rounded-lg" />
              <div className="skeleton h-10 w-full rounded-lg" />
            </div>
          ) : history.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No history yet.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <StatusBadge status={h.status} />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(h.changedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

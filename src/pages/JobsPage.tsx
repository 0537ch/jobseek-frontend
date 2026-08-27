import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Banknote,
  Building2,
  Briefcase,
  Clock,
  Users,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import type { Job } from "@/types";

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"] as const;

function formatSalary(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function JobListItem({
  job,
  isSelected,
  onClick,
}: {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`glass w-full rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.01] ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{job.title}</h3>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Building2 className="h-3 w-3 shrink-0" />
            {job.company.companyName || job.company.email}
          </p>
        </div>
        <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
          {job.jobType.replace("_", " ")}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-0.5">
          <MapPin className="h-2.5 w-2.5" />
          {job.location}
        </span>
        {(job.salaryMin || job.salaryMax) && (
          <span className="flex items-center gap-0.5">
            <Banknote className="h-2.5 w-2.5" />
            {job.salaryMin && job.salaryMax
              ? `${formatSalary(job.salaryMin)} – ${formatSalary(job.salaryMax)}`
              : job.salaryMin
                ? `From ${formatSalary(job.salaryMin)}`
                : `Up to ${formatSalary(job.salaryMax!)}`}
          </span>
        )}
      </div>
    </button>
  );
}

function JobDetailSkeleton() {
  return (
    <div className="glass rounded-xl p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="skeleton h-6 w-56" />
          <div className="skeleton h-4 w-36" />
        </div>
        <div className="flex gap-4">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="skeleton h-4 w-48" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}

function PlaceholderPanel() {
  return (
    <div className="glass flex h-full min-h-[500px] flex-col items-center justify-center rounded-xl p-8 text-center">
      <Briefcase className="h-12 w-12 text-muted-foreground/30" />
      <p className="mt-4 text-sm font-medium text-muted-foreground">
        Select a job to view details
      </p>
      <p className="text-xs text-muted-foreground/70">
        Click on any job from the list
      </p>
    </div>
  );
}

export function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string>("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (jobType) params.set("jobType", jobType);
        const { data } = await api.get<Job[]>(`/jobs?${params.toString()}`);
        setJobs(data);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [location, jobType]);

  const handleSelectJob = async (job: Job) => {
    setSelectedJob(job);
    setDetailLoading(true);
    try {
      const { data } = await api.get<Job>(`/jobs/${job.id}`);
      setSelectedJob(data);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      await api.post(`/jobs/${selectedJob.id}/apply`);
      toast.success("Application submitted!");
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      const msg = apiErr.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to apply",
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 p-4 sm:p-6 lg:flex-row">
        {/* Left: Job List (1/3) */}
        <div className="flex min-h-0 w-full flex-col lg:w-1/3 lg:min-w-0">
          <h1 className="mb-3 text-lg font-semibold">Browse Jobs</h1>

          {/* Filters */}
          <div className="mb-3 flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="glass h-8 pl-8 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="glass flex h-8 w-full appearance-none rounded-lg border border-input bg-transparent pl-8 pr-2.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">All Types</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job List - Scrollable */}
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="glass rounded-xl p-3">
                    <div className="space-y-2">
                      <div className="skeleton h-4 w-40" />
                      <div className="skeleton h-3 w-32" />
                      <div className="skeleton h-3 w-48" />
                    </div>
                  </div>
                ))}
              </>
            ) : jobs.length === 0 ? (
              <div className="glass flex flex-col items-center justify-center rounded-xl p-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium">No jobs found</p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <JobListItem
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onClick={() => handleSelectJob(job)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: Job Detail (2/3) */}
        <div className="flex min-h-0 w-full flex-col lg:w-2/3 lg:min-w-0">
          <p className="mb-3 text-xs font-medium text-muted-foreground">
            Job Detail
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {detailLoading ? (
              <JobDetailSkeleton />
            ) : selectedJob ? (
              <div className="glass rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedJob.title}
                    </h2>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      {selectedJob.company.companyName ||
                        selectedJob.company.email}
                    </p>
                  </div>
                  <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                    {selectedJob.jobType.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {selectedJob.location}
                  </span>
                  {(selectedJob.salaryMin || selectedJob.salaryMax) && (
                    <span className="flex items-center gap-1.5">
                      <Banknote className="h-4 w-4" />
                      {selectedJob.salaryMin && selectedJob.salaryMax
                        ? `${formatSalary(selectedJob.salaryMin)} – ${formatSalary(selectedJob.salaryMax)}`
                        : selectedJob.salaryMin
                          ? `From ${formatSalary(selectedJob.salaryMin)}`
                          : `Up to ${formatSalary(selectedJob.salaryMax!)}`}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {selectedJob._count?.applications ?? 0} applicants
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Posted{" "}
                    {new Date(selectedJob.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-medium">Description</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="mt-6">
                  {user?.role === "JOB_SEEKER" && (
                    <Button
                      className="w-full"
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? "Applying..." : "Apply Now"}
                    </Button>
                  )}
                  {user?.role === "COMPANY" && (
                    <p className="text-center text-xs text-muted-foreground">
                      Company accounts cannot apply to jobs
                    </p>
                  )}
                  {!user && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => (window.location.href = "/login")}
                    >
                      Login to Apply
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <PlaceholderPanel />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

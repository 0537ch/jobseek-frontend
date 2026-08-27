import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Pencil,
  Briefcase,
  MapPin,
  Banknote,
  Users,
  ArrowLeft,
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

interface JobForm {
  title: string;
  description: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  jobType: (typeof JOB_TYPES)[number];
}

const emptyForm: JobForm = {
  title: "",
  description: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  jobType: "FULL_TIME",
};

function JobSkeleton() {
  return (
    <div className="liquid-glass rounded-xl p-4">
      <div className="flex items-center gap-4">
        <div className="skeleton h-10 w-10 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton h-4 w-48" />
          <div className="skeleton h-3 w-56" />
        </div>
        <div className="skeleton h-6 w-20" />
      </div>
    </div>
  );
}

export function CompanyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const shakeTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const triggerShake = useCallback((field: string) => {
    setShakeField(field);
    if (shakeTimer.current) clearTimeout(shakeTimer.current);
    shakeTimer.current = setTimeout(() => setShakeField(null), 500);
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get<Job[]>("/jobs/my/list");
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchJobs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const openCreate = () => {
    setEditingJob(null);
    setForm(emptyForm);
    setFieldErrors({});
    setShowForm(true);
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      description: job.description,
      location: job.location,
      salaryMin: job.salaryMin?.toString() || "",
      salaryMax: job.salaryMax?.toString() || "",
      jobType: job.jobType,
    });
    setFieldErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    try {
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        jobType: form.jobType,
      };

      if (editingJob) {
        await api.patch(`/jobs/${editingJob.id}`, payload);
        toast.success("Job updated successfully");
      } else {
        await api.post("/jobs", payload);
        toast.success("Job created successfully");
      }
      setForm(emptyForm);
      setEditingJob(null);
      setShowForm(false);
      await fetchJobs();
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string | string[] } };
      };
      const msg = apiErr.response?.data?.message;
      if (Array.isArray(msg)) {
        const fieldMap: Record<string, string> = {};
        msg.forEach((m) => {
          if (m.toLowerCase().includes("title")) fieldMap.title = m;
          else if (m.toLowerCase().includes("description"))
            fieldMap.description = m;
          else if (m.toLowerCase().includes("location")) fieldMap.location = m;
          else if (m.toLowerCase().includes("salary")) {
            if (m.includes("Min")) fieldMap.salaryMin = m;
            else fieldMap.salaryMax = m;
          } else fieldMap.general = m;
        });
        setFieldErrors(fieldMap);
        if (fieldMap.title) triggerShake("title");
        else if (fieldMap.description) triggerShake("description");
        else if (fieldMap.location) triggerShake("location");
      } else {
        setFieldErrors({ general: msg || "Failed to save job" });
        triggerShake("all");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/jobs/${deleteTarget.id}`);
      setDeleteTarget(null);
      toast.success("Job deleted");
      await fetchJobs();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(
        typeof apiErr.response?.data?.message === "string"
          ? apiErr.response.data.message
          : "Failed to delete job",
      );
    } finally {
      setDeleting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingJob(null);
    setForm(emptyForm);
    setFieldErrors({});
    setShakeField(null);
  };

  const inputClass = (field: string) =>
    `transition-all duration-200 ${
      shakeField === field || shakeField === "all" ? "input-error" : ""
    }`;

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(
        e.key,
      )
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="liquid-page">
      <Navbar />
      <main className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="liquid-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/jobs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Jobs
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">My Jobs</h1>
              {!loading && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  {jobs.length}
                </span>
              )}
            </div>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1 h-3.5 w-3.5" /> Create
            </Button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <>
                <JobSkeleton />
                <JobSkeleton />
                <JobSkeleton />
              </>
            ) : jobs.length === 0 ? (
              <div className="liquid-glass flex flex-col items-center justify-center rounded-xl p-8 text-center">
                <Briefcase className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium">No jobs posted yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click &quot;Create&quot; to post your first listing
                </p>
              </div>
            ) : (
              jobs.map((job) => {
                const companyInitials = "Y";
                return (
                  <div key={job.id} className="liquid-glass rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {companyInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium">
                          {job.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Banknote className="h-3 w-3" />
                            {job.salaryMin || job.salaryMax
                              ? `${job.salaryMin ? formatSalary(job.salaryMin) : "?"} – ${job.salaryMax ? formatSalary(job.salaryMax) : "?"}`
                              : "Not specified"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job._count?.applications ?? 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Link to={`/company/jobs/${job.id}/candidates`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                          >
                            Candidates
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(job)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(job)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
      >
        <DialogContent className="glass sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? "Edit Job" : "Create Job"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            {fieldErrors.general && (
              <p className="text-xs text-destructive">{fieldErrors.general}</p>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input
                name="title"
                placeholder="Software Engineer"
                value={form.title}
                onChange={handleChange}
                className={`h-8 text-sm ${inputClass("title")}`}
                maxLength={100}
                required
              />
              {fieldErrors.title && (
                <p className="text-[11px] text-destructive">
                  {fieldErrors.title}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <textarea
                name="description"
                rows={3}
                placeholder="Job description..."
                value={form.description}
                onChange={handleChange}
                className={`glass flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-all duration-200 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
                  shakeField === "description" || shakeField === "all"
                    ? "input-error"
                    : ""
                }`}
                maxLength={2000}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Location</Label>
                <Input
                  name="location"
                  placeholder="Jakarta"
                  value={form.location}
                  onChange={handleChange}
                  className={`h-8 text-sm ${inputClass("location")}`}
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Job Type</Label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  className="glass flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Min Salary</Label>
                <Input
                  name="salaryMin"
                  type="number"
                  placeholder="5000000"
                  value={form.salaryMin}
                  onChange={handleChange}
                  onKeyDown={handleNumericKeyDown}
                  min="0"
                  className={`h-8 text-sm ${inputClass("salaryMin")}`}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Max Salary</Label>
                <Input
                  name="salaryMax"
                  type="number"
                  placeholder="10000000"
                  value={form.salaryMax}
                  onChange={handleChange}
                  onKeyDown={handleNumericKeyDown}
                  min="0"
                  className={`h-8 text-sm ${inputClass("salaryMax")}`}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeForm}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting
                  ? editingJob
                    ? "Saving..."
                    : "Creating..."
                  : editingJob
                    ? "Save"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Delete &quot;{deleteTarget?.title}&quot;? This cannot be undone.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              size="sm"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

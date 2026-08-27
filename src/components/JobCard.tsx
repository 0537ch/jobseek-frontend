import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types";

function formatSalary(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link to={`/jobs/${job.id}`}>
      <div className="glass rounded-xl p-5 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-muted-foreground">
              {job.company.companyName || job.company.email}
            </p>
          </div>
          <Badge variant="secondary">{job.jobType.replace("_", " ")}</Badge>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">{job.location}</p>
          {(job.salaryMin || job.salaryMax) && (
            <p className="mt-1 text-sm">
              {job.salaryMin && job.salaryMax
                ? `${formatSalary(job.salaryMin)} – ${formatSalary(job.salaryMax)}`
                : job.salaryMin
                  ? `From ${formatSalary(job.salaryMin)}`
                  : `Up to ${formatSalary(job.salaryMax!)}`}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

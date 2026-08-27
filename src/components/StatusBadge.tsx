import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  APPLIED: { label: "Applied", variant: "secondary" },
  REVIEWING: { label: "Reviewing", variant: "default" },
  SHORTLISTED: { label: "Shortlisted", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  ACCEPTED: { label: "Accepted", variant: "outline" },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

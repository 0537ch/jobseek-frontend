export interface User {
  id: string;
  email: string;
  role: "JOB_SEEKER" | "COMPANY";
  fullName: string | null;
  companyName: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  companyId: string;
  createdAt: string;
  company: {
    id: string;
    email: string;
    companyName: string | null;
  };
  _count?: {
    applications: number;
  };
}

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "REJECTED"
  | "ACCEPTED";

export interface Application {
  id: string;
  jobId: string;
  jobSeekerId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  job?: {
    id: string;
    title: string;
    location: string;
    jobType: string;
    salaryMin: number | null;
    salaryMax: number | null;
    company: {
      id: string;
      companyName: string | null;
    };
  };
  jobSeeker?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export interface ApplicationHistory {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  changedAt: string;
  changedBy: string;
}

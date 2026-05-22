export type DocStatus = 'Approved' | 'InRevision' | 'Pending' | 'Expired';

export interface MedicalDoc {
  id: string;
  name: string;
  code: string;
  referential: string;
  version: string;
  sectionId: string;
  status: DocStatus;
  expirationDate: string; // ISO or YYYY-MM
  submissionDate: string;
  submittedBy: string;
  pages: number;
  description: string;
}

export interface User {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: 'RAM' | 'Quality' | 'Audit';
  roleName: string;
  permissions: string;
  color: string;
}

export interface AuditLog {
  id: string;
  dotColor: 'green' | 'blue' | 'orange' | 'red';
  userName: string;
  action: string;
  dateTime: string;
  ipAddress: string;
}

export interface MdrSection {
  id: string;
  icon: string;
  name: string;
  requiredCount: number;
}

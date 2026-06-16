export type ModuleKey =
  | "dashboard"
  | "students"
  | "teachers"
  | "courses"
  | "schedule"
  | "attendance"
  | "finance"
  | "automation"
  | "alerts"
  | "history";

export type Tone = "positive" | "neutral" | "warning";
export type StudentStatus = "active" | "trial" | "inactive";
export type AttendanceStatus = "present" | "absent" | "late";
export type InvoiceStatus = "paid" | "pending" | "overdue" | "partial";
export type AlertSeverity = "due-soon" | "overdue" | "partial";
export type AlertChannel = "email" | "sms" | "in-app";
export type AutomationChannel = "email" | "whatsapp";
export type AutomationStatus = "live" | "draft";
export type RetentionSignal = "reenroll" | "watch" | "archived";

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  trend: string;
  tone: Tone;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  module: ModuleKey;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  module: ModuleKey;
}

export interface Guardian {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface Student {
  id: string;
  fullName: string;
  status: StudentStatus;
  grade: string;
  program: string;
  weeklySchedule: string;
  guardian: Guardian;
  notes: string;
  balanceDue: number;
}

export interface Teacher {
  id: string;
  fullName: string;
  expertise: string;
  availability: string;
  assignedCourses: number;
  assignedStudents: number;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  weeklyCapacity: number;
  leadTeacher: string;
  enrolledStudents: number;
  location: string;
}

export interface ScheduleSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  course: string;
  teacher: string;
  room: string;
  studentCount: number;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  course: string;
  date: string;
  status: AttendanceStatus;
  billed: boolean;
}

export interface Invoice {
  id: string;
  studentName: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  studentName: string;
  amount: number;
  method: string;
  paidAt: string;
}

export interface FeeAlert {
  id: string;
  studentName: string;
  guardianName: string;
  amountDue: number;
  dueDate: string;
  severity: AlertSeverity;
  channel: AlertChannel;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  audience: string;
  lastRun: string;
  channel: AutomationChannel;
  status: AutomationStatus;
}

export interface HistoryEntry {
  id: string;
  entityType: string;
  entityName: string;
  summary: string;
  happenedAt: string;
  retentionSignal: RetentionSignal;
}

export interface GrowthWidget {
  id: string;
  title: string;
  description: string;
  metric: string;
}

export interface DashboardSummary {
  kpis: DashboardKpi[];
  feeHealth: {
    overdueTotal: number;
    dueThisWeek: number;
    collectionRate: string;
  };
  recentActivities: ActivityItem[];
  quickActions: QuickAction[];
}

export interface FinanceSummary {
  monthlyCollected: number;
  pendingAmount: number;
  overdueAmount: number;
  invoices: Invoice[];
  payments: Payment[];
  monthlyTrend: number[];
}

export interface BootstrapPayload {
  dashboard: DashboardSummary;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  schedule: ScheduleSlot[];
  attendance: AttendanceRecord[];
  finance: FinanceSummary;
  automations: Automation[];
  alerts: FeeAlert[];
  history: HistoryEntry[];
  growth: GrowthWidget[];
}

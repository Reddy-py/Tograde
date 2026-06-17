import { mockBootstrap } from "../data/mock-data";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

type AlertSeverity = string;

interface Guardian {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface Student {
  id: string;
  fullName: string;
  status: string;
  grade: string;
  program: string;
  weeklySchedule: string;
  guardian: Guardian;
  notes: string;
  balanceDue: number;
}

interface Teacher {
  id: string;
  fullName: string;
  expertise: string;
  availability: string;
  assignedCourses: number;
  assignedStudents: number;
}

interface Course {
  id: string;
  title: string;
  category: string;
  weeklyCapacity: number;
  leadTeacher: string;
  enrolledStudents: number;
  location: string;
}

interface ScheduleSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  course: string;
  teacher: string;
  room: string;
  studentCount: number;
}

interface FeeAlert {
  id: string;
  studentName: string;
  guardianName: string;
  amountDue: number;
  dueDate: string;
  severity: AlertSeverity;
  channel: string;
}

interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  trend: string;
  tone: "positive" | "neutral" | "warning";
}

interface FeeHealth {
  overdueTotal: number;
  dueThisWeek: number;
  collectionRate: number;
}

interface BootstrapPayload {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  schedule: ScheduleSlot[];
  alerts: FeeAlert[];
  attendance: unknown;
  finance: unknown;
  automations: unknown;
  history: unknown;
  dashboard: {
    kpis: DashboardKpi[];
    feeHealth: FeeHealth;
  };
}

interface StudentDirectoryRow {
  id: string;
  full_name: string;
  status: Student["status"];
  grade: string;
  primary_program: string;
  days_per_week: string;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
  notes: string | null;
  balance_due: number | null;
}

interface TeacherDirectoryRow {
  id: string;
  full_name: string;
  expertise: string;
  availability_summary: string;
  assigned_courses: number | null;
  assigned_students: number | null;
}

interface CourseCatalogRow {
  id: string;
  title: string;
  category: string;
  weekly_capacity: number;
  lead_teacher: string | null;
  enrolled_students: number | null;
  location: string;
}

interface ScheduleOverviewRow {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  course_title: string;
  teacher_name: string;
  room_name: string;
  student_count: number | null;
}

interface FeeAlertOverviewRow {
  id: string;
  student_name: string;
  guardian_name: string;
  amount_due: number;
  due_date: string;
  severity: AlertSeverity;
  channel: FeeAlert["channel"];
}

// structuredClone(mockBootstrap) may come from a different package copy of types
// and cause incompatible type errors (e.g. string vs number). Cast through
// unknown to force our local BootstrapPayload type.
const cloneBootstrap = (): BootstrapPayload =>
  globalThis.structuredClone(mockBootstrap) as unknown as BootstrapPayload;

// In-memory student store used when Supabase is not configured or for quick additions
let studentsData: Student[] = cloneBootstrap().students.slice();

const buildDashboardKpis = (payload: BootstrapPayload) => [
  {
    id: "students",
    label: "Active Students",
    value: String(
      payload.students.filter((student: Student) => student.status === "active").length
    ),
    trend: `${payload.students.length} total learner records`,
    tone: "positive" as const
  },
  {
    id: "teachers",
    label: "Teaching Team",
    value: String(payload.teachers.length),
    trend: `${payload.courses.length} live course offerings`,
    tone: "positive" as const
  },
  {
    id: "schedule",
    label: "Weekly Time Slots",
    value: String(payload.schedule.length),
    trend: "Current active timetable",
    tone: "neutral" as const
  },
  {
    id: "alerts",
    label: "Open Fee Alerts",
    value: String(payload.alerts.length),
    trend: `${payload.alerts.filter((alert: FeeAlert) => alert.severity === "overdue").length} overdue`,
    tone: payload.alerts.some((alert: FeeAlert) => alert.severity === "overdue")
      ? ("warning" as const)
      : ("neutral" as const)
  }
];

const mapStudents = (rows: StudentDirectoryRow[]): Student[] =>
  rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    status: row.status,
    grade: row.grade,
    program: row.primary_program,
    weeklySchedule: row.days_per_week,
    guardian: {
      id: `${row.id}-guardian`,
      fullName: row.guardian_name,
      email: row.guardian_email,
      phone: row.guardian_phone
    },
    notes: row.notes ?? "No notes yet.",
    balanceDue: row.balance_due ?? 0
  }));

const mapTeachers = (rows: TeacherDirectoryRow[]): Teacher[] =>
  rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    expertise: row.expertise,
    availability: row.availability_summary,
    assignedCourses: row.assigned_courses ?? 0,
    assignedStudents: row.assigned_students ?? 0
  }));

const mapCourses = (rows: CourseCatalogRow[]): Course[] =>
  rows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    weeklyCapacity: row.weekly_capacity,
    leadTeacher: row.lead_teacher ?? "Unassigned",
    enrolledStudents: row.enrolled_students ?? 0,
    location: row.location
  }));

const mapSchedule = (rows: ScheduleOverviewRow[]): ScheduleSlot[] =>
  rows.map((row) => ({
    id: row.id,
    day: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    course: row.course_title,
    teacher: row.teacher_name,
    room: row.room_name,
    studentCount: row.student_count ?? 0
  }));

const mapAlerts = (rows: FeeAlertOverviewRow[]): FeeAlert[] =>
  rows.map((row) => ({
    id: row.id,
    studentName: row.student_name,
    guardianName: row.guardian_name,
    amountDue: row.amount_due,
    dueDate: row.due_date,
    severity: row.severity,
    channel: row.channel
  }));

export const getBootstrap = async (): Promise<BootstrapPayload> => {
  console.log("Supabase configured:", isSupabaseConfigured());
  const payload = cloneBootstrap();
  
  payload.students = studentsData;

  if (!isSupabaseConfigured()) {
    return payload;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return payload;
  }

  try {
    const [studentsResult, teachersResult, coursesResult, scheduleResult, alertsResult] =
      await Promise.all([
        supabase.from("student_directory").select("*").order("full_name"),
        supabase.from("teacher_directory").select("*").order("full_name"),
        supabase.from("course_catalog").select("*").order("title"),
        supabase.from("schedule_overview").select("*"),
        supabase.from("fee_alert_overview").select("*")
      ]);

    if (!studentsResult.error && studentsResult.data?.length) {
      payload.students = mapStudents(studentsResult.data as StudentDirectoryRow[]);
    }

    if (!teachersResult.error && teachersResult.data?.length) {
      payload.teachers = mapTeachers(teachersResult.data as TeacherDirectoryRow[]);
    }

    if (!coursesResult.error && coursesResult.data?.length) {
      payload.courses = mapCourses(coursesResult.data as CourseCatalogRow[]);
    }

    if (!scheduleResult.error && scheduleResult.data?.length) {
      payload.schedule = mapSchedule(
        scheduleResult.data as ScheduleOverviewRow[]
      );
    }

    if (!alertsResult.error && alertsResult.data?.length) {
      payload.alerts = mapAlerts(alertsResult.data as FeeAlertOverviewRow[]);
    }

    payload.dashboard.kpis = buildDashboardKpis(payload);
    payload.dashboard.feeHealth = {
      overdueTotal: payload.alerts
        .filter((alert: FeeAlert) => alert.severity === "overdue")
        .reduce((sum: number, alert: FeeAlert) => sum + alert.amountDue, 0),
      dueThisWeek: payload.alerts
        .filter((alert: FeeAlert) => alert.severity !== "overdue")
        .reduce((sum: number, alert: FeeAlert) => sum + alert.amountDue, 0),
      collectionRate: payload.dashboard.feeHealth.collectionRate
    };
  } catch (error) {
    console.error("Falling back to mock CRM payload:", error);
  }

  return payload;
};

export const addStudent = async (student: Student) => {
  const supabase = getSupabaseClient();



  if (!supabase) {
    studentsData.push(student);
    return student;
  }
  const { error } = await supabase
    .from("student_directory")
    .insert([
      {
        id: student.id,
        full_name: student.fullName,
        status: student.status,
        grade: student.grade,
        primary_program: student.program,
        days_per_week: student.weeklySchedule,
        guardian_name: student.guardian.fullName,
        guardian_email: student.guardian.email,
        guardian_phone: student.guardian.phone,
        notes: student.notes,
        balance_due: student.balanceDue
      }
    ] as any);

  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }

  return student;
};

export const updateStudent = async (
  id: string,
  student: Student
) => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const index = studentsData.findIndex(
      (s) => s.id === id
    );

    if (index !== -1) {
      studentsData[index] = student;
    }

    return student;
  }

  const { error } = await (supabase as any)
    .from("student_directory")
    .update({
      full_name: student.fullName,
      status: student.status,
      grade: student.grade,
      primary_program: student.program,
      days_per_week: student.weeklySchedule,
      guardian_name: student.guardian.fullName,
      guardian_email: student.guardian.email,
      guardian_phone: student.guardian.phone,
      notes: student.notes,
      balance_due: student.balanceDue
    })
    .eq("id", id);

  if (error) {
    console.error("Supabase update error:", error);
    throw error;
  }

  return student;
};

export const deleteStudent = async (id: string) => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    studentsData = studentsData.filter(
      (s) => s.id !== id
    );

    return;
  }

  const { error } = await supabase
    .from("student_directory")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export const getStudents = async () => studentsData;
export const getTeachers = async () => (await getBootstrap()).teachers;
export const getCourses = async () => (await getBootstrap()).courses;
export const getSchedule = async () => (await getBootstrap()).schedule;
export const getAttendance = async () => (await getBootstrap()).attendance;
export const getFinance = async () => (await getBootstrap()).finance;
export const getAutomations = async () => (await getBootstrap()).automations;
export const getAlerts = async () => (await getBootstrap()).alerts;
export const getHistory = async () => (await getBootstrap()).history;


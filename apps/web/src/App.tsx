import {
  startTransition,
  useEffect,
  useState,
  type ReactNode
} from "react";

import type {
  AttendanceRecord,
  Automation,
  BootstrapPayload,
  Course,
  FeeAlert,
  FinanceSummary,
  GrowthWidget,
  HistoryEntry,
  ModuleKey,
  Student,
  Teacher
} from "@topgrade/shared";

import { fetchBootstrap } from "./lib/api";
import { hasSupabaseBrowserConfig } from "./lib/supabase";

const moduleOrder: Array<{ key: ModuleKey; label: string; accent: string }> = [
  { key: "dashboard", label: "Dashboard", accent: "var(--lime)" },
  { key: "students", label: "Students", accent: "var(--sky)" },
  { key: "teachers", label: "Teachers", accent: "var(--violet)" },
  { key: "courses", label: "Courses", accent: "var(--gold)" },
  { key: "schedule", label: "Schedule", accent: "var(--mint)" },
  { key: "attendance", label: "Attendance", accent: "var(--orange)" },
  { key: "finance", label: "Payments", accent: "var(--teal)" },
  { key: "automation", label: "Automation", accent: "var(--rose)" },
  { key: "alerts", label: "Fee Alerts", accent: "var(--coral)" },
  { key: "history", label: "History", accent: "var(--indigo)" }
];

const moduleNarratives: Record<
  ModuleKey,
  { eyebrow: string; title: string; description: string }
> = {
  dashboard: {
    eyebrow: "Control Center",
    title: "Operations at a glance",
    description:
      "Keep student growth, teacher capacity, collections, and alerts visible in one workspace."
  },
  students: {
    eyebrow: "Enrollment",
    title: "Student and parent records",
    description:
      "Track profile data, guardian contacts, programs, schedules, and notes for every learner."
  },
  teachers: {
    eyebrow: "Faculty",
    title: "Teacher load and availability",
    description:
      "Assign teachers to courses, protect capacity, and keep scheduling friction low."
  },
  courses: {
    eyebrow: "Programs",
    title: "Courses connected to people",
    description:
      "Manage offerings across Coding, Robotics, Math, Reading, and other growth programs."
  },
  schedule: {
    eyebrow: "Calendar",
    title: "Weekly schedule orchestration",
    description:
      "See time slots, teacher mapping, locations, and the weekly flow across every program."
  },
  attendance: {
    eyebrow: "Classroom",
    title: "Attendance that supports billing",
    description:
      "Mark attendance quickly and turn class participation into dependable reporting."
  },
  finance: {
    eyebrow: "Collections",
    title: "Invoices, dues, and payments",
    description:
      "Stay on top of collections, overdue balances, and monthly revenue performance."
  },
  automation: {
    eyebrow: "Parent Comms",
    title: "Automation that saves follow-up time",
    description:
      "Use welcome messages, reminders, and progress updates to keep parents informed."
  },
  alerts: {
    eyebrow: "Attention",
    title: "Fee alerts that drive action",
    description:
      "Surface due-soon, overdue, and partial-payment issues before collections slip."
  },
  history: {
    eyebrow: "Retention",
    title: "Past data for re-enrollment",
    description:
      "Preserve student, attendance, and payment history to power better retention campaigns."
  }
};

const userFlow = [
  "Login",
  "Dashboard",
  "Add Student",
  "Assign Course & Schedule",
  "Assign Teacher",
  "Track Attendance",
  "Generate Invoice",
  "Receive Payment",
  "Send Alerts",
  "View Reports"
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const statusClassMap = {
  active: "good",
  trial: "warning",
  inactive: "muted",
  paid: "good",
  pending: "warning",
  partial: "warning",
  overdue: "danger",
  present: "good",
  late: "warning",
  absent: "danger",
  live: "good",
  draft: "muted",
  "due-soon": "warning",
  "in-app": "muted",
  email: "good",
  sms: "warning",
  overdue_alert: "danger"
} as const;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleKey>("dashboard");
  const [data, setData] = useState<BootstrapPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        const payload = await fetchBootstrap(controller.signal);
        setData(payload);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load the CRM data."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();

    return () => controller.abort();
  }, []);

  const counts = !data
    ? {
        dashboard: "Loading",
        students: "0",
        teachers: "0",
        courses: "0",
        schedule: "0",
        attendance: "0",
        finance: "0",
        automation: "0",
        alerts: "0",
        history: "0"
      }
    : {
        dashboard: `${data.dashboard.recentActivities.length} updates`,
        students: `${data.students.length} learners`,
        teachers: `${data.teachers.length} faculty`,
        courses: `${data.courses.length} programs`,
        schedule: `${data.schedule.length} slots`,
        attendance: `${data.attendance.length} marks`,
        finance: `${data.finance.invoices.length} invoices`,
        automation: `${data.automations.length} flows`,
        alerts: `${data.alerts.length} open`,
        history: `${data.history.length} archived`
      };

  const handleModuleSelect = (module: ModuleKey) => {
    startTransition(() => {
      setActiveModule(module);
    });

    document.getElementById(module)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <p className="eyebrow">Top Grade Learning</p>
          <h1>CRM Workspace</h1>
          <p className="muted-copy">
            A tutoring operations command center for students, staff, schedules,
            collections, and growth.
          </p>
        </div>

        <nav className="sidebar-nav" aria-label="CRM modules">
          {moduleOrder.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item ${activeModule === item.key ? "active" : ""}`}
              onClick={() => handleModuleSelect(item.key)}
            >
              <span
                className="nav-dot"
                style={{ backgroundColor: item.accent }}
              />
              <span>
                <strong>{item.label}</strong>
                <small>{counts[item.key]}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <p className="eyebrow">Auth Status</p>
          <strong>
            {hasSupabaseBrowserConfig
              ? "Supabase browser auth ready"
              : "Starter login shell active"}
          </strong>
          <p className="muted-copy">
            Replace the temporary login with Supabase Auth once the environment
            keys are added.
          </p>
        </div>
      </aside>

      <main className="main-content">
        <header className="hero">
          <div>
            <p className="eyebrow">{moduleNarratives[activeModule].eyebrow}</p>
            <h2>{moduleNarratives[activeModule].title}</h2>
            <p className="hero-copy">
              {moduleNarratives[activeModule].description}
            </p>
          </div>

          <div className="hero-actions">
            <button type="button" className="primary-button">
              Add Student
            </button>
            <button type="button" className="secondary-button">
              Generate Invoice
            </button>
          </div>
        </header>

        {loading && <LoadingState />}

        {error && !data && (
          <div className="error-banner">
            <strong>Unable to reach the API.</strong>
            <span>{error}</span>
            <span>
              Start `apps/api` first, then refresh this page.
            </span>
          </div>
        )}

        {data && (
          <>
            <section className="kpi-grid" id="dashboard">
              {data.dashboard.kpis.map((kpi) => (
                <MetricCard
                  key={kpi.id}
                  label={kpi.label}
                  value={kpi.value}
                  trend={kpi.trend}
                  tone={kpi.tone}
                />
              ))}
            </section>

            <div className="content-grid">
              <div className="primary-column">
                <Panel
                  id="dashboard-panel"
                  title="Dashboard Command Center"
                  subtitle="KPIs, recent activity, quick actions, and fee health all in one place."
                >
                  <div className="split-grid">
                    <div className="activity-stack">
                      {data.dashboard.recentActivities.map((item) => (
                        <article key={item.id} className="activity-item">
                          <p className="activity-title">{item.title}</p>
                          <p className="muted-copy">{item.detail}</p>
                          <div className="activity-footer">
                            <span className="tag">{item.module}</span>
                            <small>{item.timestamp}</small>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="stack">
                      <div className="fee-health-card">
                        <p className="eyebrow">Fee Health</p>
                        <h3>{data.dashboard.feeHealth.collectionRate}</h3>
                        <p className="muted-copy">
                          {currencyFormatter.format(
                            data.dashboard.feeHealth.dueThisWeek
                          )}{" "}
                          due this week and{" "}
                          {currencyFormatter.format(
                            data.dashboard.feeHealth.overdueTotal
                          )}{" "}
                          overdue.
                        </p>
                      </div>

                      <div className="quick-actions">
                        {data.dashboard.quickActions.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            className="quick-action-card"
                            onClick={() => handleModuleSelect(action.module)}
                          >
                            <strong>{action.label}</strong>
                            <span>{action.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Panel>

                <div className="double-grid">
                  <Panel
                    id="students"
                    title="Students"
                    subtitle="Current learners, guardian details, schedules, and balances."
                  >
                    <StudentList students={data.students} />
                  </Panel>

                  <Panel
                    id="teachers"
                    title="Teachers"
                    subtitle="Availability, expertise, and current teaching load."
                  >
                    <TeacherList teachers={data.teachers} />
                  </Panel>
                </div>

                <div className="double-grid">
                  <Panel
                    id="courses"
                    title="Courses"
                    subtitle="Program catalog linked to teachers, capacity, and enrollment."
                  >
                    <CourseList courses={data.courses} />
                  </Panel>

                  <Panel
                    id="schedule"
                    title="Schedule"
                    subtitle="Weekly slots mapped to rooms, teachers, and student counts."
                  >
                    <ScheduleList schedule={data.schedule} />
                  </Panel>
                </div>

                <div className="double-grid">
                  <Panel
                    id="attendance"
                    title="Attendance"
                    subtitle="Daily attendance records that also support billing visibility."
                  >
                    <AttendanceList attendance={data.attendance} />
                  </Panel>

                  <Panel
                    id="finance"
                    title="Payments and Financials"
                    subtitle="Invoice status, recent payments, and collection trend."
                  >
                    <FinancePanel finance={data.finance} />
                  </Panel>
                </div>

                <div className="double-grid">
                  <Panel
                    id="automation"
                    title="Email to Parents Automation"
                    subtitle="Reusable parent communication flows powered by triggers."
                  >
                    <AutomationList automations={data.automations} />
                  </Panel>

                  <Panel
                    id="alerts"
                    title="Fee Alerts"
                    subtitle="Upcoming, partial, and overdue fee reminders that need action."
                  >
                    <AlertsList alerts={data.alerts} />
                  </Panel>
                </div>

                <Panel
                  id="history"
                  title="History and Past Data"
                  subtitle="Historical records kept for retention, reporting, and re-enrollment."
                >
                  <HistoryList history={data.history} />
                </Panel>
              </div>

              <aside className="insight-rail">
                <Panel
                  title="Growth and Engagement"
                  subtitle="Keep expansion and parent trust visible every week."
                >
                  <GrowthList widgets={data.growth} />
                </Panel>

                <Panel
                  title="Complete User Flow"
                  subtitle="A simple walkthrough from login to reporting."
                >
                  <ol className="flow-list">
                    {userFlow.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </Panel>

                <Panel
                  title="Focused Module"
                  subtitle="A quick snapshot of what matters most in the active section."
                >
                  <FocusedModule
                    activeModule={activeModule}
                    data={data}
                  />
                </Panel>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="login-shell">
      <div className="login-visual">
        <p className="eyebrow">Top Grade Learning</p>
        <h1>Smart tutoring management, made operational.</h1>
        <p>
          Start with a dashboard that connects enrollment, schedules, teaching,
          attendance, fees, and parent communication.
        </p>
      </div>

      <form
        className="login-card"
        onSubmit={(event) => {
          event.preventDefault();
          onLogin();
        }}
      >
        <p className="eyebrow">Entry Point</p>
        <h2>Sign in to the CRM</h2>
        <label>
          Center Email
          <input type="email" defaultValue="admin@topgradelearning.com" />
        </label>
        <label>
          Password
          <input type="password" defaultValue="password" />
        </label>
        <button type="submit" className="primary-button full-width">
          Continue to Dashboard
        </button>
        <p className="helper-copy">
          This starter uses a temporary login shell. Replace it with Supabase
          Auth for production.
        </p>
      </form>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading-grid">
      <div className="skeleton-card" />
      <div className="skeleton-card" />
      <div className="skeleton-card" />
      <div className="skeleton-card" />
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  tone
}: {
  label: string;
  value: string;
  trend: string;
  tone: "positive" | "neutral" | "warning";
}) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <p>{label}</p>
      <h3>{value}</h3>
      <small>{trend}</small>
    </article>
  );
}

function Panel({
  id,
  title,
  subtitle,
  children
}: {
  id?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="panel" id={id}>
      <header className="panel-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function StudentList({ students }: { students: Student[] }) {
  return (
    <div className="stack">
      {students.map((student) => (
        <article key={student.id} className="record-card">
          <div className="record-topline">
            <strong>{student.fullName}</strong>
            <span className={`status-pill ${statusClassMap[student.status]}`}>
              {student.status}
            </span>
          </div>
          <p>
            {student.grade} • {student.program} • {student.weeklySchedule}
          </p>
          <p className="muted-copy">
            Parent: {student.guardian.fullName} • {student.guardian.phone}
          </p>
          <div className="record-footer">
            <small>{student.notes}</small>
            <strong>{currencyFormatter.format(student.balanceDue)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

function TeacherList({ teachers }: { teachers: Teacher[] }) {
  return (
    <div className="stack">
      {teachers.map((teacher) => (
        <article key={teacher.id} className="record-card">
          <div className="record-topline">
            <strong>{teacher.fullName}</strong>
            <span className="status-pill muted">
              {teacher.assignedStudents} students
            </span>
          </div>
          <p>{teacher.expertise}</p>
          <p className="muted-copy">{teacher.availability}</p>
          <div className="record-footer">
            <small>{teacher.assignedCourses} assigned courses</small>
            <strong>{teacher.assignedStudents} active learners</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

function CourseList({ courses }: { courses: Course[] }) {
  return (
    <div className="course-grid">
      {courses.map((course) => (
        <article key={course.id} className="record-card accent-card">
          <p className="eyebrow">{course.category}</p>
          <strong>{course.title}</strong>
          <p className="muted-copy">{course.location}</p>
          <div className="record-footer">
            <small>{course.leadTeacher}</small>
            <strong>
              {course.enrolledStudents}/{course.weeklyCapacity}
            </strong>
          </div>
        </article>
      ))}
    </div>
  );
}

function ScheduleList({ schedule }: { schedule: BootstrapPayload["schedule"] }) {
  return (
    <div className="stack">
      {schedule.map((slot) => (
        <article key={slot.id} className="timeline-card">
          <div>
            <strong>
              {slot.day} • {slot.startTime} - {slot.endTime}
            </strong>
            <p>{slot.course}</p>
          </div>
          <div className="timeline-meta">
            <small>{slot.teacher}</small>
            <small>
              {slot.room} • {slot.studentCount} students
            </small>
          </div>
        </article>
      ))}
    </div>
  );
}

function AttendanceList({
  attendance
}: {
  attendance: AttendanceRecord[];
}) {
  return (
    <div className="stack">
      {attendance.map((record) => (
        <article key={record.id} className="record-card">
          <div className="record-topline">
            <strong>{record.studentName}</strong>
            <span className={`status-pill ${statusClassMap[record.status]}`}>
              {record.status}
            </span>
          </div>
          <p>
            {record.course} • {record.date}
          </p>
          <div className="record-footer">
            <small>{record.billed ? "Included in billing" : "Billing hold"}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function FinancePanel({ finance }: { finance: FinanceSummary }) {
  const maxValue = Math.max(...finance.monthlyTrend);

  return (
    <div className="stack">
      <div className="finance-summary-grid">
        <article className="summary-tile">
          <small>Collected</small>
          <strong>{currencyFormatter.format(finance.monthlyCollected)}</strong>
        </article>
        <article className="summary-tile">
          <small>Pending</small>
          <strong>{currencyFormatter.format(finance.pendingAmount)}</strong>
        </article>
        <article className="summary-tile">
          <small>Overdue</small>
          <strong>{currencyFormatter.format(finance.overdueAmount)}</strong>
        </article>
      </div>

      <div className="trend-bars">
        {finance.monthlyTrend.map((value, index) => (
          <div key={`${value}-${index}`} className="trend-column">
            <span
              className="trend-bar"
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
            <small>M{index + 1}</small>
          </div>
        ))}
      </div>

      <div className="stack">
        {finance.invoices.map((invoice) => (
          <article key={invoice.id} className="record-card">
            <div className="record-topline">
              <strong>{invoice.studentName}</strong>
              <span className={`status-pill ${statusClassMap[invoice.status]}`}>
                {invoice.status}
              </span>
            </div>
            <div className="record-footer">
              <small>Due {invoice.dueDate}</small>
              <strong>{currencyFormatter.format(invoice.amount)}</strong>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AutomationList({ automations }: { automations: Automation[] }) {
  return (
    <div className="stack">
      {automations.map((automation) => (
        <article key={automation.id} className="record-card">
          <div className="record-topline">
            <strong>{automation.name}</strong>
            <span className={`status-pill ${statusClassMap[automation.status]}`}>
              {automation.status}
            </span>
          </div>
          <p>
            {automation.trigger} • {automation.audience}
          </p>
          <div className="record-footer">
            <small>{automation.channel}</small>
            <strong>{automation.lastRun}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

function AlertsList({ alerts }: { alerts: FeeAlert[] }) {
  return (
    <div className="stack">
      {alerts.map((alert) => (
        <article key={alert.id} className="record-card">
          <div className="record-topline">
            <strong>{alert.studentName}</strong>
            <span className={`status-pill ${statusClassMap[alert.severity]}`}>
              {alert.severity}
            </span>
          </div>
          <p className="muted-copy">
            {alert.guardianName} • {alert.channel}
          </p>
          <div className="record-footer">
            <small>Due {alert.dueDate}</small>
            <strong>{currencyFormatter.format(alert.amountDue)}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

function HistoryList({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="history-grid">
      {history.map((entry) => (
        <article key={entry.id} className="record-card">
          <p className="eyebrow">{entry.entityType}</p>
          <strong>{entry.entityName}</strong>
          <p className="muted-copy">{entry.summary}</p>
          <div className="record-footer">
            <small>{entry.happenedAt}</small>
            <span className={`status-pill ${statusClassMap[entry.retentionSignal === "watch" ? "pending" : entry.retentionSignal === "reenroll" ? "active" : "inactive"]}`}>
              {entry.retentionSignal}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

function GrowthList({ widgets }: { widgets: GrowthWidget[] }) {
  return (
    <div className="stack">
      {widgets.map((widget) => (
        <article key={widget.id} className="growth-card">
          <strong>{widget.title}</strong>
          <p>{widget.description}</p>
          <span>{widget.metric}</span>
        </article>
      ))}
    </div>
  );
}

function FocusedModule({
  activeModule,
  data
}: {
  activeModule: ModuleKey;
  data: BootstrapPayload;
}) {
  switch (activeModule) {
    case "students":
      return (
        <p className="muted-copy">
          {data.students.filter((student) => student.balanceDue > 0).length}{" "}
          students currently have an outstanding balance, and{" "}
          {data.students.filter((student) => student.status === "trial").length}{" "}
          are in trial mode.
        </p>
      );
    case "teachers":
      return (
        <p className="muted-copy">
          The team is carrying {data.teachers.reduce((sum, teacher) => sum + teacher.assignedStudents, 0)} active student assignments across {data.teachers.length} teachers.
        </p>
      );
    case "courses":
      return (
        <p className="muted-copy">
          {data.courses.filter((course) => course.enrolledStudents >= course.weeklyCapacity - 2).length} programs are close to full and good candidates for new batch creation.
        </p>
      );
    case "schedule":
      return (
        <p className="muted-copy">
          Saturday and weekday evening slots are the busiest; use this view to avoid teacher overlap.
        </p>
      );
    case "attendance":
      return (
        <p className="muted-copy">
          {data.attendance.filter((record) => record.status === "present").length} of{" "}
          {data.attendance.length} recent records are marked present.
        </p>
      );
    case "finance":
      return (
        <p className="muted-copy">
          Pending and overdue balances total{" "}
          {currencyFormatter.format(
            data.finance.pendingAmount + data.finance.overdueAmount
          )}.
        </p>
      );
    case "automation":
      return (
        <p className="muted-copy">
          {data.automations.filter((automation) => automation.status === "live").length} automation flows are live, with WhatsApp-ready expansion modeled in the UI.
        </p>
      );
    case "alerts":
      return (
        <p className="muted-copy">
          {data.alerts.filter((alert) => alert.severity === "overdue").length} alerts are overdue and should trigger a higher-touch follow-up path.
        </p>
      );
    case "history":
      return (
        <p className="muted-copy">
          Past data is structured to support re-enrollment campaigns and retention visibility.
        </p>
      );
    default:
      return (
        <p className="muted-copy">
          This dashboard is designed to mirror your full tutoring center workflow from login to reporting.
        </p>
      );
  }
}

export default App;

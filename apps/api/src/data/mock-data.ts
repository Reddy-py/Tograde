import type { BootstrapPayload } from "@topgrade/shared";

export const mockBootstrap: BootstrapPayload = {
  dashboard: {
    kpis: [
      {
        id: "students",
        label: "Active Students",
        value: "128",
        trend: "+12 since April 2026",
        tone: "positive"
      },
      {
        id: "collections",
        label: "Monthly Collections",
        value: "₹7.6L",
        trend: "94% collected by May 30, 2026",
        tone: "positive"
      },
      {
        id: "attendance",
        label: "Attendance Rate",
        value: "96.4%",
        trend: "Strong week across Coding and Math",
        tone: "positive"
      },
      {
        id: "alerts",
        label: "Open Fee Alerts",
        value: "9",
        trend: "3 overdue, 6 due soon",
        tone: "warning"
      }
    ],
    feeHealth: {
      overdueTotal: 43600,
      dueThisWeek: 28150,
      collectionRate: "94%"
    },
    recentActivities: [
      {
        id: "a1",
        title: "New student enrolled in Robotics",
        detail: "Aanya Patel was added with a Monday and Wednesday schedule.",
        timestamp: "May 30, 2026 9:20 AM",
        module: "students"
      },
      {
        id: "a2",
        title: "Invoice TG-2026-051 generated",
        detail: "Monthly invoice created for Aarav Shah and emailed to parent.",
        timestamp: "May 29, 2026 6:15 PM",
        module: "finance"
      },
      {
        id: "a3",
        title: "Teacher availability updated",
        detail: "Meera Iyer opened an extra Friday slot for Coding Foundations.",
        timestamp: "May 29, 2026 2:10 PM",
        module: "teachers"
      },
      {
        id: "a4",
        title: "Attendance reminder email sent",
        detail: "Weekly summary delivered to 43 parents through SES.",
        timestamp: "May 28, 2026 8:00 PM",
        module: "automation"
      },
      {
        id: "a5",
        title: "Overdue alert escalated",
        detail: "Kavya Desai account moved from due-soon to overdue follow-up.",
        timestamp: "May 28, 2026 11:30 AM",
        module: "alerts"
      }
    ],
    quickActions: [
      {
        id: "q1",
        label: "Add Student",
        description: "Create a learner profile with guardian and course info.",
        module: "students"
      },
      {
        id: "q2",
        label: "Assign Teacher",
        description: "Map teacher capacity to a course and schedule.",
        module: "teachers"
      },
      {
        id: "q3",
        label: "Mark Attendance",
        description: "Record present, absent, or late status for today's classes.",
        module: "attendance"
      },
      {
        id: "q4",
        label: "Generate Invoice",
        description: "Create fees for the current billing cycle.",
        module: "finance"
      },
      {
        id: "q5",
        label: "Send Reminder",
        description: "Trigger a fee or attendance communication to parents.",
        module: "automation"
      }
    ]
  },
  students: [
    {
      id: "stu_001",
      fullName: "Aanya Patel",
      status: "active",
      grade: "Grade 6",
      program: "Robotics Explorer",
      weeklySchedule: "Mon, Wed",
      guardian: {
        id: "g_001",
        fullName: "Rupal Patel",
        email: "rupal.patel@example.com",
        phone: "+91 98765 01010"
      },
      notes: "Interested in regional robotics competition prep.",
      balanceDue: 0
    },
    {
      id: "stu_002",
      fullName: "Aarav Shah",
      status: "active",
      grade: "Grade 8",
      program: "Coding Foundations",
      weeklySchedule: "Tue, Thu, Sat",
      guardian: {
        id: "g_002",
        fullName: "Nidhi Shah",
        email: "nidhi.shah@example.com",
        phone: "+91 98765 02020"
      },
      notes: "Needs extra support with Python loops and functions.",
      balanceDue: 12500
    },
    {
      id: "stu_003",
      fullName: "Kavya Desai",
      status: "trial",
      grade: "Grade 5",
      program: "Creative Reading Lab",
      weeklySchedule: "Tue, Fri",
      guardian: {
        id: "g_003",
        fullName: "Jignesh Desai",
        email: "jignesh.desai@example.com",
        phone: "+91 98765 03030"
      },
      notes: "Parent requested a trial-to-enrollment conversion follow-up.",
      balanceDue: 8600
    },
    {
      id: "stu_004",
      fullName: "Ishaan Mehta",
      status: "active",
      grade: "Grade 7",
      program: "Math Acceleration",
      weeklySchedule: "Mon, Thu",
      guardian: {
        id: "g_004",
        fullName: "Priya Mehta",
        email: "priya.mehta@example.com",
        phone: "+91 98765 04040"
      },
      notes: "Prefers evening slots due to school bus timing.",
      balanceDue: 4200
    }
  ],
  teachers: [
    {
      id: "t_001",
      fullName: "Meera Iyer",
      expertise: "Coding, Scratch, Python",
      availability: "Mon to Fri, 3:00 PM to 7:00 PM",
      assignedCourses: 3,
      assignedStudents: 42
    },
    {
      id: "t_002",
      fullName: "Rohan Verma",
      expertise: "Robotics, 3D Printing",
      availability: "Mon, Wed, Sat",
      assignedCourses: 2,
      assignedStudents: 26
    },
    {
      id: "t_003",
      fullName: "Anjali Rao",
      expertise: "Math, Reading",
      availability: "Tue to Sat, 4:00 PM to 8:00 PM",
      assignedCourses: 2,
      assignedStudents: 31
    }
  ],
  courses: [
    {
      id: "c_001",
      title: "Coding Foundations",
      category: "Coding",
      weeklyCapacity: 24,
      leadTeacher: "Meera Iyer",
      enrolledStudents: 21,
      location: "Banjara Hills Center"
    },
    {
      id: "c_002",
      title: "Robotics Explorer",
      category: "Robotics",
      weeklyCapacity: 18,
      leadTeacher: "Rohan Verma",
      enrolledStudents: 16,
      location: "Banjara Hills Lab"
    },
    {
      id: "c_003",
      title: "Math Acceleration",
      category: "Math",
      weeklyCapacity: 20,
      leadTeacher: "Anjali Rao",
      enrolledStudents: 19,
      location: "Jubilee Hills Center"
    },
    {
      id: "c_004",
      title: "Creative Reading Lab",
      category: "Reading",
      weeklyCapacity: 16,
      leadTeacher: "Anjali Rao",
      enrolledStudents: 12,
      location: "Online"
    }
  ],
  schedule: [
    {
      id: "s_001",
      day: "Monday",
      startTime: "4:00 PM",
      endTime: "5:30 PM",
      course: "Robotics Explorer",
      teacher: "Rohan Verma",
      room: "Lab 2",
      studentCount: 16
    },
    {
      id: "s_002",
      day: "Tuesday",
      startTime: "5:00 PM",
      endTime: "6:30 PM",
      course: "Coding Foundations",
      teacher: "Meera Iyer",
      room: "Studio A",
      studentCount: 21
    },
    {
      id: "s_003",
      day: "Thursday",
      startTime: "6:00 PM",
      endTime: "7:30 PM",
      course: "Math Acceleration",
      teacher: "Anjali Rao",
      room: "Room 5",
      studentCount: 19
    },
    {
      id: "s_004",
      day: "Friday",
      startTime: "4:30 PM",
      endTime: "5:30 PM",
      course: "Creative Reading Lab",
      teacher: "Anjali Rao",
      room: "Zoom",
      studentCount: 12
    },
    {
      id: "s_005",
      day: "Saturday",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      course: "Coding Foundations",
      teacher: "Meera Iyer",
      room: "Studio A",
      studentCount: 21
    }
  ],
  attendance: [
    {
      id: "att_001",
      studentName: "Aanya Patel",
      course: "Robotics Explorer",
      date: "May 29, 2026",
      status: "present",
      billed: true
    },
    {
      id: "att_002",
      studentName: "Aarav Shah",
      course: "Coding Foundations",
      date: "May 29, 2026",
      status: "present",
      billed: true
    },
    {
      id: "att_003",
      studentName: "Kavya Desai",
      course: "Creative Reading Lab",
      date: "May 29, 2026",
      status: "late",
      billed: true
    },
    {
      id: "att_004",
      studentName: "Ishaan Mehta",
      course: "Math Acceleration",
      date: "May 28, 2026",
      status: "absent",
      billed: false
    },
    {
      id: "att_005",
      studentName: "Tanvi Kulkarni",
      course: "Coding Foundations",
      date: "May 28, 2026",
      status: "present",
      billed: true
    }
  ],
  finance: {
    monthlyCollected: 760000,
    pendingAmount: 28150,
    overdueAmount: 43600,
    invoices: [
      {
        id: "inv_001",
        studentName: "Aarav Shah",
        dueDate: "June 5, 2026",
        amount: 12500,
        status: "pending"
      },
      {
        id: "inv_002",
        studentName: "Kavya Desai",
        dueDate: "May 24, 2026",
        amount: 8600,
        status: "overdue"
      },
      {
        id: "inv_003",
        studentName: "Ishaan Mehta",
        dueDate: "June 2, 2026",
        amount: 4200,
        status: "partial"
      },
      {
        id: "inv_004",
        studentName: "Aanya Patel",
        dueDate: "May 26, 2026",
        amount: 9800,
        status: "paid"
      }
    ],
    payments: [
      {
        id: "pay_001",
        studentName: "Aanya Patel",
        amount: 9800,
        method: "UPI",
        paidAt: "May 26, 2026 11:15 AM"
      },
      {
        id: "pay_002",
        studentName: "Vihaan Reddy",
        amount: 14200,
        method: "Card",
        paidAt: "May 28, 2026 6:05 PM"
      },
      {
        id: "pay_003",
        studentName: "Sara Khan",
        amount: 11800,
        method: "Bank Transfer",
        paidAt: "May 29, 2026 1:35 PM"
      }
    ],
    monthlyTrend: [580000, 620000, 601000, 675000, 720000, 760000]
  },
  automations: [
    {
      id: "auto_001",
      name: "Welcome Email",
      trigger: "New enrollment",
      audience: "New parents",
      lastRun: "May 30, 2026 9:25 AM",
      channel: "email",
      status: "live"
    },
    {
      id: "auto_002",
      name: "Attendance Summary",
      trigger: "Daily close",
      audience: "All active parents",
      lastRun: "May 29, 2026 8:00 PM",
      channel: "email",
      status: "live"
    },
    {
      id: "auto_003",
      name: "Fee Reminder Sequence",
      trigger: "3 days before due date",
      audience: "Parents with pending invoices",
      lastRun: "May 29, 2026 10:15 AM",
      channel: "email",
      status: "live"
    },
    {
      id: "auto_004",
      name: "Monthly Progress Update",
      trigger: "Month-end report",
      audience: "Active student families",
      lastRun: "Drafted for May 31, 2026",
      channel: "whatsapp",
      status: "draft"
    }
  ],
  alerts: [
    {
      id: "fa_001",
      studentName: "Kavya Desai",
      guardianName: "Jignesh Desai",
      amountDue: 8600,
      dueDate: "May 24, 2026",
      severity: "overdue",
      channel: "email"
    },
    {
      id: "fa_002",
      studentName: "Aarav Shah",
      guardianName: "Nidhi Shah",
      amountDue: 12500,
      dueDate: "June 5, 2026",
      severity: "due-soon",
      channel: "in-app"
    },
    {
      id: "fa_003",
      studentName: "Ishaan Mehta",
      guardianName: "Priya Mehta",
      amountDue: 4200,
      dueDate: "June 2, 2026",
      severity: "partial",
      channel: "sms"
    },
    {
      id: "fa_004",
      studentName: "Mihika Jain",
      guardianName: "Shreya Jain",
      amountDue: 18300,
      dueDate: "May 21, 2026",
      severity: "overdue",
      channel: "email"
    }
  ],
  history: [
    {
      id: "hist_001",
      entityType: "Student",
      entityName: "Rhea Kapoor",
      summary: "Completed Math Acceleration in March 2026 and marked for re-enrollment campaign.",
      happenedAt: "March 25, 2026",
      retentionSignal: "reenroll"
    },
    {
      id: "hist_002",
      entityType: "Payment",
      entityName: "Invoice TG-2026-018",
      summary: "Recovered after second reminder sequence with card payment completion.",
      happenedAt: "April 12, 2026",
      retentionSignal: "watch"
    },
    {
      id: "hist_003",
      entityType: "Attendance",
      entityName: "Spring Coding Camp",
      summary: "Average attendance stayed above 97% during the camp cycle.",
      happenedAt: "April 30, 2026",
      retentionSignal: "archived"
    },
    {
      id: "hist_004",
      entityType: "After-school Program",
      entityName: "Creative Reading Lab - Cohort B",
      summary: "Moved to past data after the six-week batch closed successfully.",
      happenedAt: "May 10, 2026",
      retentionSignal: "reenroll"
    }
  ],
  growth: [
    {
      id: "grow_001",
      title: "Parent Engagement",
      description: "Track email and WhatsApp touchpoints that drive trust.",
      metric: "82% monthly open rate"
    },
    {
      id: "grow_002",
      title: "Fee Collections",
      description: "Reduce overdue balances with automated nudges.",
      metric: "₹43.6K overdue"
    },
    {
      id: "grow_003",
      title: "Upsell Window",
      description: "Offer adjacent programs to active learners.",
      metric: "17 students ready for cross-sell"
    },
    {
      id: "grow_004",
      title: "Referral Campaigns",
      description: "Activate happy parents at the end of each course cycle.",
      metric: "11 referral-ready families"
    },
    {
      id: "grow_005",
      title: "Teacher Performance",
      description: "Compare utilization, attendance, and parent feedback.",
      metric: "3 teachers above 90% utilization"
    }
  ]
};


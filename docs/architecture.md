# Architecture

## Product Shape

The CRM is modeled as a center operations platform for tutoring businesses.

- `Dashboard` shows KPIs, financial summaries, alerts, recent activity, and quick actions
- `Students` stores student profile, guardian data, courses, schedules, fees, and notes
- `Teachers` stores profile, expertise, availability, assigned courses, and student load
- `Courses` connects programs like Coding, Robotics, Math, and Reading to teachers and students
- `Schedule` represents weekly time slots, teacher allocation, and center location details
- `Attendance` tracks daily presence and billing eligibility
- `Finance` manages invoices, payments, dues, summaries, and reporting
- `Automation` sends onboarding, attendance, fee, and progress emails
- `Alerts` monitors upcoming dues, overdue payments, and in-app reminders
- `History` preserves past enrollments, attendance, payments, and retention signals

## Recommended Boundaries

- `apps/web`
  - Admin UI
  - Supabase auth session handling
  - Dashboards and operational workflows
- `apps/api`
  - Aggregation layer for dashboards and reports
  - Server-side validation
  - SES/S3 integrations
  - Scheduled workflows
- `Supabase`
  - PostgreSQL schema
  - Auth
  - RLS policies
  - Realtime updates if desired for alerts and attendance
- `AWS`
  - Deployment
  - Email delivery
  - Exports and file storage
  - Optional background jobs

## Data Model Highlights

- `guardians` own parent contact details
- `students` link to guardians and store core enrollment information
- `teachers` hold availability and expertise
- `courses` define the learning programs
- `course_enrollments` link students to courses
- `teacher_course_assignments` link teachers to courses
- `schedule_slots` define the weekly calendar
- `attendance_records` power attendance reporting and billing support
- `invoices` and `payments` support financial visibility
- `fee_alerts` support reminders and collections
- `email_automations` track communication workflows
- `history_events` support retention and re-enrollment workflows

## Frontend Experience

- Sidebar navigation mirrors the mind map
- Dashboard surfaces financial and operational attention areas first
- Each domain area is rendered as its own actionable workspace
- Growth cards keep parent engagement and upsell opportunities visible


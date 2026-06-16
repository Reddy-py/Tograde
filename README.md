# Top Grade Learning CRM

Starter monorepo for the tutoring CRM shown in your mind map, built around:

- React + Vite for the admin dashboard
- Node + Express for the API layer
- Supabase for auth, PostgreSQL, and row-level security
- AWS for hosting, email delivery, exports, and background automation

## Workspace Layout

- `apps/web` - React CRM interface for dashboard, students, teachers, courses, schedule, attendance, finance, alerts, automation, and history
- `apps/api` - Express API with mock-backed endpoints and Supabase integration points
- `packages/shared` - Shared TypeScript domain types used by web and API
- `supabase` - Initial SQL schema for the CRM domain
- `docs` - Architecture and deployment notes

## Mind Map Modules Covered

1. Dashboard
2. Students
3. Teachers
4. Courses
5. Schedule
6. Attendance
7. Payments and financials
8. Email automation for parents
9. Fee alerts
10. History and past data

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy the env templates:

```bash
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
```

3. Start the API:

```bash
npm run dev:api
```

4. Start the web app in another terminal:

```bash
npm run dev:web
```

## Suggested Delivery Plan

- Phase 1: Auth, dashboard, students, teachers, courses, schedules
- Phase 2: Attendance, invoices, payments, fee alerts, parent email automation
- Phase 3: Reporting, exports, historical data, retention workflows
- Phase 4: Role-based permissions, WhatsApp integration, advanced analytics, multi-center support

## AWS Fit

- `S3 + CloudFront` for the React frontend
- `ECS Fargate` for the Node API
- `SES` for parent notifications and fee reminders
- `S3` for report exports, invoices, and attachments
- `EventBridge + Lambda` or scheduled API jobs for reminders and automation

See [docs/architecture.md](/c:/Tograde/docs/architecture.md) and [docs/aws-deployment.md](/c:/Tograde/docs/aws-deployment.md) for the implementation shape.


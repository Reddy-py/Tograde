# AWS Deployment Notes

## Recommended Topology

- `React app`
  - Build with Vite
  - Deploy static assets to S3
  - Serve through CloudFront
- `Node API`
  - Containerize the Express app
  - Deploy on ECS Fargate behind an Application Load Balancer
- `Supabase`
  - Managed outside AWS
  - Store connection and service role secrets in AWS Secrets Manager
- `Automation`
  - Use EventBridge schedules to trigger reminder jobs
  - Use SES for email delivery
- `Exports and attachments`
  - Use S3 buckets with signed URLs

## First AWS Services To Wire

1. `CloudFront + S3` for `apps/web`
2. `ECS Fargate + ALB` for `apps/api`
3. `SES` for welcome emails, attendance summaries, and fee reminders
4. `S3` for monthly reports and invoice exports
5. `Secrets Manager` for Supabase and AWS credentials
6. `CloudWatch` for logs and alerting

## Example Environment Split

- Frontend
  - `VITE_API_BASE_URL`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- API
  - `PORT`
  - `WEB_ORIGIN`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `AWS_REGION`
  - `AWS_SES_FROM_EMAIL`
  - `AWS_REPORTS_BUCKET`


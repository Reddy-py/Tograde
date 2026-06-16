import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: parsePort(process.env.PORT, 4000),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  awsRegion: process.env.AWS_REGION ?? "ap-south-1",
  awsSesFromEmail: process.env.AWS_SES_FROM_EMAIL,
  awsReportsBucket: process.env.AWS_REPORTS_BUCKET
};


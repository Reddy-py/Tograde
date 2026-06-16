import { S3Client } from "@aws-sdk/client-s3";
import { SESClient } from "@aws-sdk/client-ses";

import { config } from "../config";

export const s3Client = new S3Client({
  region: config.awsRegion
});

export const sesClient = new SESClient({
  region: config.awsRegion
});


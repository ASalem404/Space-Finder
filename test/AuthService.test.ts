import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const user = await service.signIn("ASalem404", "P@ssw0rd");

  const credentials = await service.generateTemporaryCredentials(user);

  const buckets = await listBuckets(credentials);

  console.log(buckets);

  return credentials;
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}
testAuth();

import { randomUUID } from "crypto";
import { ParseJsonError } from "./validator";
import { APIGatewayProxyEvent } from "aws-lambda";

export function parseJSON(event: any) {
  try {
    return JSON.parse(event);
  } catch {
    throw new ParseJsonError();
  }
}

export function createRandomId() {
  return randomUUID();
}

export function isAdmin(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];

  return (groups as string).includes("admins");
}

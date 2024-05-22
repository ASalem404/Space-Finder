import { randomUUID } from "crypto";
import { ParseJsonError } from "./validator";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
} from "aws-lambda";

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
  if (groups) return (groups as string).includes("admins");

  return false;
}

export function addCorsHeaders(response: APIGatewayProxyResult) {
  if (!response.headers) response.headers = {};

  response.headers["Access-Control-Allow-Origin"] = "*";
  response.headers["Access-Control-Allow-Methods"] = "*";
}

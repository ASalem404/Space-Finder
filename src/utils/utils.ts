import { randomUUID } from "crypto";
import { ParseJsonError } from "./validator";

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

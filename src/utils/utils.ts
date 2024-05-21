import { ParseJsonError } from "./validator";

export function parseJSON(event: any) {
  try {
    return JSON.parse(event);
  } catch {
    throw new ParseJsonError();
  }
}

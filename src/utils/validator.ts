import { spaceEntry } from "../model/model";

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`value for field '${missingField}' is Expected.`);
  }
}
export function validateAsSpaceEntry(field: any) {
  if (!(field as spaceEntry).location) throw new MissingFieldError("location");
  if (!(field as spaceEntry).name) throw new MissingFieldError("name");
  if (!(field as spaceEntry).id) throw new MissingFieldError("id");
}

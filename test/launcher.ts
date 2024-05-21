import { handler } from "../src/functions/spaces/handler";
handler({
  httpMethod: "POST",
  body: JSON.stringify({
    name: "ASA",
    location: "Lybia",
  }),
} as any).then((result) => console.log(result));

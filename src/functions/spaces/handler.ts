import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { postSpace } from "./postSpace";

const ddbClient = new DynamoDBClient({});
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> {
  switch (event.httpMethod) {
    case "POST":
      return await postSpace(event, ddbClient);
    default:
      break;
  }

  return {
    statusCode: 404,
    body: JSON.stringify("No resource founded"),
  };
}

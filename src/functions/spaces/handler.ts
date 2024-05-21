import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { postSpace } from "./postSpace";
import { getSpaces } from "./getSpaces";
import { updateSpace } from "./updateSpace";
import { deleteSpace } from "./deleteSpace";
import { MissingFieldError } from "../../utils/validator";

const ddbClient = new DynamoDBClient({});
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> {
  try {
    switch (event.httpMethod) {
      case "POST":
        const postedRequest = await postSpace(event, ddbClient);
        return postedRequest;
      case "GET":
        const getRequestResult = await getSpaces(event, ddbClient);
        return getRequestResult;
      case "PUT":
        const updatedResult = await updateSpace(event, ddbClient);
        return updatedResult;
      case "DELETE":
        const deletedResult = await deleteSpace(event, ddbClient);
        return deletedResult;
      default:
        break;
    }
  } catch (error) {
    if (error instanceof MissingFieldError)
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
}

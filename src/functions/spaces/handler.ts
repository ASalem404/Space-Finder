import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { postSpace } from "./postSpace";
import { getSpaces } from "./getSpaces";
import { updateSpace } from "./updateSpace";
import { deleteSpace } from "./deleteSpace";
import { MissingFieldError } from "../../utils/validator";
import { addCorsHeaders } from "../../utils/utils";

const ddbClient = new DynamoDBClient({});
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult;
  try {
    switch (event.httpMethod) {
      case "POST":
        const postedRequest = await postSpace(event, ddbClient);
        response = postedRequest;
        break;
      case "GET":
        const getRequestResult = await getSpaces(event, ddbClient);
        response = getRequestResult;
        break;
      case "PUT":
        const updatedResult = await updateSpace(event, ddbClient);
        response = updatedResult;
        break;
      case "DELETE":
        const deletedResult = await deleteSpace(event, ddbClient);
        response = deletedResult;
        break;
      default:
        throw new Error("this method is not implemented yet!!");
    }

    addCorsHeaders(response);

    return response;
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

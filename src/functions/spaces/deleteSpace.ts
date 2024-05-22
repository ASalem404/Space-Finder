import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { isAdmin } from "../../utils/utils";
export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!isAdmin(event))
    return {
      statusCode: 401,
      body: JSON.stringify("Not Authorized!"),
    };

  if (!event.queryStringParameters?.id)
    return {
      statusCode: 200,
      body: JSON.stringify("Invalid request parameters!"),
    };

  const id = event.queryStringParameters.id;
  await ddbClient.send(
    new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify("Deleted successfully"),
  };
}

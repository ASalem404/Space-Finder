import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResultV2> {
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

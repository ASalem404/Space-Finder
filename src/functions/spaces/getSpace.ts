import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyResult, APIGatewayProxyResultV2 } from "aws-lambda";
export async function getSpace(
  id: string,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const result = await ddbClient.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
    })
  );

  if (result.Item)
    return {
      statusCode: 200,
      body: JSON.stringify({ space: unmarshall(result.Item) }),
    };

  return {
    statusCode: 404,
    body: JSON.stringify("There is no Item with id: " + id),
  };
}

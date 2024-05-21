import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsSpaceEntry } from "../../utils/validator";
export async function postSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResultV2> {
  const randomId = v4();
  const item = JSON.parse(event.body);
  item.id = randomId;

  validateAsSpaceEntry(item);

  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item, { removeUndefinedValues: true }),
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ space: marshall(result.Attributes) }),
  };
}

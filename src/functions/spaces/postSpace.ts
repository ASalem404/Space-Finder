import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { validateAsSpaceEntry } from "../../utils/validator";
import { createRandomId, parseJSON } from "../../utils/utils";
export async function postSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResultV2> {
  const randomId = createRandomId();
  const item = parseJSON(event.body);
  item.id = randomId;

  validateAsSpaceEntry(item);

  await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item, { removeUndefinedValues: true }),
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({}),
  };
}

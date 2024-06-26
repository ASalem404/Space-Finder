import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { parseJSON } from "../../utils/utils";
export async function updateSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters?.id || !event.body)
    return {
      statusCode: 204,
      body: JSON.stringify("Invalid request parameters!"),
    };
  const id = event.queryStringParameters.id;
  const body = parseJSON(event.body);
  const requestKey = Object.keys(body)[0];
  const requestValue = body[requestKey];

  const result = await ddbClient.send(
    new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
      UpdateExpression: "set #currentElem = :givenElem",
      ExpressionAttributeValues: {
        ":givenElem": { S: requestValue },
      },
      ExpressionAttributeNames: {
        "#currentElem": requestKey,
      },
      ReturnValues: "UPDATED_NEW",
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ result: unmarshall(result.Attributes) }),
  };
}

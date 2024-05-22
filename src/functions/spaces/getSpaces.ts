import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { getSpace } from "./getSpace";
export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters && "id" in event.queryStringParameters)
    return await getSpace(event.queryStringParameters.id, ddbClient);

  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  const unmarshalledResult = result.Items.map((item) => unmarshall(item));
  return {
    statusCode: 201,
    body: JSON.stringify({ result: unmarshalledResult }),
  };
}

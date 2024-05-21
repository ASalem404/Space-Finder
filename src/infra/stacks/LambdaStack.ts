import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface LambdaFunctionProps extends StackProps {
  SpacesTable: ITable;
}
export class LambdaStack extends Stack {
  public readonly spacelambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props: LambdaFunctionProps) {
    super(scope, id, props);

    const lambdaFunc = new NodejsFunction(this, "SpaceLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "functions", "spaces", "handler.ts"),
      environment: {
        TABLE_NAME: props.SpacesTable.tableName,
      },
    });

    lambdaFunc.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:DeleteItem",
          "dynamodb:UpdateItem",
        ],
        resources: [props.SpacesTable.tableArn],
      })
    );
    this.spacelambdaIntegration = new LambdaIntegration(lambdaFunc);
  }
}

import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiGatewayIntegration extends StackProps {
  SpaceLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApiGatewayIntegration) {
    super(scope, id, props);

    const api = new RestApi(this, "RestApi");
    const resource = api.root.addResource("spaces");
    resource.addMethod("GET", props.SpaceLambdaIntegration);
    resource.addMethod("POST", props.SpaceLambdaIntegration);
    resource.addMethod("PUT", props.SpaceLambdaIntegration);
    resource.addMethod("DELETE", props.SpaceLambdaIntegration);
  }
}

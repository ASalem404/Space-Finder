import { Stack, StackProps } from "aws-cdk-lib";
import {
  RestApi,
  LambdaIntegration,
  CognitoUserPoolsAuthorizer,
  MethodOptions,
  AuthorizationType,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiGatewayIntegration extends StackProps {
  SpaceLambdaIntegration: LambdaIntegration;
  UserPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApiGatewayIntegration) {
    super(scope, id, props);

    const api = new RestApi(this, "RestApi");

    // build the cognito authorizer
    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "SpaceApiGatewayAuthorizer",
      {
        cognitoUserPools: [props.UserPool],
        identitySource: "method.request.header.Authorization",
      }
    );

    // attach the api to the cognito authorizer
    authorizer._attachToApi(api);

    // authorizer info to be attach to the resources(function)
    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };
    const resource = api.root.addResource("spaces");
    resource.addMethod("GET", props.SpaceLambdaIntegration, optionsWithAuth);
    resource.addMethod("POST", props.SpaceLambdaIntegration, optionsWithAuth);
    resource.addMethod("PUT", props.SpaceLambdaIntegration, optionsWithAuth);
    resource.addMethod("DELETE", props.SpaceLambdaIntegration, optionsWithAuth);
  }
}

import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  SpacesTable: dataStack.SpacesTable,
});

const authStack = new AuthStack(app, "AuthStack");
new ApiStack(app, "ApiStack", {
  SpaceLambdaIntegration: lambdaStack.spacelambdaIntegration,
  UserPool: authStack.userPool,
});

new UiDeploymentStack(app, "UiStack");

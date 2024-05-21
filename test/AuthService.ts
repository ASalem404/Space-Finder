import { Amplify, Auth } from "aws-amplify";
import { type CognitoUser } from "@aws-amplify/auth";

const AwsRegion = "eu-central-1";

Amplify.configure({
  Auth: {
    region: AwsRegion,
    userPoolId: "eu-central-1_CbmgpX4zA",
    userPoolWebClientId: "248fsecbbfngt0odr46poad199",
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});
export class AuthService {
  public async signIn(username: string, password: string) {
    try {
      const user = (await Auth.signIn(username, password)) as CognitoUser;
      return user;
    } catch (error) {
      console.log("error signing in", error);
    }
  }
}

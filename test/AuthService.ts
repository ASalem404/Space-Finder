import { Amplify, Auth } from "aws-amplify";
import { type CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

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

  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${AwsRegion}.amazonaws.com/eu-central-1_CbmgpX4zA`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: "eu-central-1:1b994bb8-379e-424d-8065-cda46523e9db",
        logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}

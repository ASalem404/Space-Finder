import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const user = await service.signIn("ASalem404", "P@ssw0rd");

  const credentials = await service.generateTemporaryCredentials(user);

  console.log(credentials);

  return credentials;
}

testAuth();

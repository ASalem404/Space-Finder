import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const user = await service.signIn("ASalem404", "P@ssw0rd");

  console.log(user.getSignInUserSession().getIdToken().getJwtToken());
}

testAuth();

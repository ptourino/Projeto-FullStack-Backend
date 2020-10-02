import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";

export class UserBusiness {
  async createUser(user: UserInputDTO) {
    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const hashManager = new HashManager();
    const hashPassword = await hashManager.hash(user.password);

    const userDatabase = new UserDatabase();
    const userVerification: any = await userDatabase.getUserByEmail(user.email);

    if (userVerification === "User not found!") {
      await userDatabase.createUser(id, user.name, user.email, hashPassword);

      const userPreferencesId = idGenerator.generate();
      await userDatabase.insertUserPreferences(userPreferencesId, id);
    } else {
      throw new Error("This email is registered already!");
    }

    const authenticator = new Authenticator();
    const accessToken = authenticator.generateToken({ id });

    return accessToken;
  }

  async changeThemePreference(theme: string, id: string) {
    const userDB = new UserDatabase();
    const changedTheme: any = await userDB.changeThemePreference(theme, id);

    return changedTheme;
  }

  async getUserByEmail(user: LoginInputDTO) {
    const userDatabase = new UserDatabase();
    const userFromDB: any = await userDatabase.getUserByEmail(user.email);

    const hashManager = new HashManager();
    const hashCompare = await hashManager.compare(
      user.password,
      userFromDB.password
    );

    const authenticator = new Authenticator();
    const accessToken = authenticator.generateToken({ id: userFromDB.id });

    if (!hashCompare) {
      throw new Error("Invalid Password!");
    }

    return accessToken;
  }
}

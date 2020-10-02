import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";

export class UserController {
  async signup(req: Request, res: Response) {
    try {
      const input: UserInputDTO = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      const userBusiness = new UserBusiness();
      const token = await userBusiness.createUser(input);

      res.status(200).send({ token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginInputDTO = {
        email: req.body.email,
        password: req.body.password,
      };

      const userBusiness = new UserBusiness();
      const token = await userBusiness.getUserByEmail(loginData);
      res.status(200).send({ token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  async getUserById(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;
      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const userDB = new UserDatabase();
      const user = await userDB.getUserById(authenticationData.id);

      res.status(200).send({ user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async changeUserTheme(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;
      const theme = req.body.theme as string;

      let upperCasedTheme = theme.toUpperCase();

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);
      const userBusiness = new UserBusiness();

      await userBusiness.changeThemePreference(upperCasedTheme, user.id);

      res.status(200).send({ message: "Theme changed successfully!" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {
  private static TABLE_NAME = "MC_Users";

  public async createUser(
    id: string,
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          name,
          email,
          password,
        })
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserByEmail(email: string): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
      SELECT u.*, up.page_theme FROM MC_Users u
      INNER JOIN MC_UserPreferences up
      ON u.id = up.user_id
      WHERE u.email = "${email}"
    `);
      if (result[0].length === 0) {
        return "User not found!";
      }

      return result[0][0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserById(id: string): Promise<User> {
    const result = await this.getConnection().raw(`
      SELECT u.id, u.name, u.email, up.page_theme FROM MC_Users u
      INNER JOIN MC_UserPreferences up
      ON u.id = up.user_id
      WHERE u.id = "${id}"
    `);

    return result[0][0];
  }

  public async insertUserPreferences(id: string, user_id: string) {
    try {
      await this.getConnection()
        .insert({
          id,
          user_id,
        })
        .into("MC_UserPreferences");
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async changeThemePreference(theme: string, id: string): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
    UPDATE MC_UserPreferences 
    SET page_theme = "${theme}" WHERE user_id = "${id}"
    `);

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

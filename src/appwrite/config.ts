import config from "@/config/config";
import { Client, Account, ID } from "appwrite";

type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};

type LoginUserAccount = {
  email: string;
  password: string;
};

const appWriteClient = new Client();
appWriteClient
  .setEndpoint(config.appWriteUrl)
  .setProject(config.appWriteProjectId);

export const appWriteAccount = new Account(appWriteClient);

class AppWriteService {
  async createUserAccount({ email, password, name }: CreateUserAccount) {
    try {
      const userAccount = await appWriteAccount.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.loginUserAccount({ email, password });
      } else {
        return userAccount;
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async loginUserAccount({ email, password }: LoginUserAccount) {
    try {
      return await appWriteAccount.createEmailSession(email, password);
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const userData = await this.getCurrentUser();
      return Boolean(userData);
    } catch (error: any) {
      console.log(error);
    }
    return false;
  }

  async getCurrentUser() {
    try {
      return appWriteAccount.get();
    } catch (error: any) {
      console.log("getCurrentUser error", error);
    }
  }

  async logOutUserAccount() {
    try {
      return await appWriteAccount.deleteSession("current");
    } catch (error: any) {
      console.log("logOutUserAccount error", error);
    }
  }
}

const appWriteService = new AppWriteService();

export default appWriteService;

import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { Request } from "express";
import { Verify } from "crypto";
import { VerifyCallback } from "passport-oauth2";
import { userModel, database } from "../../models/userModel";
import * as dotenv from "dotenv";
dotenv.config();

const findOrCreateUserFromGithub = async (profile: any): Promise<any> => {
  const username = profile.username;
  try {
    let user = userModel.findOneByUsername(username);
    if (!user) {
      user = {
        id: database.length + 1,
        name: profile.displayName || username,
        email: "",
        password: "",
        role: "",
      };
      database.push(user);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const githubStrategy: GitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
    passReqToCallback: true,
  },

  /* FIX ME 😭 */
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) => {
    try {
      const user = await findOrCreateUserFromGithub(profile);
      done(null, user);
    } catch (err) {
      done(err as Error);
    }
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;

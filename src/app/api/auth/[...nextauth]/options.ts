import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import UserModel, { User } from "@/models/User";
import { connectDB } from "@/lib/db";
import { resAPI } from "@/types/res.API";
import { AxiosError } from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<string, string> | undefined
      ): Promise<User | any> {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        await connectDB();

        try {
          const user = await UserModel.findOne({
            email: credentials.identifier,
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("User is not verified");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password || ""
          );

          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          } else {
            return user;
          }
        } catch (err) {
          const error = err as AxiosError<resAPI>;
          const message =
            error.response?.data?.message || "Authentication failed";
          throw new Error(message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isExcepting = user.isExcepting;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token.id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isExcepting = token.isExcepting as boolean;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

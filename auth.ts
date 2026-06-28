import { PrismaAdapter } from '@auth/prisma-adapter'; //bridge auth logic and your database:
import NextAuth from "next-auth";


import { prisma } from "./db/prisma";
import CredentialsProvider from 'next-auth/providers/credentials'; //determine how user logIn eg:- github,email
import { compareSync } from "bcrypt-ts-edge";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, //30days
  },
  adapter: PrismaAdapter(prisma), //connect authjs to prisma client{allows authjs to automatically create and manage users, liked acc  sessions, verification tokens}

  //tells authjs user will login with email, password
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        if (credentials == null) return null;

        //Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          //If password is correct, return user// on sucess creates session or JWT
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],

  //callbacks let you customize what Auth.js does at different stages
  //modifies session and return it.
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      //Set the user ID from the token
      session.user.id = token.sub;

      //If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
  },
};

export const { auth, signIn, signOut } = NextAuth(config);

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import type { AdapterUser } from "next-auth/adapters";

import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, //30days
  },
  //connect authjs to prisma client{allows authjs to automatically create and manage users, liked acc  sessions, verification tokens}
  adapter: PrismaAdapter(prisma),

  //google provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    //login with email, password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        const email =
          typeof credentials.email === "string" ? credentials.email : null;

        const password =
          typeof credentials.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) return null;

        //Find user in database
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        //Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = await compare(password, user.password);

          //return user on sucess, creates session or JWT
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.image,
            };
          }
        }

        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  //callbacks let you customize what Auth.js does at different stages
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      //Set the user extra fields from the token
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;

      return session;
    },
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User | AdapterUser | undefined;
      trigger: "signIn" | "signUp" | "update";
      session: unknown;
    }) {
      // Handle session updates
      if (trigger === "update" && session && typeof session === "object") {
        const updateSession = session as {
          name?: string;
          email?: string;
          image?: string;
        };

        if (updateSession.name) token.name = updateSession.name;
        if (updateSession.email) token.email = updateSession.email;
        if (updateSession.image) token.picture = updateSession.image;
      }

      //only runs once after the successful login
      //storing extra data to jwt token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // carry the stored avatar into the token so session.user.image is set
        token.picture = user.image ?? undefined;

        //use Email name in case no name is set
        if (user.name === "NO_NAME" && user.email) {
          token.name = user.email.split("@")[0];
        } else if (user.name) {
          token.name = user.name;
        }
      }

      if ((trigger === "signIn" || trigger === "signUp") && user) {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get("sessionCartId")?.value;

        //guest user,not logged in user
        if (sessionCartId) {
          const sessionCart = await prisma.cart.findFirst({
            where: {
              sessionCartId,
              userId: null,
            },
          });

          //delete old cart for user and add userId to the session cart
          if (sessionCart) {
            await prisma.$transaction([
              prisma.cart.deleteMany({
                where: { userId: user.id },
              }),

              //add userId to the session cart
              prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              }),
            ]);
          }
        }
      }

      return token;
    },

    authorized({
      auth,
      request,
    }: {
      auth: Session | null;
      request: NextRequest;
    }) {
      //Array of regex patterns for path protected
      const protectedPaths = [
        /^\/shipping-address(?:\/|$)/,
        /^\/payment-method(?:\/|$)/,
        /^\/place-order(?:\/|$)/,
        /^\/profile(?:\/|$)/,
        /^\/user(?:\/|$)/,
        /^\/order(?:\/|$)/,
        /^\/admin(?:\/|$)/,
      ];

      //Get pathname from the req URL obj
      const { pathname } = request.nextUrl;

      //if user is not authenticated and check if user trying to access the protected path then return
      if (!auth && protectedPaths.some((path) => path.test(pathname)))
        return false;

      if (!request.cookies.get("sessionCartId")) {
        const response = NextResponse.next();

        response.cookies.set("sessionCartId", crypto.randomUUID(), {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        return response;
      }

      return true;
    },
  },
};

export const { auth, signIn, signOut, handlers } = NextAuth(
  config as NextAuthConfig,
);

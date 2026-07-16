//PrismaAdapter is bridge auth logic and prisma{database}:
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import  { NextRequest } from "next/server";


import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials"; //determine how user logIn eg:- github,email
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

//type for useSession()
// type UpdateSession = {
//   name?: string;
//   email?: string;
// };

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/error",
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
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        //Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = await compare(
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
  callbacks: {
    //This callback runs whenever someone calls:useSession(),auth,getServerSession
    async session({ session, token }: { session: Session; token: JWT }) {
      //Set the user ID from the token
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;

      return session;
    },
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User;
      trigger: "signIn" | "signUp" | "update";
      session: any;
    }) {
      //only runs once after the successful login
      //sotring extra data to jwt token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        //use Email name incase no name is set
        if (user.name === "NO_NAME" && user.email) {
          token.name = user.email.split("@")[0];
        }
      }

      if ((trigger === "signIn" || trigger === "signUp") && user) {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get("sessionCartId")?.value;

        if (sessionCartId) {
          const sessionCart = await prisma.cart.findFirst({
            where: { sessionCartId },
          });

          //Delete current user cart
          if (sessionCart) {
            await prisma.cart.deleteMany({
              where: { userId: user.id },
            });

            //Assign new cart
            await prisma.cart.update({
              where: { id: sessionCart.id },
              data: { userId: user.id },
            });
          }
        }
      }

      // Handle session updates {user name}
      if (trigger === "update") {
        const updateSession = session as {
          name?: string;
          email?: string;
        };

        if (updateSession.name) {
          token.name = updateSession.name;
        }

        if (updateSession.email) {
          token.email = updateSession.email;
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
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user/,
        /\/order/,
        /\/admin/,
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
          path: "/",
        });

        return response;
      }

      return true;
    },
  },
};

export const { auth, signIn, signOut, handlers } = NextAuth(config);

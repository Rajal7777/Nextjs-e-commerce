import { DefaultSession } from "next-auth";
import { DefaultJWT } from "@auth/core/jwt";

//extend  the id and role key in session  same in user & next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];

  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
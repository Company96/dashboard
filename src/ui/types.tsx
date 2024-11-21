import NextAuth from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
  }
  
  interface Session {
    userId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
  }
}


export interface User {
  userImage: string;
  firstName: string;
  lastName: string;
}

export interface GetUserResponse {
  getUser: User;
}
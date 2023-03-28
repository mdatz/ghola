import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/db/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_ID ?? '',
        clientSecret: process.env.GOOGLE_SECRET ?? ''
    }),
  ],
  callbacks: {
    // @ts-ignore
    async signIn ({ account, profile }) {
      if (account.provider === "google") {
        return true;
      }
    },
    // @ts-ignore
    async jwt ({ user, token }) {
        if (user) {
            token.uid = user.id;
            if(user?.role) {
                token.role = user?.role;
            }
        }
        return token;
    },
    // @ts-ignore
    async session ({ session, token }) {
        if (session?.user) {
            session.user.id = token.uid;
            session.user.role = token?.role;
        }
        return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
}

// @ts-ignore
export default NextAuth(authOptions)
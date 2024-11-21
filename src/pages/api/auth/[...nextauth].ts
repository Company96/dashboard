import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: string;
  email: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<User | null> {
        const res = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query Login($email: String!, $password: String!) {
                login(email: $email, password: $password)
              }
            `,
            variables: {
              email: credentials?.email,
              password: credentials?.password,
            },
          }),
        });

        const { data } = await res.json();
        const user = data?.login;

        // Return the user object or null
        if (user && user.token) {
          return { id: user.userId, email: credentials?.email || '' };
        } else {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.userId) {
        session.userId = token.userId;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/auth/signup",
  },
});

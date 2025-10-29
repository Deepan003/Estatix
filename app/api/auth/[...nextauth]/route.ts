// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// You might add other providers like CredentialsProvider here if needed
// import CredentialsProvider from "next-auth/providers/credentials";

// Define the authentication options
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string, // Ensure these are strings
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Ensure these are strings
    }),
    // Example for adding Credentials provider (username/password):
    /*
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // Example: const user = await db.findUser({ email: credentials.email })
        
        // if (user && bcrypt.compareSync(credentials.password, user.password)) {
        //   return user // Return user object on success
        // } else {
        //   return null // Return null on failure
        // }
        return null; // Placeholder
      }
    })
    */
    // ...add more providers here (e.g., GitHub, Facebook)
  ],

  // Add a secret - REQUIRED for production
  // You can generate one using: openssl rand -base64 32
  // Add this to your .env.local file as NEXTAUTH_SECRET=your_generated_secret
  secret: process.env.NEXTAUTH_SECRET,

  // Add pages configuration if you want custom login/error pages
  /*
  pages: {
    signIn: '/auth/signin', // Custom sign-in page path
    // error: '/auth/error', // Error code passed in query string as ?error=
    // signOut: '/auth/signout',
  },
  */

  // Add callbacks for customizing behavior (e.g., JWT modification, session management)
  /*
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    }
  },
  */

  // Add database adapter if you want to persist users (e.g., MongoDB adapter)
  // adapter: MongoDBAdapter(clientPromise), // You'd need to install and configure @next-auth/mongodb-adapter

  // Add session strategy (jwt is default, database is needed with adapter)
  /*
  session: {
    strategy: "jwt", // or "database"
  },
  */
};

// Initialize NextAuth.js with the options
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };
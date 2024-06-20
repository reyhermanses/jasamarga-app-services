import NextAuth from "next-auth/next";
// import initMiddleware from "../../../../lib/init-middleware";
import CredentialsProvider from "next-auth/providers/credentials";
import Cors from "cors";

// Initialize the CORS middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests from specific origins
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Helper function to initialize middleware
function initMiddleware(middleware: any) {
  return (req: Request, res: Response) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_API_KEY,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        let res: any = {};
        const { username, password, dToken } = credentials as {
          username: string;
          password: string;
          dToken: string;
        };

        
        if (username || password) {
          try {
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: username,
                password: password,
              }),
            });
          } catch (error) {
            console.error(error);
          }
        }

        if (dToken) {
          res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: dToken,
              }),
            }
          );
        }

        try {
          if (res.status === 422) return null;
          if (res.status === 500) return null;

          const user = await res.json();

          // console.log(user)

          if (res.ok && user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          return error;
        }

        // try {
        //   if (![422, 500].includes(res.status)) {
        //     const user = await res.json();
        //     if (res.ok && user) {
        //       return user;
        //     } else {
        //       return null;
        //     }
        //   } else {
        //     return null;
        //   }
        // } catch (error) {
        //   return error;
        // }
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user, trigger, session }) {
  //     if (trigger === "update") {
  //       return { ...token, ...session.user };
  //     }
  //     return { ...token, ...user };
  //   },

  //   async session({ session, token }) {
  //     session.user = token as any;
  //     return session;
  //   },
  // },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.data.id;
        token.username = user.data.v_username;
        token.personName = user.data.nama;
        token.accessToken = user.data.auth.jwt;
        token.isLoginToken = user.data.isLoginToken;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.accessToken = token.accessToken;
      session.user.personName = token.personName;
      session.user.isLoginToken = token.isLoginToken;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };

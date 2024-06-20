import NextAuth from "next-auth";

//  session.user.id = token.id;
//  session.user.username = token.username;
//  session.user.accessToken = token.accessToken;
//  session.user.personName = token.personName;

declare module "next-auth" {
  interface Session {
    user: {
      id;
      username;
      accessToken;
      personName;
      isLoginToken;
      // status: boolean;
      // message: string;
      // data: {
      //   id: number;
      //   v_username: string;
      //   employee: {
      //     person_name: string;
      //   };
      //   auth: {
      //     expires: string;
      //     jwt: string;
      //   };
      // };
    };
  }
}

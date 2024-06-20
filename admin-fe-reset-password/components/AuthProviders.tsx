"use client";

import React, { ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
interface Props {
  children: ReactNode;
}

const AuthProviders = ({ children }: Props) => {
  // const { data: session } = useSession();
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProviders;

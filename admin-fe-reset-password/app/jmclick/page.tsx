"use client";

import React, { useEffect, useState } from "react";
import GetAllUser from "../admin/all-user/page";
import { useSearchParams } from "next/navigation";
import { SignInResponse, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UnAuth } from "@/components/UnAuth";

const Jmclick = () => {
  const { data: session } = useSession();
  // const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const params = useSearchParams();

  const valParams = params.get("token") || "";

  const verifyToken = async (t: string) => {
    const response = (await signIn("credentials", {
      dToken: t,
      redirect: false,
    })) as SignInResponse;
    // let response = {status: 200, error: '2kk2'}


    if (response.status !== 200) {
      router.push("/");
    }
    setIsLogin(true);
  };

  useEffect(() => {
    const firstStep = async () => {
      if (params.get("token") && !isLogin) {
        await verifyToken(valParams);
      }
    };

    firstStep();
    // setIsClient(true); // Set isClient to true once component mounts on client-side
  }, []);

  // if (!isClient) {
  //   return null; // Render nothing on the server-side
  // }

  // console.log(session?.user);

  return <div>{session?.user && isLogin ? <GetAllUser /> : <UnAuth />}</div>;
  // return <div>test</div>;
};

export default Jmclick;

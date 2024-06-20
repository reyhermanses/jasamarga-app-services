"use client";

import { unSetAuthSession } from "@/app/redux/features/auth/authSlice";
import type { RootState } from "@/app/redux/store";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { NextRequest } from "next/server";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Guard = (): any => {
  const [authValue, setAuth] = useState(false);
  const [authLocalValue, setLocalAuth] = useState("");
  const isAuth = useSelector((state: RootState) => state.authenticate.value);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const isNotNull: any = localStorage.getItem("auth");
    setLocalAuth(isNotNull);
    if (isAuth) {
      setAuth(isAuth);
    } else {
      if (authLocalValue) {
        setAuth(true);
      } else {
        setAuth(false);
      }
    }
  }, [isAuth, authValue, authLocalValue]);

  const handleLogout = (e: any) => {
    e.preventDefault();
    localStorage.removeItem("auth");
    setAuth(false);
    setLocalAuth("");
    dispatch(unSetAuthSession());
  };

  !authValue ? router.replace("/") : router.replace("/admin");

  // if (!authValue) return <>You have to logged in</>;
  // else
  //   return (
  //     <div>
  //       You are logged in
  //       <Button bg="red" fullWidth mt="xl" onClick={(e) => handleLogout(e)}>
  //         Log Out
  //         {/* <Link href="/pages/admin/list-user-auth">Sign in</Link> */}
  //       </Button>
  //     </div>
  //   );

  // return <>Loading</>;
};

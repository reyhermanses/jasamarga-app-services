"use client";

import React from "react";
import { useEffect, useState } from "react";
import { UnstyledButton, Tooltip, Title, rem, Stack } from "@mantine/core";
import { IconHome2, IconPassword, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./css/DoubleNavbar.module.css";
import { usePathname } from "next/navigation";

const mainLinksMockdata = [
  { icon: IconHome2, label: "Dashboard", url: "/admin" },
  // { icon: IconUser, label: "User Management", url: "/admin/user" },
  { icon: IconPassword, label: "Auth Management", url: "/admin/all-user" },
];

const linksMockdata2 = [
  {
    title: "Auth Management",
    url: "/admin/all-user",
    child: [
      {
        title: "User Aggregator",
        url: "/admin/all-user",
      },
      // {
      //   title: "User Reset Password",
      //   url: "/admin/user",
      // },
      // {
      //   title: "Reset Password",
      //   url: "/admin/reset-password",
      // },
      // {
      //   title: "Counter",
      //   url: "/admin/counter",
      // },
    ],
  },
];

export function DoubleNavbar() {
  const pathName = usePathname();
  const [active, setActive] = useState("Dashboard");

  const handleItemClick = (itemName: string) => {
    setActive(itemName);
    localStorage.setItem("activeNavbarItem", itemName); // Store active item in localStorage
  };

  useEffect(() => {
    // Retrieve active item from localStorage on initial load
    const storedActiveItem = localStorage.getItem("activeNavbarItem");
    if (storedActiveItem) {
      setActive(storedActiveItem);
    }
  }, []);

  const mainLinks = mainLinksMockdata.map((link) => {
    return (
      <Tooltip
        label={link.label}
        position="right"
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <UnstyledButton
          key={link.label}
          onClick={() => handleItemClick(link.label)}
          className={classes.mainLink}
          data-active={link.label === active || undefined}
        >
          <Link key={link.label} href={link.url ?? "#"}>
            <link.icon
              style={{ width: rem(22), height: rem(22) }}
              stroke={1.5}
            />
          </Link>
        </UnstyledButton>
      </Tooltip>
    );
  });

  const link = linksMockdata2.map((link, i) => {
    if (link.title === active) {
      return link.child.map((link) => (
        <Link
          className={classes.link}
          data-active={pathName === link.url || undefined}
          href={link.url}
          // onClick={() => handleChildItemClick(link.url)}
          key={link.title}
        >
          {link.title}
        </Link>
      ));
    }
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.navbarMain}>
            <Stack justify="center" gap={0}>
              {mainLinks}
            </Stack>
          </div>
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>
          {link}
        </div>
      </div>
    </nav>
  );
}

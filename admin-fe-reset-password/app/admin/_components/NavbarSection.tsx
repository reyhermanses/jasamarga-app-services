"use client";

import { useDisclosure } from "@mantine/hooks";
import { AppShell, Avatar, Burger, Button, Group, Menu } from "@mantine/core";
import { DoubleNavbar } from "./DoubleNavbar";
import { IconLogout2 } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { Notifications } from "@mantine/notifications";
import { signOut, useSession } from "next-auth/react";

interface InterfaceChildren {
  children: any;
}

const NavbarSection: React.FC<InterfaceChildren> = ({ children }) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const route = useRouter();
  const { data: session } = useSession();

  return (
    <AppShell
      bg="#e6f4ff"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header w="100%" bg="#f5f5f5">
        <Group h="100%" px="md">
          <div>
            <img src="../../assets/img-logo.png" width={200} alt="Your Image" />
          </div>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <Group
            justify="space-between"
            style={{ flex: 1, justifyContent: "right" }}
          >
            <Group ml="xl" gap={0}>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Avatar bg="#e6f7ff" radius="xl" color="#096dd9" />
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>{session?.user.personName}</Menu.Label>
                  {!session?.user.isLoginToken ? (
                    <Menu.Item
                      onClick={() =>
                        signOut({ redirect: false }).then(() => {
                          route.push("/"); // Redirect to the dashboard page after signing out
                        })
                      }
                      leftSection={
                        <IconLogout2 style={{ width: "14", height: "14" }} />
                      }
                    >
                      Log Out
                    </Menu.Item>
                  ) : (
                    ""
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        {/* <AppShell.Section> */}
        <DoubleNavbar />
        {/* </AppShell.Section> */}
        {/* <AppShell.Section>@2023 Jasamarga</AppShell.Section> */}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default NavbarSection;

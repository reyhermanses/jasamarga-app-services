"use client";

import { AppShell, Burger, Flex, Group } from "@mantine/core";

interface InterfaceChildren {
  children: any;
}

const AppShellMain: React.FC<InterfaceChildren> = ({ children }) => {
  return (
    <AppShell
      bg="#e6f4ff"
      header={{ height: { base: 48, sm: 60, lg: 76 } }}
      padding="md"
    >
      <AppShell.Header bg="#228BE6">
        <Group h="100%" px="md">
          <Group px="md">
            <div>
              <img
                src="../../assets/jm-logo.png"
                width={200}
                alt="Your Image"
              />
            </div>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default AppShellMain;

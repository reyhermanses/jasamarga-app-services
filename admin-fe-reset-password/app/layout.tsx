import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import { ReduxProviders } from "./redux/provider";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import AuthProviders from "@/components/AuthProviders";

// export const metadata = {
//   title: "Mantine Next.js template",
//   description: "I am using Mantine with Next.js!",
// };

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light">
          <ReduxProviders>
            <Notifications />
            <AuthProviders>{children}</AuthProviders>
          </ReduxProviders>
        </MantineProvider>
      </body>
    </html>
  );
}

// export default

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

import { Guard } from "@/components/Guard";
import { Notifications } from "@mantine/notifications";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span>{children}</span>;
}

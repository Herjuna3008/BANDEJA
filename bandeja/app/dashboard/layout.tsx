import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashboardLayout
      variant="user"
      userName={session.user.name}
      userEmail={session.user.email}
      userImage={session.user.image}
    >
      {children}
    </DashboardLayout>
  );
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function CoachDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "COACH" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout
      variant="coach"
      userName={session.user.name}
      userEmail={session.user.email}
      userImage={session.user.image}
    >
      {children}
    </DashboardLayout>
  );
}

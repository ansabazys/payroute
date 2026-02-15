import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SessionWrapper from "@/components/providers/SessionWrapper";
import BottomNav from "@/components/navigation/BottomNav";


export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <SessionWrapper session={session}>
      {children}
      <BottomNav />
    </SessionWrapper>
  );
}

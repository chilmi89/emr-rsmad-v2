import { redirect } from "next/navigation";

interface SimulationPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function SimulationPage({ params }: SimulationPageProps) {
  const { token } = await params;
  redirect(`/auth-emr/login?token=${token}`);
}


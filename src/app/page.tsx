import { redirect } from "next/navigation";

export default function RootHomePage() {
  // Redirect root URL directly to the EMR RSMAD simulation login page
  redirect("/auth-emr/login");
}

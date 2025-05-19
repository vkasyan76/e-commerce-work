import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
<<<<<<< HEAD

const Page = () => {
=======
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const Page = async () => {
  // Disable the sign-in page if you are logged in:
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/");
  }

>>>>>>> e8d2a9ad32a3f5a9b2d841df838840fd0c32536c
  return <SignInView />;
};

export default Page;

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user";
import { CreateCollectionForm } from "./form";

const CreateCollectionPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl text-center">创建作品集</h1>
        <CreateCollectionForm />
      </div>
    </main>
  );
};

export default CreateCollectionPage;

import { redirect } from "next/navigation";
import { CollectionForm } from "@/forms/collection";
import { findCurrentUser } from "@/server/auth";

const CreateCollectionPage = async () => {
  const user = await findCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl text-center">创建作品集</h1>
        <CollectionForm mode="create" />
      </div>
    </main>
  );
};

export default CreateCollectionPage;

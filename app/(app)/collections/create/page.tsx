import { redirect } from "next/navigation";
import { CollectionForm } from "@/components/collection-form";
import { getSession } from "@/utils/session";

const CreateCollectionPage = async () => {
  const user = await getSession();

  if (!user) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/create`)}`,
    );
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

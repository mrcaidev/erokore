import { redirect } from "next/navigation";
import { cache } from "react";
import { CollectionForm } from "@/components/collection-form";
import { getSession } from "@/utils/session";
import { buildRelativeUrl } from "@/utils/url";

const fetchPageData = cache(async () => {
  const session = await getSession();

  if (!session) {
    return redirect(
      buildRelativeUrl("/sign-in", { next: "/collections/create" }),
    );
  }

  return undefined;
});

const CreateCollectionPage = async () => {
  await fetchPageData();

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

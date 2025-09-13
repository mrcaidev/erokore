import { forbidden, notFound } from "next/navigation";
import { CollectionForm } from "@/forms/collection";
import { findCollection } from "@/server/collection";
import { hasPermission } from "@/utils/permission";

export type EditCollectionPageProps = {
  params: Promise<{ slug: string }>;
};

const EditCollectionPage = async ({ params }: EditCollectionPageProps) => {
  const { slug } = await params;
  const collection = await findCollection(slug);

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "admin")) {
    return forbidden();
  }

  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl text-center">编辑作品集</h1>
        <CollectionForm mode="edit" collection={collection} />
      </div>
    </main>
  );
};

export default EditCollectionPage;

import { forbidden, notFound } from "next/navigation";
import { cache } from "react";
import { CollectionForm } from "@/components/collection-form";
import { selectOnePersonalizedCollectionBySlug } from "@/repository/collection";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";

const fetchPageData = cache(async (slug: string) => {
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionBySlug(
    slug,
    session?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  return { collection };
});

export type EditCollectionPageProps = {
  params: Promise<{ slug: string }>;
};

const EditCollectionPage = async ({ params }: EditCollectionPageProps) => {
  const { slug } = await params;
  const { collection } = await fetchPageData(slug);

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

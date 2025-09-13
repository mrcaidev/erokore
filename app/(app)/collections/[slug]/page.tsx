import { forbidden, notFound } from "next/navigation";
import { findPersonalizedCollectionBySlug } from "@/server/collection";
import { hasPermission } from "@/utils/permission";

export type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug } = await params;
  const collection = await findPersonalizedCollectionBySlug(slug);

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  return <div>作品集 {JSON.stringify(collection)}</div>;
};

export default CollectionPage;

import { notFound } from "next/navigation";
import { findCollectionBySlug } from "@/server/collection";

export type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug } = await params;
  const collection = await findCollectionBySlug(slug);

  if (!collection) {
    return notFound();
  }

  return <div>作品集 {collection.title}</div>;
};

export default CollectionPage;

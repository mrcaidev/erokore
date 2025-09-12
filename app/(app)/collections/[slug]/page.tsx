import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/server/collection";

export type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return notFound();
  }

  return <div>作品集 {collection.title}</div>;
};

export default CollectionPage;

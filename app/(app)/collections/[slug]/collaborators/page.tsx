import Link from "next/link";
import { forbidden, notFound } from "next/navigation";
import { cache } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { selectManyEnrichedCollaborationsByCollectionId } from "@/repository/collaboration";
import { selectOnePersonalizedCollectionBySlug } from "@/repository/collection";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import { CollaboratorCard } from "./collaborator-card";
import { InvitationForm } from "./invitation-form";

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

  const collaborations = await selectManyEnrichedCollaborationsByCollectionId(
    collection.id,
  );
  return { session, collection, collaborations };
});

export type CollectionCollaboratorsPageProps = {
  params: Promise<{ slug: string }>;
};

const CollectionCollaboratorsPage = async ({
  params,
}: CollectionCollaboratorsPageProps) => {
  const { slug } = await params;
  const { session, collection, collaborations } = await fetchPageData(slug);

  return (
    <main className="max-w-7xl px-8 py-24 mx-auto">
      <div className="space-y-4 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/collections/${slug}`}>{collection.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>协作者</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mb-4 text-3xl font-bold">协作者</h1>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_360px] gap-8">
          <div className="order-2 md:order-1">
            <ul className="divide-y">
              {collaborations.map((collaboration) => (
                <CollaboratorCard
                  key={collaboration.id}
                  currentUserId={session!.id}
                  collection={collection}
                  collaboration={collaboration}
                />
              ))}
            </ul>
          </div>
          {hasPermission(collection, "admin") && (
            <div className="order-1 md:order-2">
              <div className="space-y-6 px-5 py-4 border rounded-md">
                <div className="font-medium text-lg">邀请协作者</div>
                <InvitationForm collection={collection} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CollectionCollaboratorsPage;

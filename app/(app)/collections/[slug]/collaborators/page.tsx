import Link from "next/link";
import { forbidden, notFound } from "next/navigation";
import { cache } from "react";
import { Paginator } from "@/components/paginator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  countCollaborationsByCollectionId,
  selectManyCollaboratorEnrichedCollaborationsByCollectionId,
} from "@/database/collaboration";
import { selectOnePersonalizedCollectionBySlug } from "@/database/collection";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import { normalizePage } from "@/utils/url";
import { CollaboratorCard } from "./collaborator-card";
import { InvitationForm } from "./invitation-form";

const fetchPageData = cache(async (slug: string, page: number) => {
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

  const [collaborationsTotal, collaborations] = await Promise.all([
    countCollaborationsByCollectionId(collection.id),
    selectManyCollaboratorEnrichedCollaborationsByCollectionId(collection.id, {
      limit: 10,
      offset: (page - 1) * 10,
    }),
  ]);

  return { session, collection, collaborationsTotal, collaborations };
});

export type CollectionCollaboratorsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const CollectionCollaboratorsPage = async ({
  params,
  searchParams,
}: CollectionCollaboratorsPageProps) => {
  const { slug } = await params;
  const { page } = await searchParams;
  const { session, collection, collaborationsTotal, collaborations } =
    await fetchPageData(slug, normalizePage(page));

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
          <div className="space-y-3 order-2 md:order-1">
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
            <Paginator
              total={collaborationsTotal}
              page={normalizePage(page)}
              pageSize={10}
            />
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

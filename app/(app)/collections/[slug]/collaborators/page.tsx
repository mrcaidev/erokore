import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { findCurrentUser } from "@/server/auth";
import { listEnrichedCollaborations } from "@/server/collaboration";
import { findCollection } from "@/server/collection";
import { hasPermission } from "@/utils/permission";
import { CollaboratorCard } from "./collaborator-card";
import { InvitationForm } from "./invitation-form";

export type CollectionCollaboratorsPageProps = {
  params: Promise<{ slug: string }>;
};

const CollectionCollaboratorsPage = async ({
  params,
}: CollectionCollaboratorsPageProps) => {
  const { slug } = await params;
  const collection = await findCollection(slug);

  if (!collection) {
    return notFound();
  }

  const [user, collaborations] = await Promise.all([
    findCurrentUser(),
    listEnrichedCollaborations(collection.id),
  ]);

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
                  currentUserId={user!.id}
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

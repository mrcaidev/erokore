import { CircleCheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { selectOnePersonalizedCollectionBySlug } from "@/database/collection";
import { selectOneInviterEnrichedInvitationByCollectionIdAndCode } from "@/database/invitation";
import {
  comparePermissionLevels,
  PERMISSION_LEVEL_LABEL_MAP,
} from "@/utils/permission";
import { getSession } from "@/utils/session";
import { AcceptInvitationButton } from "./accept-invitation-button";

const fetchPageData = cache(async (slug: string, code: string) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${slug}/invite?code=${code}`)}`,
    );
  }

  const collection = await selectOnePersonalizedCollectionBySlug(
    slug,
    session.id,
  );

  if (!collection) {
    return notFound();
  }

  if (collection.myPermissionLevel !== null) {
    return redirect(`/collections/${slug}`);
  }

  const invitation =
    await selectOneInviterEnrichedInvitationByCollectionIdAndCode(
      collection.id,
      code,
    );

  if (!invitation) {
    return notFound();
  }

  return { invitation, collection };
});

export type CollectionCollaboratorInvitationPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ code?: string }>;
};

const CollectionCollaboratorInvitationPage = async ({
  params,
  searchParams,
}: CollectionCollaboratorInvitationPageProps) => {
  const { slug } = await params;
  const { code } = await searchParams;

  if (!code) {
    return notFound();
  }

  const { invitation, collection } = await fetchPageData(slug, code);

  const permissionLevel =
    invitation.permissionLevel === "default"
      ? collection.collaboratorPermissionLevel
      : invitation.permissionLevel;

  return (
    <main className="grid place-items-center min-h-screen">
      <div className="sm:min-w-96 p-8 sm:p-4 sm:border rounded-md">
        <div className="flex items-center gap-1 mb-3 text-sm">
          <div className="flex items-center gap-1.5">
            <UserAvatar user={invitation.inviter} />
            <div className="text-muted-foreground">
              {invitation.inviter.nickname}
            </div>
          </div>
          <p className="text-muted-foreground">邀请你加入</p>
        </div>
        <h1 className="mb-6 font-bold text-2xl text-center text-balance">
          {collection.title}
        </h1>
        <p className="mb-3 text-muted-foreground text-sm">
          你将拥有“{PERMISSION_LEVEL_LABEL_MAP[permissionLevel]}”权限，可以：
        </p>
        <ul className="space-y-2 mb-4 text-muted-foreground text-sm">
          {comparePermissionLevels(permissionLevel, "viewer") >= 0 && (
            <li className="flex items-center gap-2">
              <CircleCheckIcon className="size-4 text-green-600" />
              <p>查看、关注作品集，查看作品，查看协作者</p>
            </li>
          )}
          {comparePermissionLevels(permissionLevel, "rater") >= 0 && (
            <li className="flex items-center gap-2">
              <CircleCheckIcon className="size-4 text-green-600" />
              <p>点赞、点踩、评论作品</p>
            </li>
          )}
          {comparePermissionLevels(permissionLevel, "contributor") >= 0 && (
            <li className="flex items-center gap-2">
              <CircleCheckIcon className="size-4 text-green-600" />
              <p>添加、编辑、删除作品</p>
            </li>
          )}
          {comparePermissionLevels(permissionLevel, "admin") >= 0 && (
            <li className="flex items-center gap-2">
              <CircleCheckIcon className="size-4 text-green-600" />
              <p>编辑作品集，邀请协作者，调整、移除权限等级低于自己的协作者</p>
            </li>
          )}
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button variant="secondary" asChild>
            <Link href="/">
              <XIcon />
              取消
            </Link>
          </Button>
          <AcceptInvitationButton />
        </div>
      </div>
    </main>
  );
};

export default CollectionCollaboratorInvitationPage;

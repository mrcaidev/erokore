import type { FullUser, PrivateUser, PublicUser } from "@/utils/types";
import { db } from "./client";

const usersCollection = db.collection<FullUser>("users");

export const findOneFullUserById = async (id: string) => {
  const user = await usersCollection.findOne(
    { id, deletedAt: null },
    {
      projection: {
        id: 1,
        email: 1,
        nickname: 1,
        avatarUrl: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
        passwordSalt: 1,
        passwordHash: 1,
      },
    },
  );
  return user as FullUser | null;
};

export const findOnePrivateUserById = async (id: string) => {
  const user = await usersCollection.findOne(
    { id, deletedAt: null },
    {
      projection: {
        id: 1,
        email: 1,
        nickname: 1,
        avatarUrl: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
      },
    },
  );
  return user as PrivateUser | null;
};

export const findOnePublicUserById = async (id: string) => {
  const user = await usersCollection.findOne(
    { id, deletedAt: null },
    { projection: { id: 1, email: 1, nickname: 1, avatarUrl: 1 } },
  );
  return user as PublicUser | null;
};

export const findOneFullUserByEmail = async (email: string) => {
  const user = await usersCollection.findOne(
    { email, deletedAt: null },
    {
      projection: {
        id: 1,
        email: 1,
        nickname: 1,
        avatarUrl: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
        passwordSalt: 1,
        passwordHash: 1,
      },
    },
  );
  return user as FullUser | null;
};

export const insertOneUser = async (user: FullUser) => {
  const result = await usersCollection.insertOne(user);
  return result;
};

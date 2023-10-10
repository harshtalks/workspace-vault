import { PrismaClient, User } from "database";
import { NextRequest } from "next/server";
import { faker } from "@faker-js/faker";

export const GET = async () => {
  const createRandomUser = (): User => {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      lastName: faker.person.firstName(),
      created_at: faker.date.anytime(),
      updated_at: faker.date.soon(),
    };
  };

  const USERS: User[] = faker.helpers.multiple(createRandomUser, {
    count: 100,
  });

  const prisma = new PrismaClient();

  const users = await prisma.user.createMany({
    data: USERS,
  });

  prisma.$disconnect();

  return Response.json({}, { status: 201 });
};

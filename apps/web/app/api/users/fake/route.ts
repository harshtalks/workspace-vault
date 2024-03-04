import db, { users } from "database";
import { NextRequest, NextResponse } from "next/server";
import { fa, faker } from "@faker-js/faker";

export const GET = async () => {
  const createRandomUser = (): typeof users.$inferInsert => {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      lastName: faker.person.firstName(),
      username: faker.person.middleName() + "_" + faker.person.jobTitle(),
    };
  };

  const USERS = faker.helpers.multiple(createRandomUser, {
    count: 100,
  });

  const fakeUsers = await db.insert(users).values(USERS).returning();

  return NextResponse.json({ fakeUsers }, { status: 201 });
};

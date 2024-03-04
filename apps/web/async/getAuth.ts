import { validateRequest } from "@/lib/auth/auth";

const getAuth = async () => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("User not found in the database");
  }

  return user;
};

export default getAuth;

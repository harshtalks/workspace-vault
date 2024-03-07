import { validateRequest } from "@/lib/auth/auth";
import db, { and, eq, members } from "database";

export const butBroCanYouDoShitHere = async (workspace: string) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("User not found");
    }

    const canYouAddMembersHere = await db.query.members.findFirst({
      where: and(
        eq(members.workspaceId, workspace),
        eq(members.ownerId, user.id)
      ),
    });

    if (!canYouAddMembersHere) {
      throw new Error();
    }

    return {
      addUser: canYouAddMembersHere.permissions.includes("AddMembers"),
      addOrEditFile: canYouAddMembersHere.permissions.includes("Write"),
      status: "success" as const,
    };
  } catch (error) {
    return {
      addUser: false,
      addOrEditFile: false,
      status: "error" as const,
    };
  }
};

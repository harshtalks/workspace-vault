import db, { eq, workspaces } from "database";

export const getWorkspaceData = async (workspace: string) => {
  try {
    const workspaceData = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspace),
      with: {
        members: true,
      },
    });

    return {
      status: "success",
      result: workspaceData,
    };
  } catch (e) {
    return {
      status: "error",
      error: e instanceof Error ? e.message : "Error 500 lol",
    };
  }
};

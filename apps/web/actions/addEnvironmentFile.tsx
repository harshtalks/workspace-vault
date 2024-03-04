"use server";
import { RequestError, RequestSuccess } from "@/middlewares/type";
import db, { environmentFiles, variables } from "database";
import { z } from "zod";

const addFileSchema = z.object({
  name: z.string({
    invalid_type_error: "This is an invalid name",
  }),
  workspaceId: z.string({
    invalid_type_error: "The provided workspace id is invalid",
  }),
});

export const submitActionToAddNewFile = async (
  workspaceId: string,
  formData: FormData
) => {
  try {
    const fields = addFileSchema.parse({
      name: formData.get("name"),
      workspaceId: workspaceId,
    });

    const data = await db.insert(environmentFiles).values(fields);

    return {
      result: data[0],
      status: "success",
    } as RequestSuccess<typeof environmentFiles.$inferInsert>;
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Something went wrong.",
      status: "error",
    } as RequestError;
  }
};

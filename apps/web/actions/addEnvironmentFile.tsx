"use server";
import {
  RequestError,
  RequestResponse,
  RequestSuccess,
} from "@/middlewares/type";
import db, { environmentFiles, variables } from "database";
import { toast } from "sonner";
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
    const validateAllTheFields = addFileSchema.safeParse({
      name: formData.get("name"),
      workspaceId: workspaceId,
    });

    if (validateAllTheFields.success === false) {
      const error = validateAllTheFields.error.flatten().fieldErrors;

      throw new Error(error.name.join(" | ") || error.workspaceId.join(" | "));
    }

    const data = await db.insert(environmentFiles).values({
      name: validateAllTheFields.data.name,
      workspaceId: validateAllTheFields.data.workspaceId,
    });

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

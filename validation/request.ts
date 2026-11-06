import { type ZodType, type z } from "zod";
import { ValidationError } from "@/lib/errors";

export async function validateData<T extends ZodType>(
  schema: T,
  data: unknown,
): Promise<z.infer<T>> {
  const result = await schema.safeParseAsync(data);
  if (!result.success) {
    throw new ValidationError("Invalid request payload", result.error.flatten());
  }
  return result.data;
}

import { z } from "zod";

export const createBranchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters").max(100),
  code: z.string().max(20).optional(),
  address: z.string().max(255).optional(),
  phone: z.string().max(30).optional(),
});

export const updateBranchSchema = createBranchSchema.partial();

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;

import z from 'zod';
const categoryValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    createdBy: z.string().optional(),
  }),
});

export const CategoryValidations = {
  categoryValidationSchema,
};

import z from 'zod';
const reviewValidationSchema = z.object({
  body: z.object({
    courseId: z.string(),
    rating: z.number(),
    review: z.string(),
    createdBy: z.string().optional(),
  }),
});

export const ReviewValidations = {
  reviewValidationSchema,
};

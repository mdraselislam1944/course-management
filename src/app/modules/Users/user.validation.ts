import { z } from "zod";

const userInformationSchemaValidation = z.object({
  username: z.string().nonempty({
    message: "Username is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().nonempty({
    message: "Password is required",
  }),
  role: z.string().refine(value => ['user', 'admin'].includes(value), {
    message: "Invalid role. Allowed values are 'user' or 'admin'.",
  }),
});

export default userInformationSchemaValidation;

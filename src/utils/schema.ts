import z from 'zod';

const passwordSchema = z.string().min(6).max(255);
const emailSchema = z.string().min(1).max(255);
export const slugSchema = z.string().min(3, 'Minimum of 3 characters required');
export const paramSchema = z.string();

export const loginSchema = z.object({
  email: emailSchema,
  userAgent: z.string(),
  password: passwordSchema,
});

export const registerSchema = () =>
  loginSchema
    .extend({
      firstName: z.string(),
      lastName: z.string(),
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

export const updateProfileSchema = z
  .object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    phoneNumber: z.string().min(1).max(20),
    email: emailSchema,
  })
  .partial(); // .Partial() allows all fields to be optional

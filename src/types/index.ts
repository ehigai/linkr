export type CreateAccountPayload = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  userAgent: string;
  password: string;
};

export type UpdateUserFields = Partial<{
  firstName: string;
  lastName: string;
  email: string;
}>;


import type { User } from "@/hooks/use-auth";
import API from "./client";

// Auth

export const getUser = (): Promise<User> => API.get("/profile");

export const login = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

export const googleLogin = (): Promise<{ redirect: string }> =>API.get("/auth/google")
export const googleCallback = (code: string, state:string) =>
  API.get(`/auth/google/callback?code=${code}&state=${state}`);

export const register = (data: {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}) => API.post("/auth/signup", data);
export const logout = () => API.get("/auth/logout");
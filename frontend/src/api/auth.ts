import { apiRequest } from "@/api/client";
import { UserProfile } from "@/types/api";

export interface LoginPayload {
  email: string;
  password: string;
  org_slug?: string;
}

export async function login(payload: LoginPayload) {
  return apiRequest<{
    access_token: string;
    refresh_token: string;
    user: UserProfile;
    organization: { id: string; name: string; slug: string };
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getMe(token: string) {
  return apiRequest<UserProfile>("/auth/me", { token });
}


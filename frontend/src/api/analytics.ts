import { apiRequest } from "@/api/client";
import { AnalyticsOverview } from "@/types/api";

export function getAnalyticsOverview(token: string) {
  return apiRequest<AnalyticsOverview>("/analytics/overview", { token });
}


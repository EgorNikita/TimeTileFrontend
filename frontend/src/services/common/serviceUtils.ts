import { API_BASE_URL, API_ENDPOINTS } from "@/constants";

export interface EntityWithIcon {
  iconUrl: string;
}

export function transformIconUrls<T extends EntityWithIcon>(
  entities: T[],
): T[] {
  return entities.map((item) => ({
    ...item,
    iconUrl: `${API_BASE_URL}${API_ENDPOINTS.FILES}/${item.iconUrl}`,
  }));
}

export function transformAvatarUrls<T extends { avatarUrl: string }>(
  entities: T[],
): T[] {
  return entities.map((item) => ({
    ...item,
    avatarUrl: `${API_BASE_URL}${API_ENDPOINTS.FILES}/${item.avatarUrl}`,
  }));
}

export function transformAvatarUrl<T extends { avatarUrl: string }>(
  entity: T,
): T {
  return {
    ...entity,
    avatarUrl: `${API_BASE_URL}${API_ENDPOINTS.FILES}/${entity.avatarUrl}`,
  };
}

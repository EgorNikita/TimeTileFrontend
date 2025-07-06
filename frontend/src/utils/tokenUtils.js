import { TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants.ts";
import { failure, success } from "@/utils/resultPattern.ts";
import { jwtDecode } from "jwt-decode";

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = () => {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
};

export const storeTokens = (accessToken, refreshToken, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;

  // Clear from both storages first
  clearAllTokens();

  // Store in chosen storage
  storage.setItem(TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearAllTokens = () => {
  console.log("Clearing all tokens");
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isTokenRemembered = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

export function extractClaimsFromToken(token) {
  try {
    if (isTokenExpired(token)) return failure("Token expired");

    const decoded = jwtDecode(token);

    return success({
      role:
        decoded["role"] ||
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        null,
      userId:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] || null,
      institutionDomain:
        decoded["institution_domain"] || decoded.institutionDomain || null,
      institutionId: decoded["institution_id"] || decoded.institutionId || null,
      email:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] ||
        decoded.email ||
        null,
    });
  } catch (e) {
    return failure(`Invalid token: ${e.message}`);
  }
}

export function isTokenExpired(token) {
  if (!token) return true;

  const payload = jwtDecode(token);
  return payload.exp <= Date.now() / 1000 + 5; // Allow 5 seconds buffer
}

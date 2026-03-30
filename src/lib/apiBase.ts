export function getApiBase(): string {
  // Client components: build API URL from the current origin.
  if (typeof window !== "undefined") return `${window.location.origin}/api/v1`;

  // SSR/initial render fallback: rely on env (set in docker-compose for split-repos).
  return process.env.NEXT_PUBLIC_API_BASE || "http://api-gateway:8080/api/v1";
}


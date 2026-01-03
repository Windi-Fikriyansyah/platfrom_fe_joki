import type { User } from "./types";

/**
 * Get display name from user
 * Priority:
 * 1. system_name from freelancer_profile (if exists and not empty)
 * 2. name from user
 * 3. "Unknown User" as fallback
 */
export function getDisplayName(user?: User | null): string {
  if (!user) return "Unknown User";

  // If user has freelancer_profile with system_name, use it
  if (user.freelancer_profile?.system_name) {
    return user.freelancer_profile.system_name;
  }

  // Otherwise use the user's name
  if (user.name) {
    return user.name;
  }

  return "Unknown User";
}

/**
 * Get avatar initial from user
 */
export function getAvatarInitial(user?: User | null): string {
  const displayName = getDisplayName(user);
  return displayName.charAt(0).toUpperCase();
}

/**
 * Format time to HH.mm 24h format
 */
export function formatChatTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(":", ".");
}

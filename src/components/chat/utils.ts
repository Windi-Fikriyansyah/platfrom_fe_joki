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

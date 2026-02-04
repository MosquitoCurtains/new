// Placeholder profile client - will be configured later

export interface Profile {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export async function getActiveProfileClient(userId?: string): Promise<Profile | null> {
  // TODO: Implement with actual Supabase
  return null
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  // TODO: Implement with actual Supabase
  return null
}

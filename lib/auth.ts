export interface User {
  id: string
  name: string
  permissions: string[]
}

export const getCurrentUser = (): User | null => {
  // This is a mock function. Replace with your actual authentication logic.
  return {
    id: "1",
    name: "John Doe",
    permissions: ["tab2", "tab3", "admin"],
  }
}

export const hasPermission = (user: User | null, permission: string): boolean => {
  return user?.permissions.includes(permission) || false
}


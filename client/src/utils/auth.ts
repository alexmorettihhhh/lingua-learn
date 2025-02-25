/**
 * Get the authentication token from local storage
 * @returns The authentication token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set the authentication token in local storage
 * @param token - The authentication token to store
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove the authentication token from local storage
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Check if the user is authenticated
 * @returns True if the user is authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Get the authentication header for API requests
 * @returns An object with the Authorization header or an empty object if not authenticated
 */
export const getAuthHeader = (): { Authorization?: string } => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get the user ID from the token
 * @returns The user ID or null if not found
 */
export const getUserId = (): string | null => {
  return localStorage.getItem('userId');
};

/**
 * Set the user ID in local storage
 * @param userId - The user ID to store
 */
export const setUserId = (userId: string): void => {
  localStorage.setItem('userId', userId);
};

/**
 * Remove the user ID from local storage
 */
export const removeUserId = (): void => {
  localStorage.removeItem('userId');
};

/**
 * Get the user role from local storage
 * @returns The user role or null if not found
 */
export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

/**
 * Set the user role in local storage
 * @param role - The user role to store
 */
export const setUserRole = (role: string): void => {
  localStorage.setItem('userRole', role);
};

/**
 * Remove the user role from local storage
 */
export const removeUserRole = (): void => {
  localStorage.removeItem('userRole');
};

/**
 * Check if the user is an admin
 * @returns True if the user is an admin, false otherwise
 */
export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};

/**
 * Clear all authentication data from local storage
 */
export const clearAuth = (): void => {
  removeToken();
  removeUserId();
  removeUserRole();
}; 
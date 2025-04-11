import useAuthStore from '../store/authStore';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const can = (permission) => {
    return hasPermission(user, permission);
  };

  const canAny = (permissions) => {
    return hasAnyPermission(user, permissions);
  };

  const canAll = (permissions) => {
    return hasAllPermissions(user, permissions);
  };

  const isStudent = () => user?.role === 'student';
  const isTutor = () => user?.role === 'tutor';
  const isAdmin = () => user?.role === 'admin';

  return {
    can,
    canAny,
    canAll,
    isStudent,
    isTutor,
    isAdmin,
  };
}; 
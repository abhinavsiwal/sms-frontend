// import { cloneElement } from "react";
import { PERMISSIONS, ROLES } from "./permission-maps";
import useGetRole from "./useGetRole";
import { isAuthenticated } from "api/auth";



export const hasPermission = ({ permissions, scopes }) => {
  const scopesMap = {};  
  // console.log(permissions,scopes);
  scopes.forEach((scope) => {
    scopesMap[scope] = true;
  });

  return permissions.some((permission) => scopesMap[permission]);
};

export default function PermissionsGate({ children, scopes = [] }) {
  // const role = useGetRole();
  // const { user } = isAuthenticated();
  const permissions = PERMISSIONS[ROLES.owner];
  // console.log(role);
  // console.log(user.role);

  const permissionGranted = hasPermission({ permissions, scopes });
  // console.log(permissionGranted);
  if (!permissionGranted) return <></>;

  return <>{children}</>;
}

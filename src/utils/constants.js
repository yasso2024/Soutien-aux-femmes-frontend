import { ROLES } from "./roles";

export const CLIENT_HOME_BY_ROLE = {
  [ROLES.FEMME]: "/femme/dashboard",
  [ROLES.BENEVOLE]: "/benevole/dashboard",
  [ROLES.ASSOCIATION]: "/association/dashboard",
  [ROLES.DONATEUR]: "/donateur/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
};
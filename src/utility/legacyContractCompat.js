// LEGACY_COMPAT_START
// Remove this module and its imports after the field backend is upgraded to the
// current tenant-scoped contracts.
// Maintenance rule:
// 1. New features and behavior changes must be implemented in the current contract path.
// 2. Legacy compatibility code only exists for temporary field-backend support.
// 3. Do not expand legacy behavior unless the task is explicitly about old-contract support.

export const LEGACY_HUB_REGISTRATION_MODE = {
  AUTO: "auto",
  CURRENT: "current",
  LEGACY: "legacy",
};

export const isHubMethodMissingError = (error) => {
  const message = error?.message || "";
  return message.includes("Method does not exist");
};

export const isHttpNotFoundError = (error) => {
  const status = error?.response?.status ?? error?.status;
  return status === 404;
};

// LEGACY_COMPAT_END

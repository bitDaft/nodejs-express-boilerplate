// # Helpers
export const basicUser = (user) => {
  const { email, name, role_id, role, additional_information } = user;
  return { name, email };
};
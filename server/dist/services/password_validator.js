export const isStrongPassword = password => {
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=(){}\[\]])[A-Za-z\d@$!%*?&#^+=(){}\[\]]{8,}$/;
  return PASSWORD_REGEX.test(password);
};
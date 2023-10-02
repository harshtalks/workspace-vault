export const isStrongSecretKey = (key: string) => {
  // Check if the password meets all the criteria
  return (
    /[a-z]/.test(key) && /[A-Z]/.test(key) && /\d/.test(key) && key.length >= 12
  );
};

import * as bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const checkHashPassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashPassword);
  return isMatch;
};

export { hashPassword, checkHashPassword };

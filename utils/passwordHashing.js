import bcrypt from 'bcryptjs';

// Hash the password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // generate salt with 10 rounds
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

export default hashPassword;

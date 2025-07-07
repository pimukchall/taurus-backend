// A collection of reusable validation error messages.
const errorMessages = Object.freeze({
  missingFields: "กรุณากรอกข้อมูลให้ครบถ้วน",
  invalidEmail: "อีเมลไม่ถูกต้อง",
  emailTooLong: "อีเมลต้องไม่เกิน 256 ตัวอักษร",
  invalidUsername: "ชื่อผู้ใช้ต้องมี 3-20 ตัวอักษรและสามารถใช้ a-z, A-Z, 0-9 และ _ ได้",
  passwordTooShort: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
  passwordsDoNotMatch: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
  missingEmail: "กรุณากรอกอีเมล",
  missingPasswords: "กรุณากรอกรหัสผ่านและยืนยันรหัสผ่าน",
});

const validateEmail = (email) => {
  if (!email) return errorMessages.missingEmail;
  if (email.length > 256) return errorMessages.emailTooLong;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return errorMessages.invalidEmail;
  return null;
};

const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) return errorMessages.invalidUsername;
  return null;
};

const validatePassword = (password) => {
  if (!password || password.length < 6) return errorMessages.passwordTooShort;
  return null;
};

// --- Input Validation Functions ---

const validateRegisterInput = ({ username, email, password }) => {
  if (!username || !email || !password) {
    return errorMessages.missingFields;
  }
  return validateUsername(username) || validateEmail(email) || validatePassword(password);
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return errorMessages.missingFields;
  }
  return validateEmail(email) || validatePassword(password);
};

const validateForgotPasswordInput = ({ email }) => {
  return validateEmail(email);
};

const validateResetPasswordInput = ({ password, confirmPassword }) => {
  if (!password || !confirmPassword) {
    return errorMessages.missingPasswords;
  }
  const passwordError = validatePassword(password);
  if (passwordError) return passwordError;
  if (password !== confirmPassword) return errorMessages.passwordsDoNotMatch;
  return null;
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
  errorMessages, // Export error messages for use in other modules
};
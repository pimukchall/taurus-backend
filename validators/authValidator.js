const validateRegisterInput = ({ username, email, password }) => {
  if (!username || !email || !password ) {
    return "กรุณากรอกข้อมูลให้ครบถ้วน";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "อีเมลไม่ถูกต้อง";

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) return "ชื่อผู้ใช้ต้องมี 3-20 ตัวอักษรและสามารถใช้ตัวอักษร a-z, A-Z, 0-9 และ _ ได้";

  if (password.length < 6) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  if (email.length > 256) return "อีเมลต้องไม่เกิน 256 ตัวอักษร";

  return null;
};

module.exports = { validateRegisterInput };

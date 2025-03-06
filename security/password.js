import config from "@/config";
import bcrypt from "bcryptjs";

export const hashingOTP = async (otp) => {
  try {
    const salt = await bcrypt.genSalt(parseInt(config.SALT_ROUNDS));
    const hash = await bcrypt.hash(otp, salt);

    return { status: true, hash, salt };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
};
export const compareOTP = async (plainOtp, hashedOtp) => {
  try {
     
      if (!plainOtp || !hashedOtp) {
          console.error('Invalid inputs for OTP comparison:', { 
              hasPlainOtp: !!plainOtp, 
              hasHashedOtp: !!hashedOtp 
          });
          return { status: false };
      }

      const compareStatus = await bcrypt.compare(plainOtp, hashedOtp);
      return { status: compareStatus };
  } catch (error) {
      console.error('Error comparing OTP:', error);
      return { status: false };
  }
};

export const comparePassword = async (password, hash) => {
  try {
    const compareStatus = await bcrypt.compare(password, hash);
    return { status: compareStatus };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
};

export function generateInviteCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


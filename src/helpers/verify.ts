import { resend } from "@/lib/resend";
import VVerify from "@/mail/verify";
import { resAPI } from "@/types/res.API";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function verify(
  email: string,
  username: string,
  otp: string
): Promise<resAPI> {
  if (!isValidEmail(email)) {
    return {
      success: false,
      message: "enter valid email",
      error: 'Invalid email format',
    };
  }

  try {
    const res = await resend.emails.send({
      from: "Prashant <prashant0kumar101@gmail.com>",
      to: `${username} <${email}>`,
      subject: "Verify your email",
      react: VVerify({ username, otp }),
    });

    console.log("Email sent successfully", res);
    return {
      success: true,
      message: "Email sent successfully",
      error: res.error?.message || null,
    };
  } catch (err) {
    const error = err as resAPI;
    const message = error.message || "Failed to fetch toggle";
    console.error("Error sending email", error);
    return {
      success: false,
      message: message,
      error: error.message || null,
    };
  }
}

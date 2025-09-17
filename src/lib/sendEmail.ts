import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("key", resend);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "naeemmahmud370@gmail.com",
      subject,
      html,
    });
    console.log("Resend result:", result);
    return result;
  } catch (err) {
    console.error("Resend send error:", err);
    throw err;
  }
}

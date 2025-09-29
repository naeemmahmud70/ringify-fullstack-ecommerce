import { Resend } from "resend";
import { sendEmail } from "./sendEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(orderPayload: any) {
  const { user, paid, free, quantity, price, address } = orderPayload;

  const hasFreeRings = free && free.length > 0;

  const htmlContent = `
    <h2>New Order Received 🎉</h2>
    <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
    <p><strong>Quantity:</strong> ${quantity} rings</p>
    <p><strong>Total:</strong> ${price} BDT</p>
    <p><strong>Shipping Address:</strong><br/>${address}</p>

    <p><strong>${hasFreeRings ? "Paid Rings" : "Rings"}:</strong></p>
    <ul>
      ${paid
        .map(
          (r: any) => `<li>Size ${r.size} (${r.quantity}x) – ${r.color}</li>`
        )
        .join("")}
    </ul>

    ${
      hasFreeRings
        ? `<p><strong>Free Rings:</strong></p>
           <ul>
             ${free
               .map(
                 (r: any) =>
                   `<li>Size ${r.size} (${r.quantity}x) – ${r.color}</li>`
               )
               .join("")}
           </ul>`
        : ""
    }

    <p>✅ Please process this order in the system.</p>
  `;

  try {
    await sendEmail(
      user.email,
      `🛒 New Order Received – ${user.name} placed an order`,
      htmlContent
    );
    console.log("Admin notification email sent!");
  } catch (error) {
    console.error("Admin email sending failed:", error);
  }
}

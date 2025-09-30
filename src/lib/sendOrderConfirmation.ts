import { Resend } from "resend";
import { sendEmail } from "./sendEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(orderPayload: any) {
  const { user, paid, free, quantity, price, address } = orderPayload;

  const hasFreeRings = free && free.length > 0;

  const htmlContent = `
    <h2>Hi ${user.name},</h2>
    <p>Thank you for your order! 🎉</p>
    <p><strong>Order Summary</strong></p>
    <ul>
      <li><b>Quantity:</b> ${quantity} rings</li>
      <li><b>Total:</b> ${price} USD</li>
    </ul>
    <p><strong>Shipping Address:</strong><br/>${address}</p>

    <p><strong>${hasFreeRings ? "Paid Rings" : "Your Rings"}:</strong></p>
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

    <p>We’ll notify you once your order has been shipped 🚚.</p>
    <p>Thank you for shopping with us ❤️</p>
    <p>- Ringify Team</p>
  `;

  try {
    await sendEmail(
      user.email,
      `🛒 New Order Received – ${user.name} placed an order`,
      htmlContent
    );
    console.log("Order confirmation email sent!");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}

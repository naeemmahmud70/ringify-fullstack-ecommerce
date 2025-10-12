import * as React from "react";

interface OtpEmailProps {
  otp: string;
  expiryMin: number;
  appName: string;
  supportEmail: string;
}

export default function OtpEmail({
  otp,
  expiryMin,
  appName,
  supportEmail,
}: OtpEmailProps) {
  return (
    <html>
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          background: "#f4f6f8",
          padding: "24px",
        }}
      >
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td align="center">
              <table
                width="600"
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  padding: "28px",
                }}
              >
                <tr>
                  <td>
                    <h1
                      style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}
                    >
                      {appName}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingTop: "20px" }}>
                    <p>Hi there,</p>
                    <p>
                      Use the one-time passcode (OTP) below to verify your email
                      address. This code is valid for <b>{expiryMin} minutes</b>
                      .
                    </p>
                    <div
                      style={{
                        background: "#0f172a",
                        color: "#fff",
                        fontSize: "22px",
                        padding: "16px",
                        borderRadius: "8px",
                        textAlign: "center",
                        letterSpacing: "2px",
                      }}
                    >
                      {otp}
                    </div>
                    <p style={{ marginTop: "24px", fontSize: "14px" }}>
                      If you didn’t request this code, you can ignore this
                      email.
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      Need help? Contact us at{" "}
                      <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}

import nodemailer from "nodemailer";

export async function sendThankYouEmail(orderData: any) {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  // If credentials are not set, skip sending email to customer
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log("Skipping customer thank-you email: EMAIL_USER and EMAIL_PASS not configured in .env.local");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const hasCustomText = orderData.topText || orderData.insideText;
    const customTextSummary = hasCustomText
      ? `\n- Lid Message: "${orderData.topText || 'None'}"\n- Inside Message: "${orderData.insideText || 'None'}"`
      : "";

    const mailOptions = {
      from: `"box.love.pk" <${EMAIL_USER}>`,
      to: orderData.email,
      subject: `Thanks for shopping from box.love.pk! ❤️`,
      text: `Hi ${orderData.name},\n\n` +
            `Thank you so much for shopping from us! We are absolutely thrilled to handcraft your customized gift box.\n\n` +
            `Knowing that you chose box.love.pk to share love with your special someone means the world to our small handmade business. Every single box is crafted with extra care and love, just for you.\n\n` +
            `Here is a quick summary of your order:\n` +
            `- Box Type: ${orderData.boxType}\n` +
            `- Ink Color: ${orderData.inkColor || "N/A"}${customTextSummary}\n` +
            `- Addons: ${orderData.addons}\n` +
            `- Total Amount: Rs. ${orderData.total}\n\n` +
            `Payment & Confirmation Instructions:\n` +
            `1. Please send the advance payment of Rs. ${orderData.total} to our JazzCash account:\n` +
            `   - Number: 0300-6600178\n` +
            `   - Account Name: NAZI YAQOOB\n` +
            `2. Take a screenshot of the transaction receipt.\n` +
            `3. Send the screenshot to our Instagram DM (@box.love.pk) to verify and confirm your order!\n\n` +
            `We really hope you love our box as much as we loved making it for you. We would be so happy to design for you again, so please shop with us again in the future! 😊\n\n` +
            `With love,\n` +
            `The box.love.pk Team\n` +
            `Faisalabad, Pakistan`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ffeef2; border-radius: 16px; background-color: #ffffff; color: #3d202c;">
          <div style="text-align: center; border-bottom: 2px solid #ffd6e3; padding-bottom: 15px;">
            <h1 style="color: #e03e6d; margin: 0; font-size: 28px; font-family: cursive;">box.love.pk</h1>
            <p style="color: #854e62; margin: 5px 0 0 0; font-size: 14px; font-weight: bold; letter-spacing: 1px;">MADE WITH LOVE</p>
          </div>
          
          <div style="padding: 25px 0;">
            <p style="font-size: 16px; line-height: 1.6;">Hi <strong>${orderData.name}</strong>,</p>
            
            <p style="font-size: 16px; line-height: 1.6;">Thank you so much for shopping from us! We are absolutely thrilled to handcraft your gift box. ❤️</p>
            
            <p style="font-size: 15px; line-height: 1.6; color: #522a3b; background-color: #fff9fa; padding: 15px; border-left: 4px solid #e03e6d; border-radius: 4px; margin: 20px 0;">
              Knowing that you chose <strong>box.love.pk</strong> to share love with your special someone means the world to our small handmade business. Every single box is crafted with extra care and love, just for you.
            </p>
            
            <h3 style="color: #e03e6d; margin-top: 25px; border-bottom: 1px solid #ffd6e3; padding-bottom: 5px;">Your Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 15px 0;">
              <tr style="border-bottom: 1px solid #fff0f4;">
                <td style="padding: 8px 0; font-weight: bold; color: #854e62; width: 140px;">Box Type:</td>
                <td style="padding: 8px 0; color: #3d202c;">${orderData.boxType}</td>
              </tr>
              ${orderData.inkColor && orderData.inkColor !== "N/A" ? `
              <tr style="border-bottom: 1px solid #fff0f4;">
                <td style="padding: 8px 0; font-weight: bold; color: #854e62;">Ink Color:</td>
                <td style="padding: 8px 0; color: #3d202c;">${orderData.inkColor}</td>
              </tr>
              ` : ''}
              ${orderData.topText ? `
              <tr style="border-bottom: 1px solid #fff0f4;">
                <td style="padding: 8px 0; font-weight: bold; color: #854e62; vertical-align: top;">Lid Message:</td>
                <td style="padding: 8px 0; color: #3d202c; font-style: italic; white-space: pre-wrap;">"${orderData.topText}"</td>
              </tr>
              ` : ''}
              ${orderData.insideText ? `
              <tr style="border-bottom: 1px solid #fff0f4;">
                <td style="padding: 8px 0; font-weight: bold; color: #854e62; vertical-align: top;">Inside Message:</td>
                <td style="padding: 8px 0; color: #3d202c; font-style: italic; white-space: pre-wrap;">"${orderData.insideText}"</td>
              </tr>
              ` : ''}
              <tr style="border-bottom: 1px solid #fff0f4;">
                <td style="padding: 8px 0; font-weight: bold; color: #854e62;">Add-ons:</td>
                <td style="padding: 8px 0; color: #3d202c;">${orderData.addons}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0 8px 0; font-weight: bold; color: #e03e6d; font-size: 16px;">Total Amount:</td>
                <td style="padding: 12px 0 8px 0; color: #e03e6d; font-weight: bold; font-size: 18px;">Rs. ${orderData.total}</td>
              </tr>
            </table>

            <div style="background-color: #fff3f6; border: 1px dashed #ffaec7; border-radius: 12px; padding: 18px; margin: 25px 0; text-align: center;">
              <h4 style="color: #b5224d; margin: 0 0 10px 0; font-size: 15px; font-weight: bold;">💸 Payment Instructions</h4>
              <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #522a3b;">
                Please make the advance payment of <strong>Rs. ${orderData.total}</strong> to our JazzCash account:<br/>
                <span style="font-size: 18px; font-weight: bold; color: #b5224d; display: inline-block; margin: 8px 0;">0300-6600178</span><br/>
                Account Name: <strong>NAZI YAQOOB</strong>
              </p>
              
              <div style="background-color: #ffffff; border: 1px solid #ffd6e3; border-radius: 8px; padding: 10px; margin-top: 15px; text-align: left;">
                <p style="font-size: 13px; line-height: 1.5; margin: 0; color: #e03e6d; font-weight: bold; text-align: center;">📸 How to Confirm Your Order:</p>
                <ol style="font-size: 12.5px; line-height: 1.6; margin: 8px 0 0 15px; padding: 0; color: #522a3b;">
                  <li>Send the payment of Rs. ${orderData.total} to the JazzCash account above.</li>
                  <li>Take a screenshot of the transaction receipt.</li>
                  <li>Send the screenshot to our Instagram DM <a href="https://instagram.com/box.love.pk" style="color: #e03e6d; font-weight: bold; text-decoration: underline;" target="_blank">@box.love.pk</a> to verify and confirm your order!</li>
                </ol>
              </div>
            </div>
            
            <p style="font-size: 15px; line-height: 1.6; margin-top: 25px;">We really hope you love our box as much as we loved making it for you. We would be so happy to craft for you again, so please shop with us again in the future! 😊</p>
          </div>
          
          <div style="text-align: center; border-top: 1px solid #ffd6e3; padding-top: 20px; font-size: 12px; color: #b07d93;">
            <p style="margin: 0 0 5px 0;">With love and care,</p>
            <p style="font-weight: bold; color: #854e62; margin: 0 0 10px 0; font-size: 14px;">The box.love.pk Team</p>
            <p style="margin: 0; font-style: italic;">Faisalabad, Pakistan</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Customer thank-you email sent successfully to:", orderData.email);
  } catch (err) {
    console.error("Failed to send customer thank-you email:", err);
  }
}

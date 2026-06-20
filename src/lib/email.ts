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
      subject: `Thank you for your order! ❤️ — box.love.pk`,
      text: `Hi ${orderData.name},\n\n` +
            `I hope you are doing well! This is Hadia from box.love.pk.\n\n` +
            `Thank you so much for choosing my small shop to craft a customized gift box for your special someone. I am already excited to handmake it with love for you! ❤️\n\n` +
            `Here is a quick summary of what you ordered:\n` +
            `- Box Type: ${orderData.boxType}\n` +
            `- Ink Color: ${orderData.inkColor || "N/A"}${customTextSummary}\n` +
            `- Addons: ${orderData.addons}\n` +
            `- Total Price: Rs. ${orderData.total}\n\n` +
            `To verify and confirm your order, please follow these steps:\n` +
            `1. Send the advance payment of Rs. ${orderData.total} to my JazzCash account:\n` +
            `   - Number: 0300-6600178\n` +
            `   - Account Name: NAZI YAQOOB\n` +
            `2. Take a screenshot of the transaction receipt.\n` +
            `3. Send the screenshot to my Instagram DM (@box.love.pk) so I can verify and start crafting your box right away!\n\n` +
            `Thank you again for supporting my small handmade business. I really hope you love the box as much as I will love making it for you. I would be so happy to design for you again, so please shop with us again in the future! 😊\n\n` +
            `With love,\n` +
            `The box.love.pk Team`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; line-height: 1.6; color: #3d202c; font-size: 15px;">
          <p>Hi <strong>${orderData.name}</strong>,</p>
          
          <p>I hope you are doing well! This is Hadia from <strong>box.love.pk</strong>.</p>
          
          <p>Thank you so much for choosing my small shop to craft a customized gift box for your special someone. I am already excited to handmake it with love for you! ❤️</p>
          
          <p>Here is a quick summary of what you ordered:</p>
          <ul style="padding-left: 20px; color: #522a3b;">
            <li><strong>Box Type:</strong> ${orderData.boxType}</li>
            ${orderData.inkColor && orderData.inkColor !== "N/A" ? `<li><strong>Ink Color:</strong> ${orderData.inkColor}</li>` : ''}
            ${orderData.topText ? `<li><strong>Lid Message:</strong> "${orderData.topText}"</li>` : ''}
            ${orderData.insideText ? `<li><strong>Inside Message:</strong> "${orderData.insideText}"</li>` : ''}
            <li><strong>Add-ons:</strong> ${orderData.addons}</li>
            <li><strong>Total Amount:</strong> Rs. ${orderData.total}</li>
          </ul>
          
          <p>To verify and confirm your order, please follow these steps:</p>
          <ol style="padding-left: 20px; color: #522a3b;">
            <li>Send the advance payment of <strong>Rs. ${orderData.total}</strong> to my JazzCash account:<br/>
                <strong>Number:</strong> 0300-6600178<br/>
                <strong>Account Name:</strong> NAZI YAQOOB</li>
            <li>Take a screenshot of the transaction receipt.</li>
            <li>Send the screenshot to my Instagram DM <a href="https://instagram.com/box.love.pk" style="color: #e03e6d; font-weight: bold; text-decoration: underline;" target="_blank">@box.love.pk</a> so I can verify and start crafting your box right away!</li>
          </ol>
          
          <p>Thank you again for supporting my small handmade business. I really hope you love the box as much as I will love making it for you. I would be so happy to design for you again, so please shop with us again in the future! 😊</p>
          
          <p style="margin-top: 30px; border-top: 1px solid #ffd6e3; padding-top: 15px; font-size: 14px; color: #854e62;">
            With love and care,<br/>
            <strong>The box.love.pk Team</strong><br/>
            Faisalabad, Pakistan
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Customer thank-you email sent successfully to:", orderData.email);
  } catch (err) {
    console.error("Failed to send customer thank-you email:", err);
  }
}

export async function sendNewOrderAlertToAdmin(orderData: any) {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
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
      from: `"box.love.pk Store Alert" <${EMAIL_USER}>`,
      to: EMAIL_USER, // Send to yourself
      subject: `🚨 NEW ORDER RECEIVED - Rs. ${orderData.total} from ${orderData.name}`,
      text: `You have received a new order on box.love.pk!\n\n` +
            `Customer Details:\n` +
            `- Name: ${orderData.name}\n` +
            `- Email: ${orderData.email}\n` +
            `- Phone: ${orderData.phone}\n` +
            `- Shipping Address: ${orderData.address}\n\n` +
            `Order Details:\n` +
            `- Box Type: ${orderData.boxType}\n` +
            `- Ink Color: ${orderData.inkColor || "N/A"}${customTextSummary}\n` +
            `- Addons: ${orderData.addons}\n` +
            `- Total Price: Rs. ${orderData.total}\n\n` +
            `Open the Admin Dashboard to manage this order: https://box-love-pk.vercel.app/admin`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #b5224d; border-radius: 12px; background-color: #fff9fa; color: #3d202c;">
          <h2 style="color: #b5224d; border-bottom: 2px solid #ffd6e3; padding-bottom: 10px; margin-top: 0; text-align: center;">
            🚨 New Order Alert!
          </h2>
          
          <p style="font-size: 15px;">You have received a new order on <strong>box.love.pk</strong>. Here are the details:</p>
          
          <h3 style="color: #e03e6d; margin-top: 20px; border-bottom: 1px solid #ffd6e3; padding-bottom: 5px;">Customer Info</h3>
          <p style="font-size: 14px; line-height: 1.5; margin: 5px 0;">
            <strong>Name:</strong> ${orderData.name}<br/>
            <strong>Phone:</strong> <a href="tel:${orderData.phone}">${orderData.phone}</a><br/>
            <strong>Email:</strong> <a href="mailto:${orderData.email}">${orderData.email}</a><br/>
            <strong>Address:</strong> ${orderData.address}
          </p>

          <h3 style="color: #e03e6d; margin-top: 20px; border-bottom: 1px solid #ffd6e3; padding-bottom: 5px;">Order Specifications</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 10px 0;">
            <tr style="border-bottom: 1px solid #fff0f4;"><td style="padding: 6px 0; font-weight: bold; width: 120px;">Box Type:</td><td style="padding: 6px 0;">${orderData.boxType}</td></tr>
            <tr style="border-bottom: 1px solid #fff0f4;"><td style="padding: 6px 0; font-weight: bold;">Ink Color:</td><td style="padding: 6px 0;">${orderData.inkColor}</td></tr>
            ${orderData.topText ? `<tr style="border-bottom: 1px solid #fff0f4;"><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Lid Message:</td><td style="padding: 6px 0; font-style: italic; white-space: pre-wrap;">"${orderData.topText}"</td></tr>` : ''}
            ${orderData.insideText ? `<tr style="border-bottom: 1px solid #fff0f4;"><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Inside Message:</td><td style="padding: 6px 0; font-style: italic; white-space: pre-wrap;">"${orderData.insideText}"</td></tr>` : ''}
            <tr style="border-bottom: 1px solid #fff0f4;"><td style="padding: 6px 0; font-weight: bold;">Add-ons:</td><td style="padding: 6px 0;">${orderData.addons}</td></tr>
            <tr><td style="padding: 10px 0 0 0; font-weight: bold; color: #b5224d; font-size: 16px;">Total Price:</td><td style="padding: 10px 0 0 0; color: #b5224d; font-weight: bold; font-size: 16px;">Rs. ${orderData.total}</td></tr>
          </table>

          <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #ffd6e3;">
            <a href="https://box-love-pk.vercel.app/admin" style="display: inline-block; padding: 10px 20px; background-color: #b5224d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Open Admin Dashboard
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Admin new order alert email sent successfully to:", EMAIL_USER);
  } catch (err) {
    console.error("Failed to send admin new order alert email:", err);
  }
}


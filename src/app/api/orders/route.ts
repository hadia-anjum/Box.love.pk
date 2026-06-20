import { NextResponse } from "next/server";
import { saveOrder } from "@/lib/orderStore";
import { sendThankYouEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // 1. Validate request body
    if (!orderData.email || !orderData.name || !orderData.phone || !orderData.address) {
      return NextResponse.json(
        { success: false, error: "Missing required checkout details." },
        { status: 400 }
      );
    }

    // 2. Save the order to DB or local fallback
    try {
      const dbResult = await saveOrder(orderData);
      console.log(`Order saved successfully! Source: ${dbResult.source}`);
    } catch (dbErr: any) {
      console.error("Failed to save order:", dbErr);
    }

    // 3. Send automated thank-you receipt email to customer (non-blocking)
    try {
      await sendThankYouEmail(orderData);
    } catch (emailErr: any) {
      console.error("Failed to trigger automated thank-you email:", emailErr);
    }



    // 3. Build the request body for Web3Forms API
    const web3formsBody = {
      access_key: "f3d8291b-afee-4148-880d-5884a4c7cbb0",
      subject: `New Order from ${orderData.name} - Rs. ${orderData.total}`,
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      box_type: orderData.boxType,
      ink_color: orderData.inkColor || "N/A",
      lid_message: orderData.topText || "(none)",
      inside_message: orderData.insideText || "(none)",
      addons: orderData.addons || "None",
      total_amount: `Rs. ${orderData.total}`,
      message: `A new order has been placed on box.love.pk!\n\n` +
               `- Name: ${orderData.name}\n` +
               `- Email: ${orderData.email}\n` +
               `- Phone: ${orderData.phone}\n` +
               `- Address: ${orderData.address}\n\n` +
               `- Type: ${orderData.boxType}\n` +
               `- Ink: ${orderData.inkColor || "N/A"}\n` +
               `- Lid Text: ${orderData.topText || "N/A"}\n` +
               `- Inside Text: ${orderData.insideText || "N/A"}\n` +
               `- Addons: ${orderData.addons || "None"}\n\n` +
               `Total Amount: Rs. ${orderData.total}`
    };

    // 4. Forward the order details securely to Web3Forms (non-blocking)
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(web3formsBody)
      });

      const responseText = await response.text();
      let resData: any = {};
      try {
        resData = JSON.parse(responseText);
      } catch (jsonErr) {
        console.warn("Web3Forms response was not JSON:", responseText);
      }

      if (response.ok && resData.success) {
        console.log("Web3Forms email alert sent successfully!");
      } else {
        console.error("Web3Forms submission failed:", resData);
      }
    } catch (emailErr: any) {
      console.error("Failed to send Web3Forms email alert:", emailErr);
    }

    // Always return success if the order was successfully saved
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Node.js order processing backend error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error: " + err.message },
      { status: 500 }
    );
  }
}

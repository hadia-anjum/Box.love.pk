import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

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

    // 2. Connect to MongoDB and save the order
    try {
      await dbConnect();
      await Order.create({
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        boxType: orderData.boxType,
        inkColor: orderData.inkColor,
        topText: orderData.topText || "",
        insideText: orderData.insideText || "",
        addons: orderData.addons || "None",
        total: orderData.total,
        status: "pending",
      });
      console.log("Order saved to MongoDB successfully!");
    } catch (dbErr: any) {
      console.error("Failed to save order to MongoDB:", dbErr);
      // We will still try to send the email notification even if DB saving fails
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

    // 4. Forward the order details securely to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(web3formsBody)
    });

    const resData = await response.json();

    if (response.ok && resData.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error("Web3Forms submission failed:", resData);
      // If we saved to DB but email failed, we still return success to the user so their order is recorded
      return NextResponse.json({ success: true, warning: "Email delivery failed, but order saved." });
    }
  } catch (err: any) {
    console.error("Node.js order processing backend error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error: " + err.message },
      { status: 500 }
    );
  }
}

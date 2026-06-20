import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get("passcode");

    const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "1234";

    if (!passcode || passcode !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Invalid passcode." },
        { status: 403 }
      );
    }

    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error("Admin orders backend error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error: " + err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get("passcode");

    const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "1234";

    if (!passcode || passcode !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Invalid passcode." },
        { status: 403 }
      );
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: orderId and status." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "shipped", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    await dbConnect();
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error("Admin orders PATCH backend error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error: " + err.message },
      { status: 500 }
    );
  }
}


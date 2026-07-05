import { NextResponse } from "next/server";

export function healthController() {
  return NextResponse.json({
    success: true,
    message: "Backend Running",
  });
}

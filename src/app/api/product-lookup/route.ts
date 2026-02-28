import { NextRequest, NextResponse } from "next/server";
import { lookupBarcode } from "@/lib/open-food-facts";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const barcode = new URL(request.url).searchParams.get("barcode");
  if (!barcode) {
    return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
  }

  const result = await lookupBarcode(barcode);
  return NextResponse.json(result);
}

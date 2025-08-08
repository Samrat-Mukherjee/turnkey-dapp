// app/api/faucet/route.ts
import { NextRequest, NextResponse } from "next/server";
import test from "node:test";

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  const apiKey = process.env.CHAINSTACK_API_KEY;


  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: "Invalid or missing address" },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const response = await fetch("https://api.chainstack.com/v1/faucet/amoy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  });

  const text = await response.text();

  try {
    const data = JSON.parse(text); // Try to parse JSON manually
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || data },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: text }, { status: 500 });
  }
}

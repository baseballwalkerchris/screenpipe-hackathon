import { NextResponse } from "next/server";
import sendEmail from "@/lib/actions/send-email";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(process.cwd(), "public", "uploads", file.name);

  fs.writeFileSync(filePath, buffer);

  console.log("File saved:", filePath);
  try {
    await(sendEmail(
        "danielwong0505@gmail.com",
        "test",
        "Testing emailing a video",
        filePath
      ))
  } catch(e) {
    console.log("Failed to send email: " + e)
  }
  return NextResponse.json({ success: true, filePath });
}

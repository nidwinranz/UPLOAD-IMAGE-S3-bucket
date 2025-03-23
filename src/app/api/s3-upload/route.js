import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(fileBuffer, fileName, contentType) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `uploads/${fileName}`,  // Folder path in the bucket
    Body: fileBuffer,
    ContentType: contentType || "application/octet-stream",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);  // Upload the file to S3
  return fileName;
}
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type;
    const fileName = await uploadFileToS3(buffer, file.name, contentType);

    const s3BaseUrl = process.env.AWS_S3_BASE_URL;
    const imageUrl = `${s3BaseUrl}/uploads/${fileName}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error.stack || error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file, fileName, contentType) {
  const fileBuffer = file;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `uploads/${fileName}`,  // Uploading the file to "uploads/" folder in the bucket
    Body: fileBuffer,
    ContentType: contentType || "application/octet-stream",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);  // Uploads the file to S3
  return fileName;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());  // Convert file to buffer
    const contentType = file.type;  // Get the file's content type (e.g., image/png)
    const fileName = await uploadFileToS3(buffer, file.name, contentType);  // Upload to S3

    // Construct the S3 image URL using the bucket URL and file path
    const s3BaseUrl = process.env.AWS_S3_BASE_URL;
    const imageUrl = `${s3BaseUrl}/uploads/${fileName}`;

    // Return the full image URL to the client
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

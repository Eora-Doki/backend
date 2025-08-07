import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../lib/s3"
import path from "path"

const streamToBuffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks)
}

const uploadToS3 = async (
    fileStream: NodeJS.ReadableStream,
    fileName: string,
    fileType: string
): Promise<string> => {
    const ext = path.extname(fileName)
    const fileKey = `${Date.now()}_${Math.random().toString(36).substring(2)}${ext}`
    const bucketName = process.env.AWS_S3_BUCKET_NAME

    const fileBuffer = await streamToBuffer(fileStream)

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: fileType,
        ContentLength: fileBuffer.length
    })

    await s3.send(command)

    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
}

export { 
    uploadToS3 
}

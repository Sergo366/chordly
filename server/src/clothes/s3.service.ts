import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId =
      this.configService.get<string>('R2_ACCESS_KEY_ID') ||
      this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey =
      this.configService.get<string>('R2_SECRET_ACCESS_KEY') ||
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const endpoint = this.configService.get<string>('R2_ENDPOINT');
    const region = this.configService.get<string>('AWS_REGION') || 'auto';

    this.bucketName =
      this.configService.get<string>('R2_BUCKET_NAME') ||
      this.configService.get<string>('AWS_S3_BUCKET') ||
      'fitly-wardrobe';

    this.s3Client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      credentials:
        accessKeyId && secretAccessKey
          ? { accessKeyId, secretAccessKey }
          : undefined,
    });
  }

  async getPresignedUploadUrl(
    filename: string,
    contentType: string,
    userId: string,
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    try {
      const ext = path.extname(filename);
      const uuid = crypto.randomUUID();
      const safeFilename = `${uuid}${ext}`;
      const key = `uploads/${userId}/${safeFilename}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      // Presigned URL expires in 300 seconds (5 minutes)
      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 300,
      });

      // Construct public URL
      let fileUrl = '';
      const customEndpoint = this.configService.get<string>('R2_ENDPOINT');
      if (customEndpoint) {
        const publicUrl =
          this.configService.get<string>('R2_PUBLIC_URL') ||
          this.configService.get<string>('S3_PUBLIC_URL');
        if (publicUrl) {
          fileUrl = `${publicUrl}/${key}`;
        } else {
          // If R2_ENDPOINT is e.g. https://<accountid>.r2.cloudflarestorage.com
          // construct a custom URL format or fallback to endpoint/bucketName/key
          fileUrl = `${customEndpoint}/${this.bucketName}/${key}`;
        }
      } else {
        // Standard AWS S3 public URL
        const awsRegion =
          this.configService.get<string>('AWS_REGION') || 'us-east-1';
        fileUrl = `https://${this.bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
      }

      return {
        uploadUrl,
        fileUrl,
      };
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('Error generating pre-signed URL:', error);
      throw new InternalServerErrorException(
        `Failed to generate upload URL: ${errMsg}`,
      );
    }
  }
}

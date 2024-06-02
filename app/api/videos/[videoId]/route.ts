import { Client } from 'minio';
import { NextRequest, NextResponse } from 'next/server';
import { readEnvVar }  from '@/lib/utils';

let minioClient: Client | null = null;
let bucket: string | null = null;
if (!process.env.DISABLE_DB_CONNECTION) {
  minioClient = new Client({
    endPoint: readEnvVar('MINIO_ENDPOINT'),
    port: parseInt(readEnvVar('MINIO_PORT'), 10),
    useSSL: readEnvVar('MINIO_USE_SSL') === 'true',
    accessKey: readEnvVar('MINIO_ACCESS_KEY'),
    secretKey: readEnvVar('MINIO_SECRET_KEY'),
  });

  bucket = readEnvVar('MINIO_BUCKET');
}


export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const encodedVideoId = params.videoId;
  const videoId = decodeURIComponent(encodedVideoId);

  if (!minioClient || !bucket) {
    console.error('MinIO client or bucket was null');
    return NextResponse.json({ error: 'Error streaming video' }, { status: 500 });
  }

  try {
    const objectInfo = await minioClient.statObject(bucket, videoId);
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : objectInfo.size - 1;
      const chunkSize = (end - start) + 1;

      const stream = await minioClient.getPartialObject(bucket, videoId, start, end);

      return new NextResponse(stream as unknown as ReadableStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${objectInfo.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    } else {
      const stream = await minioClient.getObject(bucket, videoId);

      return new NextResponse(stream as unknown as ReadableStream, {
        status: 200,
        headers: {
          'Content-Length': objectInfo.size.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    return NextResponse.json({ error: 'Error streaming video' }, { status: 500 });
  }
}
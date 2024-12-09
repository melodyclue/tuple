import { db } from '@/db';
import { profile } from '@/db/schema';
import { S3 } from '@/utils/r2.server';
import { createClient } from '@/utils/supabase/server';
import { uploadSchema } from '@/utils/validation';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { parseWithZod } from '@conform-to/zod';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();

  const submission = await parseWithZod(formData, {
    schema: uploadSchema,
    async: true,
  });

  if (submission.status !== 'success') {
    return NextResponse.json(
      { result: submission.reply(), ok: false, imageUrl: null },
      {
        status: submission.status === 'error' ? 400 : 200,
      },
    );
  }

  const { file } = submission.value;

  const key = `users/${user.id}/${file.name}`;
  const imageFileDataArrayBuffer = await file.arrayBuffer();
  const imageFileDataBuffer = Buffer.from(imageFileDataArrayBuffer);

  try {
    await S3.send(
      new PutObjectCommand({
        Body: imageFileDataBuffer,
        Bucket: process.env.CLOUDFLARE_R2_BUCKET,
        Key: key,
        ContentType: file.type,
      }),
    );
  } catch (error) {
    console.error('Failed to upload image to R2', error);
    return NextResponse.json(
      {
        result: submission.reply(),
        ok: false,
        imageUrl: null,
      },
      {
        status: 500,
      },
    );
  }

  const r2Url = `https://${process.env.CLOUDFLARE_R2_ASSETS_URL}/${key}`;

  await db
    .update(profile)
    .set({
      imageUrl: r2Url,
    })
    .where(eq(profile.id, user.id));

  revalidateTag('file-upload');

  return NextResponse.json(
    {
      result: submission.reply(),
      ok: true,
      imageUrl: r2Url,
    },
    {
      status: 200,
    },
  );
}

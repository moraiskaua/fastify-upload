import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Readable } from 'node:stream';
import { z } from 'zod';

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadImageInput = z.input<typeof uploadImageInput>;

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function uploadImage(input: UploadImageInput) {
  const { contentStream, contentType, fileName } =
    uploadImageInput.parse(input);

  if (!allowedMimeTypes.includes(contentType)) {
    throw new Error('Invalid file format.');
  }

  // TODO: Upload the image to a cloudflare R2

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: fileName,
    remoteUrl: fileName,
  });
}

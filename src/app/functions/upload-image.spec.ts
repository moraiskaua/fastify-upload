import { InvalidFileFormat } from '@/app/functions/errors/invalid-file-format';
import { uploadImage } from '@/app/functions/upload-image';
import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { isLeft, isRight, unwrapEither } from '@/shared/either';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { beforeAll, describe, expect, it, vi } from 'vitest';

describe('Upload Image', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: 'https://storage.com/image.jpg',
          };
        }),
      };
    });
  });

  it('it should be able to upload an image', async () => {
    const fileName = `${randomUUID()}.jpg`;

    const sut = await uploadImage({
      fileName,
      contentType: 'image/jpeg',
      contentStream: Readable.from([]),
    });

    expect(isRight(sut)).toBe(true);

    const result = await db
      .select()
      .from(schema.uploads)
      .where(eq(schema.uploads.name, fileName));

    expect(result).toHaveLength(1);
  });

  it('it should not be able to upload an invalid file', async () => {
    const sut = await uploadImage({
      fileName: `${randomUUID()}.pdf`,
      contentType: 'document/pdf',
      contentStream: Readable.from([]),
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat);
  });
});

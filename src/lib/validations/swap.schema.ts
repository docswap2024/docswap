import { z } from 'zod';

import { MESSAGES } from '@/config/messages';
import { ImageSchema } from '@/lib/validations/image.schema';

export const UploadSwapSchema = z.object({
  file: z.union([z.any(), ImageSchema]).optional(),
  address: z
    .string()
    .nonempty(MESSAGES.ADDRESS_IS_REQUIRED)
    .min(3, { message: MESSAGES.ADDRESS_TOO_SHORT }),
  tags: z
    .string()
    .nonempty(MESSAGES.TAG_IS_REQUIRED),
  description: z
    .string()
    .nonempty(MESSAGES.DESCRIPTION_IS_REQUIRED)
    .min(3, { message: MESSAGES.DESCRIPTION_TOO_SHORT }),
  onMarketplace: z
    .boolean(),
    price: z.optional(z.string().nullable()),
});

export type UploadSwapInput = z.infer<typeof UploadSwapSchema>;

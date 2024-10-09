
import { env } from '@/env.mjs';

export function getR2FileLink(fileName: string) {
    let fileUrl = fileName;
  
    if (
      fileName &&
      fileName?.startsWith('http') === false &&
      env.NEXT_PUBLIC_SHOP_URL
    ) {
      fileUrl = `${env.NEXT_PUBLIC_SHOP_URL}/${fileName}`;
    }
  
    return fileUrl;
}
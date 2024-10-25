'use server';

import { getCurrentUser } from '@/lib/utils/session';
import { MESSAGES } from '@/config/messages';
import { revalidateTag } from 'next/cache';
import { SwapService } from '../service';

export const uploadSwapDocument = async (inputs: any) => {
    const user = await getCurrentUser();
  
    if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
  
    const create: any = [];
    for (let i = 0; i < inputs.length; i++) {
      const input = {
        ...inputs[i],
        userId: user?.id,
        teamId: Boolean(user?.currentTeamId) ? user?.currentTeamId : null,
      };
      create.push(input);
    }
  
    const files = await SwapService.uploadSwapDocument(create);
    revalidateTag('get-swap');
    revalidateTag('get-all-swap');
    return files;
};

export async function getSwapDocuments() {
    const user = await getCurrentUser();
    if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
    const filesOptions = {
      userId: user?.id,
    };
    const files = await SwapService.getSwapDocuments(filesOptions);
    revalidateTag('get-swap');
    return files;
  }
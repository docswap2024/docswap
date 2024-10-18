'use server';

import { ShopSortType, SortOrderType } from '@/config/sorting';
import { ParcelsService } from '../service/parcels.service';
import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { handleServerError } from '@/lib/utils/error';

export async function getParcels(
    params: {
      size?: number;
      page?: number;
      search?: string;
      sort?: ShopSortType;
      order?: SortOrderType;
      type?: string;
    },
    options?: {
      excludeByType?: string;
      allFiles?: boolean;
    }
  ) {
    const filesOptions = {
      excludeByType: options?.excludeByType,
      allFiles: options?.allFiles,
    };
    const files = await ParcelsService.getParcels(params, filesOptions);
    revalidateTag('get-parcels');
    return files;
}

export async function getFolders(parentId: string, params: any) {
  const options = { allFiles:true, parentId:parentId };

  const folder = await ParcelsService.find(parentId);

  if (!folder) {
    notFound();
  }

  return await ParcelsService.getFolders(params, options);;
}

 
export const getAllFolders = async () => {
  const folders = await ParcelsService.getAll();
  revalidateTag('get-folders');
  return folders;
};

export async function getParcelById(id: string) {
  const file = await ParcelsService.getParcelById(id);
  return file;
}

export async function getParcelByFileName(fileName: string) {
  return await ParcelsService.getParcelByFileName(fileName);
}

export const makeParcelFavourite = async (fileId: string, flag: boolean, userId: string) => {
  try {
    console.log(fileId, flag, userId);
    const file = await ParcelsService.makeFavourite(fileId, flag, userId);
    revalidateTag('get-parcels');
    revalidateTag('get-all-parcels');
    return file;
  } catch (error) {
    return handleServerError(error);
  }
};
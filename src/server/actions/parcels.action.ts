import { FileSortType, SortOrderType } from '@/config/sorting';
import { ParcelsService } from '../service/parcels.service';
import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';


export async function getParcels(
    params: {
      size?: number;
      page?: number;
      search?: string;
      sort?: FileSortType;
      order?: SortOrderType;
      tag?: string;
      type?: string;
      isFavourite?: boolean;
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
  return await ParcelsService.getParcelById(id);
}
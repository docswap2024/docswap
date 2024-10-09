import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Parcel, CompleteBreadcrumbs } from '@/db/schema';
import { getAllFolders, getFolders} from '@/server/actions/parcels.action';
import { isCuid } from '@paralleldrive/cuid2';

import { FilesLayoutType } from '@/components/organisms/file-layout-switcher';
import { EcommerceShop } from '@/components/templates/ecommerce-shop';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: any;
}) {
  isCuid(params.id) || notFound();

  const { parcels, count, breadcrumbs } = await getFolders(params.id, {
    size: 50,
    ...searchParams,
  });
  const folders = await getAllFolders();

  const defaultLayout = cookies().get('files-layout')?.value ?? 'grid';

  return (
    <EcommerceShop
      parcels={parcels as Parcel[]}
      totalParcels={count}
      folders={folders as Parcel[]}
      breadcrumbs={breadcrumbs as CompleteBreadcrumbs[]}
      defaultLayout={defaultLayout as FilesLayoutType}
    />
  );
}

import { notFound } from 'next/navigation';
import { CompleteParcel } from '@/db/schema';
import { getParcelById } from '@/server/actions/parcels.action';

import { getCurrentUser } from '@/lib/utils/session';
import { EcommerceFileDetails } from '@/components/templates/ecommerce-file-details';
import { EcommerceFolderDetails } from '@/components/templates/ecommerce-folder-details';
import { getAllFolders, getFolders} from '@/server/actions/parcels.action';
import { isCuid } from '@paralleldrive/cuid2';
import { getCart} from '@/server/actions/cart.action';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const { file } = await getParcelById(params.id);
  let cart = await getCart(user?.id);

  console.log('file', file);
  
  let fileTree: any[] = [];
  
  if (!file) {
    throw notFound();
  }

  if (file.type === 'folder') {
    isCuid(params.id) || notFound();

    const getFileTree = async (parentId: string) => {
        const { parcels, count, breadcrumbs } = await getFolders(parentId, {});
        for (const parcel of parcels) {
          if (parcel.type === 'folder') {
            (parcel as any).children = await getFileTree(parcel.id);
          }
        }

        return parcels;
    };

    fileTree = await getFileTree(params.id);
    console.log('getFileTree', JSON.stringify(fileTree, null, 2));
  }

  return (
    file.type === 'folder' ? (
      <EcommerceFolderDetails file={file as CompleteParcel} fileTree={fileTree} user={user}  cart={cart || null} />
    ) : (
      <EcommerceFileDetails file={file as CompleteParcel} user={user}  cart={cart || null} />
    )
  );
}

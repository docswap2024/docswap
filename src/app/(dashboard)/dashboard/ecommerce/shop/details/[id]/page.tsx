import { notFound } from 'next/navigation';
import { Parcel} from '@/db/schema';
import { getParcelById } from '@/server/actions/parcels.action';

import { getCurrentUser } from '@/lib/utils/session';
import { EcommerceDetails } from '@/components/templates/ecommerce-details';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const file = await getParcelById(params.id);

  if (!file) {
    throw notFound();
  }

  return <EcommerceDetails file={file as Parcel} user={user} />;
}

import { cookies } from 'next/headers';
import { FilesLayoutType } from '@/components/organisms/file-layout-switcher';
import { EcommerceShop } from '@/components/templates/ecommerce-shop'; 
import { ShopSortType, SortOrderType } from '@/config/sorting';
import { getParcels, getAllFolders} from '@/server/actions/parcels.action';
import { getCurrentUser } from '@/lib/utils/session';
import { getCart} from '@/server/actions/cart.action';

type SearchParams = {
  search?: string;
  page?: number;
  size?: number;
  sort?: ShopSortType;
  order?: SortOrderType;
  type?: string;
};

// const pageHeader = {
//   title: 'Shop',
//   breadcrumb: [
//     {
//       name: 'Home',
//     },
//     {
//       href: "routes.eCommerce.dashboard",
//       name: 'E-Commerce',
//     },
//     {
//       name: 'Shop',
//     },
//   ],
// };

// export const metadata = {
//   ...metaObject('Shop'),
// };

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const defaultSort = 'streetName';
  const defaultOrder = 'asc';

  // Merge default values if not provided
  const mergedParams: SearchParams = {
    size: 50,
    sort: searchParams.sort || defaultSort,
    order: searchParams.order || defaultOrder,
    ...searchParams,
  };

  const user = await getCurrentUser();
  const defaultLayout = cookies().get('files-layout')?.value ?? 'grid';
  const { parcels, count } = await getParcels({ size: 50, ...mergedParams });
  const folders = await getAllFolders();
  const cart = await getCart(user?.id);

  return (
    <>
        <EcommerceShop 
         parcels={parcels}
         user={user}
         totalParcels={count}
         defaultLayout={defaultLayout as FilesLayoutType} 
         folders={folders}
         cart={cart || null}
        />
    </>
  );

}
// export default function ShopPage() {

//   const defaultLayout = cookies().get('files-layout')?.value ?? 'grid';

//   return (
//     <>
//         <EcommerceShop defaultLayout={defaultLayout as FilesLayoutType} />
//       {/* <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
//         <FiltersButton placement="right" modalView={<ShopFilters />} />
//       </PageHeader>

//       <ProductFeed /> */}
//     </>
//   );
// }

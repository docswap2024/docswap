// import dynamic from 'next/dynamic';
// import { routes } from '@/config/routes';
// import { metaObject } from '@/config/site.config';
// import PageHeader from '@/app/shared/page-header';
// import FiltersButton from '@/app/shared/filters-button';
// import ProductFeed from '@/app/shared/ecommerce/shop/product-feed';

// const ShopFilters = dynamic(
//   () => import('@/app/shared/ecommerce/shop/shop-filters'),
//   {
//     ssr: false,
//   }
// );
import { cookies } from 'next/headers';
import { FilesLayoutType } from '@/components/organisms/file-layout-switcher';
import { EcommerceShop } from '@/components/templates/ecommerce-shop'; 
import { FileSortType, SortOrderType } from '@/config/sorting';
import { getParcels, getAllFolders} from '@/server/actions/parcels.action';


type SearchParams = {
  search?: string;
  page?: number;
  size?: number;
  sort?: FileSortType;
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
  const defaultLayout = cookies().get('files-layout')?.value ?? 'grid';
  const { parcels, count } = await getParcels({ size: 50, ...searchParams });
  const folders = await getAllFolders();

  return (
    <>
        <EcommerceShop 
         parcels={parcels}
         totalParcels={count}
         defaultLayout={defaultLayout as FilesLayoutType} 
         folders={folders}
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

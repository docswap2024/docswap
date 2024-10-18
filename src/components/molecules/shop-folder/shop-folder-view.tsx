import { Cart, ParcelFolder, CompleteParcel } from '@/db/schema';
import { format } from 'date-fns';
import prettyBytes from 'pretty-bytes';
import { Text } from 'rizzui';
import { useRouter } from 'next-nprogress-bar';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { FolderIcon } from '@/components/atoms/icons/folder';
import { Box, Flex } from '@/components/atoms/layout';
import Link from '@/components/atoms/next/link';
import { getR2FileLink } from '@/lib/utils/parcel';

import { getUserDetails} from '@/server/actions/user.action';
import { useState, useEffect } from 'react';
import { FavouriteAction } from '@/components/molecules/favourite-action';
import { AddToCartAction } from '@/components/molecules/add-to-cart-action';
import { User } from 'lucia';
import Image from '@/components/atoms/next/image';
import { modifyCart } from '@/lib/utils/cart';
import { TbShoppingCartX, TbShoppingCart } from "react-icons/tb";

export const ShopFolderView = ({
  file,
  user,
  folders,
  layout = 'grid',
  cart,
}: {
  file: CompleteParcel;
  user: User;
  folders: ParcelFolder[];
  layout?: string;
  cart: Cart | null;
}) => {
  const router = useRouter();
  const folderSlug = PAGES.DASHBOARD.SHOP_FOLDERS + '/' + file.id;
  const [cardImage, setCardImage] = useState<string>('');

  const parentFolder =
    folders.find((item) => item.id === file.parentId) ?? null;


  useEffect(() => {
    const getCardR2Link = async () => {

      const imagePath = `Streetview/${file.streetName}/landing/${file.name}.jpg`;
      const link = await getR2FileLink(imagePath);
      if (link) {
        setCardImage(link);
      }
    };
    getCardR2Link();
  }, []);


  return (
    <>
      {layout === 'grid' ? (
        <Box
          className={cn(
            'relative flex flex-col p-4 transition-all rounded-md group hover:bg-steel-50 dark:hover:bg-steel-700',
          )}
        >
          <Box
          className="flex flex-col items-left justify-start w-full text-left"
          onClick={() => router.push(`/dashboard/ecommerce/shop/details/${file.id}`)}
          >
            <Box className="relative w-full h-24 sm:h-36 lg:h-48 mb-4"> {/* Increased the height to ensure visibility */}
              <Box className="absolute top-2 right-2 z-10">
                <FavouriteAction file={file} user={user} />
              </Box>
              <Box className="flex items-center justify-center h-full">
                {cardImage && (
                  <Image
                    src={cardImage} // Ensure this is a valid path
                    alt={file.name}
                    fill
                    priority
                    className="w-auto h-full shrink-0 rounded-md"
                  />
                )}
                
                <Box className='absolute bottom-2 right-2'>
                    <AddToCartAction file={file} user={user} cart={cart} />
                </Box>
              </Box>
            </Box>
            <Flex justify="between" className="w-full items-center">
              <Text className="text-steel-900 dark:text-white font-medium truncate text-lg">
                {file.name}
              </Text>
            </Flex>

            {/* File Description */}
            {file.description && (
              <Flex justify="start" className="w-full mt-1">
                <Text className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {file.description}
                </Text>
              </Flex>
            )}

            {/* File Address */}
            <Flex justify="start" className="w-full text-left text-xs leading-5">
              <Text className="text-gray-700 dark:text-gray-300">
                {file.streetNumber && `${file.streetNumber} `}
                {file.streetName && `${file.streetName}, `}
                {file.subArea && `${file.subArea}, `}
                {file.city && `${file.city}, `}
                {file.stateProvince && `${file.stateProvince}, `}
                {file.postalCode && `${file.postalCode}, `}
                {file.country && `${file.country}`}
              </Text>
            </Flex>
          </Box>
        </Box>
      ) : (
        <Box
          className={cn(
            'grid grid-cols-[1fr_200px_200px_200px_200px_100px] gap-0 transition-all hover:bg-steel-50 dark:hover:bg-steel-700 px-1 border-b border-steel-100 dark:border-steel-600/60 rounded'
          )}
        >
          <Flex>
            <Link
              href={`/dashboard/ecommerce/shop/details/${file.id}`}
              className="flex px-2.5 items-center w-full gap-4 transition-all hover:underline underline-offset-2"
            >
              <Box className="w-6 relative -left-0.5">
                  <FolderIcon className="h-auto w-6" />
              </Box>
              <Text className="w-full max-w-[35ch] truncate text-steel-700 dark:text-steel-300">
                {file.name}
              </Text>
            </Link>
          </Flex>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {file.userName}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
          {file.description || ' '}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {format(file?.updatedAt, 'MMM dd, yyyy') || ' '}
          </Text>
          <Text className="px-2.5 border-l border-r border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {prettyBytes(file?.fileSize as number) || ' '}
          </Text>
          
          <Flex
            justify="between"
            className="px-2.5 text-steel-700 dark:text-steel-300 py-1.5"
          >
            <button
              onClick={(e) => {
              e.stopPropagation(); // Prevents the click event from triggering the router push
              modifyCart(user, file, cart);
              }}
          >
              {cart?.fileIds?.some((item) => item === file.id) ? (
              <>
                  <TbShoppingCartX className="h-5 w-5" />
              </>
              ) : (
              <>
                  <TbShoppingCart className="h-5 w-5" />
              </>
              )}
            </button>
            |
            <FavouriteAction file={file} user={user} />
          </Flex>
        </Box>
      )}
    </>
  );
};

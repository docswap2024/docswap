import { useEffect, useState } from 'react';
import { CompleteParcel, Cart } from '@/db/schema';
import format from 'date-fns/format';
import { User } from 'lucia';
import { useRouter } from 'next-nprogress-bar';
import prettyBytes from 'pretty-bytes';
import { Text, Button } from 'rizzui';
import { cn } from '@/lib/utils/cn';
import { getR2FileLink } from '@/lib/utils/parcel';
import { Draggable } from '@/components/atoms/draggable';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';
import { Box, Flex } from '@/components/atoms/layout';
import Image from '@/components/atoms/next/image';
import { FavouriteAction } from '@/components/molecules/favourite-action';
import { AddToCartAction } from '@/components/molecules/add-to-cart-action';
import { modifyCart } from '@/lib/utils/cart';
import { TbShoppingCartX, TbShoppingCart } from "react-icons/tb";

type ImageSize = {
  width: number;
  height: number;
};

export const ShopFileView = ({
  file,
  user,
  layout = 'grid',
  cart,
}: {
  file: CompleteParcel;
  user: User;
  layout?: string;
  cart: Cart | null;
}) => {
  const router = useRouter();

  const [cardImage, setCardImage] = useState<string>('');
  const [saleImageSize, setSaleImageSize] = useState<ImageSize>({ width: 0, height: 0 });

  const iconType = file.type as FileIconType | null;

  useEffect(() => {
    const getCardR2Link = async () => {
      let modifiedFileName = file.fileName;

      // Check if 'landing' is in the fileName and replace it with 'card'
      if (modifiedFileName.includes('landing')) {
        setSaleImageSize({ width: 1920, height: 870 });
        modifiedFileName = modifiedFileName.replace('landing', 'card');
      }
      const link = await getR2FileLink(modifiedFileName);
      if (link) {
        setCardImage(link);
      }
    };
    getCardR2Link();
  }, []);
  


  return (
    <Draggable id={file.id} data={file}>
      {layout === 'grid' ? (
        <Box
        className={cn(
          'relative flex flex-col p-4 transition-all rounded-md group hover:bg-steel-50 dark:hover:bg-steel-700'
        )}
      >
        <Box
          className="flex flex-col items-left justify-start w-full text-left"
          onClick={() => router.push(`/dashboard/ecommerce/shop/details/${file.id}`)}
        >
          {/* Image Section */}
          <Box className="relative w-full h-24 sm:h-36 lg:h-48 mb-4"> {/* Increased the height to ensure visibility */}
          <Box className="absolute top-2 right-2 z-10">
            <FavouriteAction file={file} user={user} />
          </Box>
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

          {/* File Name and Extension */}
            <Flex justify="between" className="w-full items-center">
              <Text className="text-steel-900 dark:text-white font-medium truncate text-lg">
                {file.name}
              </Text>
              <Text className="text-steel-500 dark:text-steel-300 ml-3 uppercase text-sm font-semibold">
                {file.extension}
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

            {/* File Size */}
            {
              saleImageSize.width && saleImageSize.height && (
                <Flex justify="start" className="w-full text-left text-xs leading-5 mb-2">
                  <Text className="text-gray-700 dark:text-gray-300">
                    {`(${saleImageSize.width} x ${saleImageSize.height})`}
                  </Text>
                </Flex>
              )
            }

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
            'grid grid-cols-[1fr_200px_200px_200px_200px_100px] transition-all hover:bg-steel-50 dark:hover:bg-steel-700 px-1 border-b border-steel-100 dark:border-steel-600/60',
          )}
        >
          <Flex>
            <button
              className="flex px-2.5 items-center w-full gap-4 text-left transition-all hover:underline underline-offset-2"
              onClick={() => router.push(`/dashboard/ecommerce/shop/details/${file.id}`)}
            >
              <Box className="w-5 shrink-0 py-2">
                <DynamicFileIcon
                  className="w-full h-auto shrink-0"
                  iconType={iconType}
                />
              </Box>
              <Flex className="gap-0 w-full " justify="start">
                <Text className="max-w-[20ch] 3xl:max-w-[35ch] truncate text-steel-700 dark:text-steel-300">
                  {file.name}.
                </Text>
                <Text className="text-steel-700 dark:text-steel-300">
                  {file.extension}
                </Text>
              </Flex>
            </button>
          </Flex>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {file.userName}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {file.description || ' '} 
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {format(file.updatedAt, 'MMM dd, yyyy') || ' '}
          </Text>
          <Text className="px-2.5 border-l border-r border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {prettyBytes(file?.fileSize as number)|| ' '}
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
    </Draggable>
  );
};

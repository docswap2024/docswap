"use client";

import { CompleteParcel, Cart } from '@/db/schema';
import { User } from 'lucia';
import { useEffect, useState } from 'react';
import { getR2FileLink } from '@/lib/utils/parcel';
import Image from '@/components/atoms/next/image';
import { Box, Flex } from '@/components/atoms/layout';
import { cn } from '@/lib/utils/cn';
import { Button, Text, ActionIcon, Collapse} from 'rizzui';
import { TbShoppingCartX, TbShoppingCart } from "react-icons/tb";
import { useRouter } from 'next-nprogress-bar';
import { LastSold } from '@/components/molecules/ecommerce-sub-details/last-sold';
import { Taxes } from '../molecules/ecommerce-sub-details/taxes';
import {
  RiArrowLeftLine,
} from 'react-icons/ri';
import axios from 'axios';
import { BCAssessment } from '../molecules/ecommerce-sub-details/bc-assessment';
import { numberWithCommas, checkIfEmpty } from '@/lib/utils/format';
import { handleFavourite } from '@/lib/utils/favourite';
import { modifyCart } from '@/lib/utils/cart';

export function EcommerceFileDetails({
    file,
    user,
    cart
}: {
    file: CompleteParcel;
    user: User;
    cart: Cart | null;
}) {
    const [cardImage, setCardImage] = useState<string>('');
    const [propertyInfo, setPropertyInfo] = useState<any>(null);
    const router = useRouter();

    
    useEffect(() => {
        const getCardR2Link = async () => {
          let modifiedFileName = file.fileName;
    
          // Check if 'landing' is in the fileName and replace it with 'card'
          if (modifiedFileName.includes('landing')) {
            modifiedFileName = modifiedFileName.replace('landing', 'card');
          }
          const link = await getR2FileLink(modifiedFileName);
          if (link) {
            setCardImage(link);
          }
        };

        const getPropertyDetails = async () => {
            try {
                const response = await axios.get(`/api/property/parcels/getParcelWithPID/${file.pid}`);
                
                if(response.status === 200){
                    const data = await response.data;
                    console.log(data);
                    setPropertyInfo(data);
                }
                
            } catch (error) {
            
            }
        };
        getPropertyDetails();
        getCardR2Link();
    }, []);

   return (
      <Box>
        <Box className="flex justify-start p-4">
            <ActionIcon
            className="w-auto hover:bg-steel-100 px-2 sm:px-3 text-steel-900 dark:text-steel-200 dark:hover:bg-steel-300/10"
            variant="text"
            onClick={() => {
                router.back();
            }}
            >
            <RiArrowLeftLine className="sm:mr-1.5" size={18} />
            <span className="hidden sm:inline-block">Back</span>
            </ActionIcon>
        </Box>
        {
        propertyInfo &&
            <Box className="flex flex-col sm:flex-row">
                {/* Left Image Section */}
                <Box className='grid grid-cols-2 gap-2'>
                    {/* First image spanning 2 rows and 1 column */}
                    <Box className="col-span-2">
                        {cardImage && (
                        <Image
                            className="rounded-md"
                            src={cardImage}
                            alt={file.name}
                            width={410}
                            height={200} // Adjust the height to span 2 rows
                            priority
                        />
                        )}
                    </Box>

                    {/* Second image spanning 1 row and 1 column */}
                    <Box>
                        <Image
                        className="rounded-md"
                        width={200}
                        height={200}
                        priority
                        src={`https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${propertyInfo.Latitude.Value},${propertyInfo.Longitude.Value}&fov=80&pitch=0&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                        alt=""
                        />
                    </Box>

                    {/* Third image spanning 1 row and 1 column */}
                    <Box>
                        <Image
                        className="rounded-md"
                        width={200}
                        height={200}
                        priority
                        src={`https://maps.googleapis.com/maps/api/staticmap?maptype=satellite&zoom=18&center=${propertyInfo.Latitude.Value},${propertyInfo.Longitude.Value}&size=300x300&markers=color:blue%7C${propertyInfo.Latitude.Value},${propertyInfo.Longitude.Value}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                        alt=""
                        />
                    </Box>
                </Box>

                {/* Right Details Section */}
                <Box className="w-full sm:w-2/3 sm:p-8 sm:pt-2 pt-0 space-y-2">
                    <Text className="text-steel-900 dark:text-white font-medium text-lg md:text-2xl">
                        {file.name}.{file.extension}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-400 text-md md:text-lg leading-relaxed pb-4 border-b border-muted">{file.description}</Text>
                    
                    <Text className="pt-2 text-gray-700 dark:text-gray-300 pb-4 border-b border-muted">
                        {file.streetNumber && file.streetName && (
                            <>
                            {file.streetNumber} {file.streetName} <br />
                            </>
                        )}
                        {file.subArea && file.city && (
                            <>
                            {file.subArea}, {file.city} <br />
                            </>
                        )}
                        {file.stateProvince && file.postalCode && (
                            <>
                            {file.stateProvince}, {file.postalCode} <br />
                            </>
                        )}
                        {file.country && <>{file.country}</>}
                    </Text>

                    <Text className="pt-4 text-gray-700 dark:text-gray-300 pb-6 border-b border-muted">
                        <span className="font-semibold">Beds:</span> {propertyInfo.Bedrooms.Value} &nbsp;|&nbsp; 
                        <span className="font-semibold">Baths:</span> {propertyInfo.Bathrooms.Value} &nbsp;|&nbsp; 
                        <span className="font-semibold">Floor Area:</span> {numberWithCommas(propertyInfo.FloorArea.Value)} sq ft<br />
                        <span className="font-semibold">Lot Size:</span> {checkIfEmpty(numberWithCommas(propertyInfo.LotSize.Value))} sq ft
                    </Text>

                    {/* <Details getProperty={propertyInfo} propertyType='detached'/> */}

                    {/* Add to Cart and Wishlist Buttons */}
                    <Box className="grid grid-cols-1 gap-4 pt-7 sm:grid-cols-2 xl:gap-6">
                        {/* Add to Cart Button */}
                        <Button
                        size="lg"
                        type="submit"
                        className="h-12 text-sm lg:h-14 lg:text-base hover:opacity-80"
                        onClick={() => modifyCart(user, file, cart)}
                        >
                         {
                            cart?.fileIds?.some((item) => item === file.id) ? 
                            (
                                <>
                                    <TbShoppingCartX className="me-2 h-5 w-5 lg:h-[22px] lg:w-[22px]" />
                                    Remove from Cart
                                </>
                            ) : 
                            (
                                <>
                                    <TbShoppingCart className="me-2 h-5 w-5 lg:h-[22px] lg:w-[22px]" />
                                    Add to Cart
                                </>
                            )
                        }
                        </Button>

                        {/* Wishlist Button */}
                        <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleFavourite(file, user)}
                        className="h-12 text-sm lg:h-14 lg:text-base"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 32 32"
                            className="me-1 h-6 w-6 lg:h-8 lg:w-8"
                        >
                            <path
                            fill={file.favouritedBy?.includes(user.id) ? '#e00' : 'currentColor'}
                            fillOpacity={file.favouritedBy?.includes(user.id) ? 1 : 0}
                            d="M26.492 10.7a6.065 6.065 0 0 0-1.383-1.931 6.457 6.457 0 0 0-2.042-1.295A6.686 6.686 0 0 0 20.577 7a6.697 6.697 0 0 0-3.383.91 6.345 6.345 0 0 0-.693.469 6.345 6.345 0 0 0-.693-.47A6.697 6.697 0 0 0 12.425 7c-.863 0-1.7.159-2.49.474a6.442 6.442 0 0 0-2.041 1.294A6.028 6.028 0 0 0 6.51 10.7 5.776 5.776 0 0 0 6 13.078c0 .777.165 1.586.493 2.41a10.65 10.65 0 0 0 1.172 2.123c.797 1.14 1.894 2.33 3.255 3.537 2.256 2 4.49 3.38 4.585 3.437l.576.354a.809.809 0 0 0 .838 0l.576-.354a36.744 36.744 0 0 0 4.585-3.437c1.361-1.206 2.458-2.396 3.255-3.537.503-.721.9-1.435 1.171-2.123.329-.824.494-1.633.494-2.41a5.736 5.736 0 0 0-.508-2.378Z"
                            />
                            <path
                            fill={file.favouritedBy?.includes(user.id) ? '#e00' : 'currentColor'}
                            fillOpacity={file.favouritedBy?.includes(user.id) ? 1 : 0}
                            stroke={file.favouritedBy?.includes(user.id) ? '#e00' : 'currentColor'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.25 7C8.35 7 6 9.244 6 12.012c0 2.234.919 7.538 9.962 12.9a1.063 1.063 0 0 0 1.076 0C26.08 19.55 27 14.246 27 12.011 27 9.244 24.649 7 21.75 7c-2.9 0-5.25 3.037-5.25 3.037S14.149 7 11.25 7Z"
                            />
                        </svg>
                        Wishlist
                        </Button>
                    </Box>
                </Box>
            </Box>
        }
        {
            propertyInfo &&
            <Box className="flex flex-col">
                <LastSold getProperty={propertyInfo} propertyType="detached" />
                <BCAssessment getProperty={propertyInfo} propertyType="detached" />
                <Taxes getProperty={propertyInfo} propertyType="detached" />
            </Box>
        }
      </Box>

  );
}
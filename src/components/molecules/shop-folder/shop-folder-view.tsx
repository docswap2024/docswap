import { Parcel, ParcelFolder } from '@/db/schema';
import { format } from 'date-fns';
import prettyBytes from 'pretty-bytes';
import { Text } from 'rizzui';

import { PAGES } from '@/config/pages';
import { cn } from '@/lib/utils/cn';
import { FolderIcon } from '@/components/atoms/icons/folder';
import { Box, Flex } from '@/components/atoms/layout';
import Link from '@/components/atoms/next/link';

import { getUserDetails} from '@/server/actions/user.action';
import { useState, useEffect } from 'react';
 

export const ShopFolderView = ({
  file,
  folders,
  layout = 'grid',
}: {
  file: Parcel;
  layout?: string;
  folders: ParcelFolder[];
}) => {
  const folderSlug = PAGES.DASHBOARD.SHOP_FOLDERS + '/' + file.id;
  const [userName, setUserName] = useState<string>('');

  const parentFolder =
    folders.find((item) => item.id === file.parentId) ?? null;

  const getUserName = async (userId: string) => {
    const user = await getUserDetails(userId);
    return user.name;
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await getUserName(file.userId);
      if (name) {
        setUserName(name);
      }
    };
    fetchUserName();
  }, [file.userId]);


  return (
    <>
      {layout === 'grid' ? (
        <Box
          className={cn(
            'relative flex flex-col p-4 transition-all rounded-md group hover:bg-steel-50 dark:hover:bg-steel-700',
          )}
        >
          <Link
            href={folderSlug}
            className="flex flex-col items-left justify-start w-full text-left"
          >
            <Box className="relative h-14 w-auto">
              <FolderIcon
                className="w-auto h-full shrink-0"
              />
            </Box>

            <Flex justify="start" className="w-full gap-0 mt-5">
              <Text className="text-steel-700 dark:text-steel-300 truncate">
                {file.name}
              </Text>
            </Flex>
            {file.description && (
              <Flex justify="start" className="w-full gap-0 mb-2">
                <Text className="text-gray-600 dark:text-gray-400 text-xs text-left">
                  {file.description}
                </Text>
              </Flex>
            )}

            {/* File Address */}
            <Flex justify="start" className="w-full gap-0">
              <Text className="text-gray-700 dark:text-gray-300 text-xs text-left">
                {file.streetNumber} {file.streetName}, {file.subArea}, {file.city}, {file.stateProvince}, {file.postalCode}, {file.country}
              </Text>
            </Flex>
          </Link>
          {/* <Box
            className={cn(
              'absolute transition-all pointer-events-none group-hover:pointer-events-auto  top-3 right-2'
            )}
          >
            <FolderAction
              file={file}
              folders={folders}
              parentFolder={parentFolder}
            />
          </Box> */}
        </Box>
      ) : (
        <Box
          className={cn(
            'grid grid-cols-[1fr_200px_200px_200px_200px_50px] gap-0 transition-all hover:bg-steel-50 dark:hover:bg-steel-700 px-1 border-b border-steel-100 dark:border-steel-600/60 rounded'
          )}
        >
          <Flex>
            <Link
              href={folderSlug}
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
            {userName}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {format(file?.updatedAt, 'MMM dd, yyyy') || ' '}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {prettyBytes(file?.fileSize as number) || ' '}
          </Text>
          {/* <Flex
            justify="end"
            className="px-2.5 text-steel-700 dark:text-steel-300 py-1.5"
          >
            <FolderAction
              file={file}
              folders={folders}
              parentFolder={parentFolder}
            />
          </Flex> */}
        </Box>
      )}
    </>
  );
};

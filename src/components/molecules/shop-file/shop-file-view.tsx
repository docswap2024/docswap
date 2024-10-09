import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Parcel, Folder } from '@/db/schema';
import format from 'date-fns/format';
import { User } from 'lucia';
import {
  ArrowDownToLine,
  LockIcon,
  PanelLeftOpenIcon,
  Share2Icon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import prettyBytes from 'pretty-bytes';
import { ActionIcon, Button, Modal, Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { getR2FileLink } from '@/lib/utils/parcel';
import { Draggable } from '@/components/atoms/draggable';
import {
  DynamicFileIcon,
  FileIconType,
} from '@/components/atoms/dynamic-file-icon';
import { Checkbox } from '@/components/atoms/forms';
import { Box, Flex } from '@/components/atoms/layout';
import Image from '@/components/atoms/next/image';
import { FolderAction } from '@/components/molecules/folder-action';
import FileDetails from '@/components/organisms/file-details';
import { getUserDetails} from '@/server/actions/user.action';

export const ShopFileView = ({
  file,
  layout = 'grid',
}: {
  file: Parcel;
  layout?: string;
}) => {
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false); // State to track if the heart is liked
  const [modalState, setModalState] = useState(false);
  const [detailsState, setDetailsState] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [cardImage, setCardImage] = useState<string>('');
  const imageUrl = getR2FileLink(file.fileName);

  const iconType = file.type as FileIconType | null;

  const getUserName = async (userId: string) => {
    const user = await getUserDetails(userId);
    return user.name;
  };

  const toggleLike = () => {
    setIsLiked(!isLiked); // Toggle the liked state
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
            <button onClick={toggleLike} className="p-1 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill={isLiked ? 'red' : 'gray'} // Change fill color based on like state
                stroke="white" // White border
                strokeWidth="2" // Border thickness
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
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

            {/* File Address */}
            <Flex justify="start" className="w-full text-left text-xs leading-5">
              <Text className="text-gray-700 dark:text-gray-300">
                {file.streetNumber} {file.streetName}, {file.subArea}, {file.city}, {file.stateProvince}, {file.postalCode}, {file.country}
              </Text>
            </Flex>
        </Box>
      </Box>
      ) : (
        <Box
          className={cn(
            'grid grid-cols-[1fr_200px_200px_200px_200px_50px] transition-all hover:bg-steel-50 dark:hover:bg-steel-700 px-1 border-b border-steel-100 dark:border-steel-600/60',
          )}
        >
          <Flex>
            <button
              className="flex px-2.5 items-center w-full gap-4 text-left transition-all hover:underline underline-offset-2"
              onClick={() => router.push(`/preview/${file.id}`)}
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
            {userName}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {format(file.updatedAt, 'MMM dd, yyyy')}
          </Text>
          <Text className="px-2.5 border-l border-steel-100 dark:border-steel-600/60 text-steel-700 dark:text-steel-300 py-1.5 flex items-center">
            {prettyBytes(file?.fileSize as number)}
          </Text>{' '}
            {/* <Flex
                justify="end"
                className="px-2.5 text-steel-700 dark:text-steel-300 py-1.5"
            >
                <FolderAction
                file={file}
                />
            </Flex> */}
        </Box>
      )}

      <Modal
        isOpen={modalState}
        onClose={() => {
          setModalState(false);
        }}
        size="full"
        containerClassName="bg-white h-[100dvh] dark:bg-steel-800"
        overlayClassName="hidden"
      >
        <Box className="flex items-center justify-between px-6 border-b border-steel-100 dark:border-steel-600/60dark:border-steel-600/60 bg-steel-50/30 dark:bg-steel-700 h-14">
          <Flex className="gap-0" justify="start">
            <Button
              className="font-normal hover:bg-steel-100/50 dark:hover:bg-steel-600/50 text-steel-700 dark:text-steel-300"
              variant="text"
            >
              <Share2Icon
                className="mr-2 text-steel-500 dark:text-steel-400"
                strokeWidth={1.5}
                size={18}
              />
              Share
            </Button>
            <Button
              className="font-normal hover:bg-steel-100/50 dark:hover:bg-steel-600/50 text-steel-700 dark:text-steel-300"
              variant="text"
            >
              <Link className="flex items-center" href={imageUrl}>
                <ArrowDownToLine
                  className="mr-2 text-steel-500 dark:text-steel-400"
                  strokeWidth={1.5}
                  size={18}
                />
                Download
              </Link>
            </Button>
          </Flex>

          <Flex className="w-auto gap-3" justify="start">
            <Button
              className="font-normal hover:bg-steel-100/50 dark:hover:bg-steel-600/50 text-steel-700 dark:text-steel-300"
              variant="text"
              onClick={() => setDetailsState((prev) => !prev)}
            >
              <PanelLeftOpenIcon
                className="mr-2 text-steel-500 dark:text-steel-400"
                strokeWidth={1.5}
                size={18}
              />
              <span>Info</span>
            </Button>

            <ActionIcon
              className="rounded hover:bg-steel-100/50 dark:hover:bg-steel-600/50"
              variant="text"
              onClick={() => {
                setModalState(false);
              }}
            >
              <XIcon
                className="text-steel-500 dark:text-steel-400"
                strokeWidth={1.5}
              />
            </ActionIcon>
          </Flex>
        </Box>

        <Box
          className={cn(
            'h-[calc(100%-56px)] w-full grid grid-cols-[1fr_400px]',
            detailsState
              ? 'grid-cols-[1fr_400px] overflow-hidden'
              : 'grid-cols-1'
          )}
        >
          {file.type === 'image' && file.mime !== 'image/svg+xml' ? (
            <Box className="relative w-full h-full bg-steel-50 dark:bg-steel-800">
              <Image
                src={imageUrl ?? ''}
                alt={file.name}
                className="object-contain !w-auto !h-auto m-auto max-w-full max-h-full"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Box>
          ) : file.type === 'video' ? (
            <Box className="flex items-center justify-center w-full h-full bg-steel-50 dark:bg-steel-800">
              <video
                controls
                className="w-auto h-auto max-w-full max-h-full m-auto"
              >
                <source src={imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          ) : file.type === 'audio' ? (
            <Box className="flex items-center justify-center w-full h-full">
              <audio controls className="w-[420px] max-w-full">
                <source src={imageUrl} />
                Your browser does not support the audio tag.
              </audio>
            </Box>
          ) : (
            <Box className="flex flex-col items-center justify-center w-full h-full bg-steel-50 dark:bg-steel-800">
              <Flex direction="col" className="gap-4 mb-8">
                <DynamicFileIcon className="w-14 h-auto" iconType={iconType} />
                <Text>
                  {file.name}.{file.extension}
                </Text>
              </Flex>
              <Text className="mb-8">
                Hmm… looks like this file doesn&apos;t have a preview we can
                show you.
              </Text>
              <Button>
                <Link className="flex items-center" href={imageUrl}>
                  <ArrowDownToLine
                    className="mr-2"
                    strokeWidth={1.5}
                    size={18}
                  />
                  Download
                </Link>
              </Button>
            </Box>
          )}
{/* 
          {detailsState && (
            <FileDetails
              file={file}
              setDetailsState={setDetailsState}
            />
          )} */}
        </Box>
      </Modal>
    </Draggable>
  );
};

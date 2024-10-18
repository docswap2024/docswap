import useQueryParams from '@/hooks/useQueryParam';
import { isEmpty } from 'lodash';
import { Fragment} from 'react';
import { Cart, ParcelFolder, CompleteParcel } from '@/db/schema';
import SimpleBar from '@/components/atoms/simplebar';
import { Box, Flex, Grid } from '@/components/atoms/layout';
import { Fallback } from '@/components/molecules/Fallback';
import { NoFilesIllustration } from '@/components/atoms/illustrations/fallbacks/no-files-illustration';
import { ShopFileView } from '@/components/molecules/shop-file/shop-file-view';
import { ShopFolderView } from '@/components/molecules/shop-folder/shop-folder-view';
import { Button, Text } from 'rizzui';
import { User } from 'lucia';

type shopFilesTypes = {
    files:  CompleteParcel[];
    user: User;
    totalFiles: number;
    layout?: string;
    folders: ParcelFolder[];
    cart: Cart | null;
};
  
export const ShopFoldersFiles = ({
files,
user,
totalFiles,
layout = 'grid',
folders,
cart
}: shopFilesTypes) => {
    const { setQueryParams, queryParams } = useQueryParams(); 
    const size = queryParams.size ? Number(queryParams.size) : 50;
    
    const handleLoadMore = () => {
        setQueryParams({ size: size + 50 }, true);
      };
    
    if (isEmpty(files)) {
        return (
            <Flex justify="center" className="py-12">
            <Fallback
                illustration={NoFilesIllustration}
                illustrationClassName="w-[200px] md:w-[280px] h-auto"
                title="No files"
                subtitle="Please start uploading files"
            />
            </Flex>
        );
    }

    return (
        <>
        {layout === 'grid' && (
            <Grid
              columns="2"
              // className="gap-5 mb-8 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 3xl:grid-cols-8"
              className="gap-5 mb-8 sm:grid-cols-2 md:grid-cols-4"
            >
              <FileElementList
                layout={layout}
                user={user}
                files={files}
                folders={folders}
                cart={cart}
              />
            </Grid>
        )}
         {layout === 'list' && (
        <Box className="mb-8">
          <SimpleBar className="">
            <Box className="min-w-[1200px] ">
              <Box className="w-full grid grid-cols-[1fr_200px_200px_200px_200px_100px] gap-0 px-1 border-t border-b border-steel-100 items-center dark:border-steel-600/60">
                <Text className="px-2.5 pl-[50px] first:border-l-0 font-medium border-l border-steel-100 text-steel-700 dark:text-steel-100 dark:border-steel-600/60 py-1.5">
                  Name
                </Text>
                <Text className="px-2.5 first:border-l-0 font-medium border-l border-steel-100 text-steel-700 dark:text-steel-100 py-1.5 dark:border-steel-600/60">
                  Uploaded By
                </Text>
                <Text className="px-2.5 first:border-l-0 font-medium border-l border-steel-100 text-steel-700 dark:text-steel-100 py-1.5 dark:border-steel-600/60">
                  Description
                </Text>
                <Text className="px-2.5 first:border-l-0 font-medium border-l border-steel-100 text-steel-700 dark:text-steel-100 py-1.5 dark:border-steel-600/60">
                  Modified
                </Text>
                <Text className="px-2.5 first:border-l-0 font-medium border-l border-r border-steel-100 text-steel-700 dark:text-steel-100 py-1.5 dark:border-steel-600/60">
                  File Size
                </Text>
              </Box>

              <FileElementList
                layout={layout}
                user={user}
                files={files}
                folders={folders}
                cart={cart}
              />
            </Box>
          </SimpleBar>
        </Box>
      )}

      {totalFiles > size && (
        <Flex justify="center">
          <Button onClick={handleLoadMore}>Load more</Button>
        </Flex>
      )}
        </>
    );

}

function FileElementList({
    files,
    user,
    layout,
    folders,
    cart
  }: {
    files: CompleteParcel[];
    user: User;
    layout: string;
    folders: ParcelFolder[];
    cart: Cart | null;
  }) {
    return (
      <>
        {files.map((file: any) => {
          if (file?.type === 'folder') {
            return (
              <Fragment key={file.id}>
                  <ShopFolderView
                    file={file}
                    user={user}
                    folders={folders}
                    layout={layout}
                    cart={cart}
                  />
              </Fragment>
            );
          }
          return (
            <ShopFileView
              key={file.id}
              file={file}
              user={user}
              layout={layout}
              cart={cart}
            />
          );
        })}
      </>
    );
}
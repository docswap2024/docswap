import { CompleteParcel } from '@/db/schema';
import { User } from 'lucia';
import { toast } from 'sonner';
import { MESSAGES } from '@/config/messages';
import { makeParcelFavourite } from '@/server/actions/parcels.action';

export const handleFavourite = async (file: CompleteParcel, user: User) => {
    const currentFavStatus = file.favouritedBy?.includes(user.id) || false;
    console.log('currentFavStatus', currentFavStatus);
  
    toast.promise(() => makeParcelFavourite(file.id, !currentFavStatus, user.id), {
      loading: currentFavStatus
        ? `${
            file?.type === 'folder' ? 'Folder' : 'File'
          } removing from favourite...`
        : `${
            file?.type === 'folder' ? 'Folder' : 'File'
          } adding to favourite...`,
      success: () => {
        // setIsLiked(!currentFavStatus);
        return currentFavStatus
          ? `${
              file?.type === 'folder' ? 'Folder' : 'File'
            } removed from favourite`
          : `${file?.type === 'folder' ? 'Folder' : 'File'} added to favourite`;
      },
      error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    });
};
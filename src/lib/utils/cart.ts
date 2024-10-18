
import { Cart, CompleteParcel } from '@/db/schema';
import { User } from 'lucia';
import { toast } from 'sonner';
import { MESSAGES } from '@/config/messages';
import { addToCart } from '@/server/actions/cart.action';

export const modifyCart = async (user: User, file: CompleteParcel, cart: Cart | null) => {
    let isFileInCart : boolean = false;

    if ( cart ) {
        isFileInCart = cart?.fileIds?.some((item) => item === file.id) ?? false;

    }
  
    toast.promise(() => addToCart(file.id, !isFileInCart, user.id), {
      loading: isFileInCart
        ? `${
            file?.type === 'folder' ? 'Folder' : 'File'
          } removing from cart...`
        : `${
            file?.type === 'folder' ? 'Folder' : 'File'
          } adding to cart...`,
      success: () => {
        // setIsLiked(!currentFavStatus);
        return isFileInCart
          ? `${
              file?.type === 'folder' ? 'Folder' : 'File'
            } removed from cart`
          : `${file?.type === 'folder' ? 'Folder' : 'File'} added to cart`;
      },
      error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
    });
};
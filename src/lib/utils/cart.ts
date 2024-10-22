
import { Cart, CompleteParcel, CartWithFiles } from '@/db/schema';
import { User } from 'lucia';
import { toast } from 'sonner';
import { MESSAGES } from '@/config/messages';
import { getCart, addToCart } from '@/server/actions/cart.action';
import { getParcelById } from '@/server/actions/parcels.action';

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

export async function getCartWithFileDetails(userId: string): Promise<CartWithFiles | null> {
  // Fetch the cart for the user
  let cart = await getCart(userId);

  if (cart && cart.fileIds && cart.fileIds.length > 0) {
      // Fetch file details for each file in the cart
      const fileDetailsPromises = cart.fileIds.map(async (fileId) => {
          const parcel = await getParcelById(fileId);
          return parcel.file; // Ensure `file` is the correct property in the response
      });

      // Wait for all file details to be fetched
      const fileDetails = await Promise.all(fileDetailsPromises);

      // Return the cart along with the fetched file details
      return {
          ...cart,
          fileDetails,  // Add the file details to the cart object
      };
  }

  // If no files in the cart, return null or just the empty cart
  return null;  
}
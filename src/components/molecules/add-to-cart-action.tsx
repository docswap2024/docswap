import { CompleteParcel, Cart } from '@/db/schema';
import { User } from 'lucia';
import { modifyCart } from '@/lib/utils/cart';
import { Button } from 'rizzui';
import { TbShoppingCartX, TbShoppingCart } from "react-icons/tb";



export function AddToCartAction({
  file,
  user,
  cart
}: {
  file: CompleteParcel;
  user: User;
  cart: Cart | null;
}) {

    return (
        <Button
            size="lg"
            className="hover:bg-white hover:text-black h-10 px-2 text-sm flex items-center justify-center"
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
        </Button>
    )
    
}
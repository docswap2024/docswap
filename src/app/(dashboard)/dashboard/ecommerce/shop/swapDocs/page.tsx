import { SwapDocs } from "@/components/templates/swap-docs";
import { CompleteParcel, CartWithFiles } from '@/db/schema';
import { getParcelById } from '@/server/actions/parcels.action';
import { getCart} from '@/server/actions/cart.action';
import { getCurrentUser } from '@/lib/utils/session';
import { getCartWithFileDetails } from "@/lib/utils/cart";

export default async function Page() {
    const user = await getCurrentUser();
    let cart = await getCart(user?.id);

    const cartWithFiles = await getCartWithFileDetails(user?.id);

    return (
        <SwapDocs user={user} cart={cart || null} cartWithFiles={cartWithFiles} />
    )
}
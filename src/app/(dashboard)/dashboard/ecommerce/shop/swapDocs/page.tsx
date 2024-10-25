import { SwapDocs } from "@/components/templates/swap-docs";
import { CompleteParcel, CartWithFiles } from '@/db/schema';
import { getParcelById } from '@/server/actions/parcels.action';
import { getCart} from '@/server/actions/cart.action';
import { getCurrentUser } from '@/lib/utils/session';
import { getCartWithFileDetails } from "@/lib/utils/cart";
import { getSwapDocuments } from "@/server/actions/swap.action";

export default async function Page() {
    const user = await getCurrentUser();
    const { swapDocuments, count } = await getSwapDocuments();

    return (
        <SwapDocs user={user} swapDocuments={swapDocuments} count={count} />
    )
}
import isEmpty from 'lodash/isEmpty';
import { Text, EmptyProductBoxIcon, Button} from 'rizzui';
import { DrawerHeader } from '@/components/molecules/drawer-header';
import { CompleteParcel,Cart } from '@/db/schema';
import OrderFiles from '@/components/organisms/order-files';
import { User } from 'lucia';
import Link from 'next/link';
import {cn} from '@/lib/utils/cn';


type CartDrawerViewProps = {
    items: CompleteParcel[] | undefined;
    total: number;
    user: User;
    cart: Cart | null;
    // removeItemFromCart: (id: number) => void;
    // clearItemFromCart: (id: number) => void;
    setOpenCartDrawer: (id: boolean) => void;
  };
  
  export default function CartDrawerView({
    items,
    total,
    // removeItemFromCart,
    // clearItemFromCart,
    setOpenCartDrawer,
    user,
    cart,
  }: CartDrawerViewProps) {
    const isCartEmpty = isEmpty(items);
    return (
        <div className="flex h-full w-full flex-col">
        <DrawerHeader
            title="Cart"
            onClose={() => setOpenCartDrawer(false)}
        />

        {isCartEmpty ? (
                <div className="grid h-full place-content-center">
                <EmptyProductBoxIcon className="mx-auto h-auto w-52 text-gray-400" />
                <Text className="text-steel-900 dark:text-white font-medium text-lg md:text-2xl">
                    Your cart is empty
                </Text>
                <Text className="mt-1 text-center text-steel-900 dark:text-white">Start Shopping!!</Text>
                </div>
        ) : (
                <OrderFiles
                  items={items}
                  showControls
                  className="mb-5 gap-0 divide-y border-b border-gray-100"
                  itemClassName="p-4 pb-5 md:px-6"
                  user={user}
                  cart={cart}
                />
        )}

        {isCartEmpty ? (
            <div className="px-4 py-5">
                <Button
                    className="w-full"
                    variant="flat"
                    onClick={() => setOpenCartDrawer(false)}
                >
                    Back To Shop
                </Button>
            </div>
        ) : (
            <>
                <Link
                href=''
                className={cn(
                    'mx-4 mb-6 flex items-center justify-between rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground md:mx-6'
                )}
                >
                Checkout 
                <span className="-mr-3 inline-flex rounded-md bg-primary-lighter p-2 px-4 text-primary-dark">
                $20.00
                </span>
                </Link>
            </>
        )}
        </div>
    );
  }
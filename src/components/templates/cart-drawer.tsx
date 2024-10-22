'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import FloatingCartButton from '@/components/organisms/floating-cart-button';
import CartDrawerView from '@/components/templates/cart-drawer-view';
import { useParams, usePathname } from 'next/navigation';
import {PAGES as routes} from '@/config/pages';
import {getCart} from '@/server/actions/cart.action';
import { Cart, CartWithFiles } from '@/db/schema';
import { User } from 'lucia';

const Drawer = dynamic(() => import('rizzui').then((module) => module.Drawer), {
  ssr: false,
});


export default function CartDrawer({cart, user, cartWithFiles}: {cart: Cart|null, user: User, cartWithFiles: CartWithFiles | null}) {
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  // list of included pages
  const includedPaths: string[] = [
    routes.DASHBOARD.SHOP,
    routes.DASHBOARD.SHOP_DETAILS(params?.id as string),
  ];

  const isPathIncluded = includedPaths.some((path) => pathname === path);
  const items  = cartWithFiles?.fileDetails
  const totalItems = cart?.fileIds?.length ?? 0;

//   const {
//     totalItems,
//     items,
//     removeItemFromCart,
//     clearItemFromCart,
//     total,
//     addItemToCart,
//   } = useCart();

  return (
    <>
      {isPathIncluded ? (
        <FloatingCartButton
          onClick={() => setOpenCartDrawer(true)}
          className="top-1/2 -translate-y-1/2 bg-primary dark:bg-primary"
          totalItems={totalItems}
        />
      ) : null}
      <Drawer
        isOpen={openCartDrawer ?? false}
        onClose={() => setOpenCartDrawer(false)}
        className="z-[9999]"
      >
        <CartDrawerView
            items={items}
            total={totalItems}
            setOpenCartDrawer={setOpenCartDrawer}
            user={user}
            cart={cart}
        //   clearItemFromCart={clearItemFromCart}
        //   removeItemFromCart={removeItemFromCart}
        //   addItemToCart={addItemToCart}
        />
      </Drawer>
    </>
  );
}

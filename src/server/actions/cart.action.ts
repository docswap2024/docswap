"use server"
import { CartService } from '@/server/service/cart.service';
import { revalidateTag } from 'next/cache';
import { handleServerError } from '@/lib/utils/error';

export const addToCart = async (fileId: string, flag: boolean, userId: string) => {
    try {
      console.log(fileId, userId);
      const cart = await CartService.addToCart(fileId, flag, userId);
      revalidateTag('get-cart');
      revalidateTag('get-all-carts');
      return cart;
    } catch (error) {
      return handleServerError(error);
    }
};

export const getCart = async (userId: string) => {
    return await CartService.getCart(userId);
};
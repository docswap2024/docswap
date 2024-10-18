import { carts as CartsModel, Cart} from '@/db/schema';
import { db } from '@/db';
import { eq, sql, count as sqlCount } from 'drizzle-orm';
import { getCart } from '../actions/cart.action';

type CartsPromise = Promise<Cart | undefined>;

export const CartService = {
    addToCart: async (fileId: string, flag: boolean, userId: string): CartsPromise => {
        console.log('addTocart');
        console.log(fileId, userId);
        const existingCart = await db
            .select()
            .from(CartsModel)
            .where(eq(CartsModel.userId, userId))
            .limit(1);

        if (existingCart.length === 0) {
            // If no cart exists for the user, insert a new cart with the fileId
            const [newCart] = await db
                .insert(CartsModel)
                .values({
                userId,
                fileIds: [fileId] // Add the initial fileId
                })
                .returning();
            
            console.log('Inserted new cart:', newCart);
            return newCart;
        } else {
            // If the cart exists, update the fileIds array
            const query = db
              .update(CartsModel)
              .set({
                fileIds: flag
                  ? sql`array_append(COALESCE(file_ids, '{}'), ${fileId})`
                  : sql`array_remove(COALESCE(file_ids, '{}'), ${fileId})`
              })
              .where(eq(CartsModel.userId, userId))
              .returning();
      
            const [updatedCart] = await query;
      
            console.log('Updated cart:', updatedCart);
      
            // If the fileIds array becomes empty, delete the cart
            const fileIdsCount = await db
              .select({
                count: sql`array_length(${CartsModel.fileIds}, 1)`
              })
              .from(CartsModel)
              .where(eq(CartsModel.userId, userId))
              .limit(1);
      
            if (fileIdsCount[0].count === 0) {
              await db
                .delete(CartsModel)
                .where(eq(CartsModel.userId, userId));
              
              console.log('Cart deleted because fileIds is empty');
              return undefined;
            }
            return updatedCart;
        }

    },
    getCart: async (userId: string) => {
        return await db.query.carts.findFirst({
            where: eq(CartsModel.userId, userId),
        });
    }
};

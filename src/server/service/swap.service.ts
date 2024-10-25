import 'server-only';

import { Swap, NewSwap, swap as swapModel, users } from '@/db/schema';
import { db } from '@/db';
import {
    and,
    eq,
    getTableColumns,
    count as sqlCount,
    SQLWrapper,
  } from 'drizzle-orm';

export const SwapService = {
    uploadSwapDocument: async (data: NewSwap[]) => {
        return await db.insert(swapModel).values(data).returning();
    },
    getSwapDocuments: async (
        options: {
          userId?: string;
        }
      ): Promise<{ swapDocuments: Swap[]; count: number }> => {
        const conditions: SQLWrapper[] = [];
        if (options?.userId) {
            conditions.push(eq(swapModel.userId, options.userId));
        }
        

        const { swapDocuments, count }: { swapDocuments: Swap[]; count: number } =
          await db.transaction(async (db): Promise<any> => {
            const where = and(...conditions);
            const swapDocuments = await db
              .select({
                ...getTableColumns(swapModel),
                user: { name: users.name },
              })
              .from(swapModel)
              .leftJoin(users, eq(swapModel.userId, users.id))
              .where(where)
    
            const [fileCount] = await db
              .select({ count: sqlCount() })
              .from(swapModel)
              .where(where);
            const count = fileCount.count;
            return {
              swapDocuments,
              count,
            };
          });
    
        return {
          swapDocuments,
          count,
        };
      },
}
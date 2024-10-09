import 'server-only';

import { db } from '@/db';

import {
  CommentType,
  Parcel,
  ParcelFolder,
  ecommerceParcels,
  ecommerceParcels as filesModel,
  NewParcel,
} from '@/db/schema';

import { createId } from '@paralleldrive/cuid2';
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNull,
  not,
  sql,
  count as sqlCount,
  SQLWrapper,
} from 'drizzle-orm';

import { FileSortType, SortOrderType } from '@/config/sorting';
import {
  distinctOn,
  inJsonArray,
  jsonAggBuildObject,
} from '@/lib/utils/query-helpers';

type ParcelsPromise = Promise<Parcel | undefined>;

export enum FolderSizeUpdateType {
  increase = 1,
  decrease = 0,
}

export const ParcelsService = {

  getParcels: async (
    params: {
      size?: number;
      page?: number;
      search?: string;
      sort?: FileSortType;
      order?: SortOrderType;
      type?: string;
    },
    options: {
      allFiles?: boolean;
      excludeByType?: string;
    }
  ): Promise<{ parcels: Parcel[]; count: number }> => {
    const size = Number(params.size);
    const page = params.page ? Number(params.page) - 1 : 0;
    const search = params.search || '';
    const sort = params.sort || 'updatedAt';
    const order = params.order || 'desc';
    const type = params.type || '';
    const excludeType = options.excludeByType || '';

    const conditions: SQLWrapper[] = [];
    if (excludeType) {
      conditions.push(not(eq(filesModel.type, excludeType)));
    }

    if (search) {
      conditions.push(ilike(filesModel.name, `%${search.toLowerCase()}%`));
    }

    if (type) {
      conditions.push(eq(filesModel.type, type));
    }


    const { parcels, count }: { parcels: Parcel[]; count: number } =
      await db.transaction(async (db): Promise<any> => {
        if (!options?.allFiles) {
          conditions.push(isNull(filesModel.parentId));
        }
        const where = and( ...conditions);

        const sortBy =
          sort === 'name'
            ? filesModel.name
            : sort === 'size'
              ? filesModel.fileSize
              : filesModel.updatedAt;

        const orderBy = order === 'asc' ? asc(sortBy) : desc(sortBy);
        const parcels = await db
          .select({
            ...getTableColumns(filesModel),
          })
          .from(filesModel)
          .where(where)
          .orderBy(orderBy)
          .limit(size)
          .offset(page * size);

        const [fileCount] = await db
          .select({ count: sqlCount() })
          .from(filesModel)
          .where(where)
        const count = fileCount.count;
        return {
          parcels,
          count,
        };
      });

    return {
      parcels,
      count,
    };
  },

  updateFolderSize: async (
    parentId: string | null = '',
    fileSize: number = 0,
    folderUpdateType: FolderSizeUpdateType = FolderSizeUpdateType.increase
  ) => {
    if (!parentId) return;
    const sizeChange =
      folderUpdateType === FolderSizeUpdateType.increase ? fileSize : -fileSize;
    const updateQuery = folderUpdateType
      ? sql`
      UPDATE files 
      SET file_size = file_size + ${fileSize} 
      WHERE id = ${parentId}
    `
      : sql`
      UPDATE files 
      SET file_size = 
          CASE 
              WHEN file_size + ${sizeChange} < 0 THEN 0 
              ELSE file_size + ${sizeChange} 
          END
      WHERE id = ${parentId}
    `;
    await db.execute(updateQuery);

    const folders = await db
      .select()
      .from(filesModel)
      .where(eq(filesModel.id, parentId));

    const parent = folders[0];
    if (parent && parent.parentId) {
      await ParcelsService.updateFolderSize(
        parent.parentId,
        fileSize,
        folderUpdateType
      );
    }
  },

  getAll: async (
  ): Promise<ParcelFolder[]> => {
    let where: any;
    where = and(
      eq(filesModel.type, 'folder'),
    );
    return await db.query.ecommerceParcels.findMany({
      where,
      orderBy: [asc(filesModel.name)],
    });
  },

  find: async (id: string): ParcelsPromise => {
    return await db.query.ecommerceParcels.findFirst({
      where: (files, { eq }) => eq(files.id, id),
    });
  },

  getFolders: async (
    params: {
      size?: number;
      page?: number;
      search?: string;
      sort?: FileSortType;
      order?: SortOrderType;
      type?: string;
    },
    options?: {
      parentId?: string | null;
      allFiles?: boolean;
    }
  ): Promise<{ parcels: Parcel[]; count: number; breadcrumbs: any }> => {
    const size = Number(params.size) || 10;
    const page = params.page ? Number(params.page) - 1 : 0;
    const search = params.search || '';
    const sort = params.sort || 'name';
    const order = params.order || 'asc';
    const type = params.type || '';

    const conditions: SQLWrapper[] = [];

    if (search) {
      conditions.push(ilike(filesModel.name, `%${search.toLowerCase()}%`));
    }

    if (type) {
      conditions.push(eq(filesModel.type, type));
    }

    if (options?.parentId) {
      conditions.push(eq(filesModel.parentId, options.parentId));
    }

    const where = and(...conditions);

    const {
      parcels,
      count,
      breadcrumbs,
    }: { parcels: Parcel[]; count: number; breadcrumbs: any } =
      await db.transaction(async (db): Promise<any> => {
        if (!options?.allFiles) {
          conditions.push(isNull(filesModel.parentId));
        }

        const sortBy =
          sort === 'name'
            ? filesModel.name
            : sort === 'size'
              ? filesModel.fileSize
              : filesModel.updatedAt;

        const orderBy = order === 'asc' ? asc(sortBy) : desc(sortBy);
        const parcels = await db
          .select({
            ...getTableColumns(filesModel),
          })
          .from(filesModel)
          .where(where)
          .orderBy(orderBy)
          .limit(size)
          .offset(page * size);

        const [fileCount] = await db
          .select({ count: sqlCount() })
          .from(filesModel)
          .where(where)
        const count = fileCount.count;

        const raw = await db.execute(
          sql`WITH RECURSIVE DirectoryPath AS (
              SELECT id, name, parent_id, type
              FROM ecommerce_parcels
              WHERE id = ${options?.parentId}
              UNION ALL
              SELECT f.id, f.name, f.parent_id, f.type
              FROM ecommerce_parcels AS f
              JOIN DirectoryPath AS dp ON dp.parent_id = f.id
            )
            SELECT id, name, type
            FROM DirectoryPath`
        );

        const breadcrumbs = raw.rows.reverse();
        console.log(breadcrumbs);
        return {
          parcels,
          count,
          breadcrumbs,
        };
      });

    return {
      parcels,
      count,
      breadcrumbs,
    };
  },

  getParcelById: async (id: string) => {
    return await db.query.ecommerceParcels.findFirst({
      where: eq(filesModel.id, id),
    });
  },
};

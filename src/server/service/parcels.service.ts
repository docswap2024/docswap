import 'server-only';

import { db } from '@/db';

import {
  CommentType,
  Parcel,
  CompleteParcel,
  ParcelFolder,
  ecommerceParcels,
  ecommerceParcels as filesModel,
  NewParcel,
  users as usersModel,
  users,
} from '@/db/schema';

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

import { ShopSortType, SortOrderType } from '@/config/sorting';

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
      sort?: ShopSortType;
      order?: SortOrderType;
      type?: string;
    },
    options: {
      allFiles?: boolean;
      excludeByType?: string;
    }
  ): Promise<{ parcels: CompleteParcel[]; count: number }> => {
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


    const { parcels, count }: { parcels: CompleteParcel[]; count: number } =
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
              : sort === 'subArea'
              ? filesModel.subArea
              : sort === 'city'
              ? filesModel.city
              : sort === 'streetName'
              ? [filesModel.streetName, filesModel.streetNumber]
              : filesModel.updatedAt;

        const orderBy = order === 'asc' ? asc(sql`${sortBy}`) : desc(sql`${sortBy}`);

        const parcels = await db
        .select({
          ...getTableColumns(filesModel), // Select columns from the filesModel (ecommerce_parcels)
          userName: usersModel.name,  // Select the username column from the usersModel
        })
        .from(filesModel)
        .leftJoin(usersModel, eq(filesModel.userId, usersModel.id))  // Join usersModel on user_id
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
      sort?: ShopSortType;
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
              : sort === 'subArea'
              ? filesModel.subArea
              : filesModel.updatedAt;

        const orderBy = order === 'asc' ? asc(sortBy) : desc(sortBy);
        const parcels = await db
          .select({
            ...getTableColumns(filesModel), // Select columns from the filesModel (ecommerce_parcels)
            userName: usersModel.name,  // Select the username column from the usersModel
          })
          .from(filesModel)
          .leftJoin(usersModel, eq(filesModel.userId, usersModel.id))  
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

  getParcelById: async (id: string) : Promise<{ file: CompleteParcel; }>=> {
    const { file } = await db.transaction(async (db): Promise<any> => {
      const files = await db
        .select({
          ...getTableColumns(filesModel), // Select columns from the filesModel (ecommerce_parcels)
          userName: usersModel.name,      // Select the username column from the usersModel
        })
        .from(filesModel)
        .leftJoin(usersModel, eq(filesModel.userId, usersModel.id)) // Assuming filesModel has a userId field
        .where(eq(filesModel.id, id)) // Adding the where clause to match the file ID
        .limit(1); // Limit the query to 1 result
    
      // Return the first file from the result array
      return { file: files[0] };
    });
    return { file };

    // return await db.query.ecommerceParcels.findFirst({
    //   where: eq(filesModel.id, id),
    // });
  },

  getParcelByFileName: async (fileName: string) => {
    return await db.query.ecommerceParcels.findFirst({
      where: eq(filesModel.fileName, fileName),
    });
  },

  makeFavourite: async (fileId: string, flag: boolean, userId: string): ParcelsPromise => {
    console.log('makeFavourite');
    console.log(fileId, flag, userId);
    const query = db
      .update(filesModel)
      .set({
        favouritedBy: flag
          ? sql`array_append(COALESCE(favourited_by, '{}'), ${userId})`
          : sql`array_remove(COALESCE(favourited_by, '{}'), ${userId})`
      })
      .where(eq(filesModel.id, fileId))
      .returning();

    console.log(query.toSQL()); // Check the query
    const [file] = await query;

    console.log(file);

    return file;
  },

};

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ecommerceParcels } from '../schema';

export const addParcelSeeder = async (
    db: NodePgDatabase<Record<string, never>>
) => {
    try {    
        const parcel = {
            name: 'Parcel',
            description: 'Parcel',
            fileName: 'Parcel',
            mime: 'Parcel',
            fileSize: 0,
            userId: 'Parcel',
            parentId: null,
            type: 'Parcel',
            streetNumber: 'Parcel',
            streetName: 'Parcel',
            subArea: 'Parcel',
            city: 'Parcel',
            stateProvince: 'Parcel',
            postalCode: 'Parcel',
            country: 'Parcel',
            extension: 'Parcel',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const [insertSettings] = await db.insert(ecommerceParcels).values(parcel).returning();
        console.log(`✅ Added Parcel\n`);
    }
    catch (error) {
        console.error('Error inserting user and assigning role:', error);
    }
};
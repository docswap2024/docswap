import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ecommerceParcels } from '@/db/schema';
import axios from 'axios';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Console } from 'console';
import { createId } from '@paralleldrive/cuid2';

interface ImageInfo {
    streetName: string;
    imageName: string;
    imagePath: string;
}

// Function to get the file size from a URL
async function getFileSize(url: string) {
    try {
        // Make a HEAD request to the URL
        const response = await axios.head(url);

        // Extract the Content-Length header which holds the file size in bytes
        const fileSize = response.headers['content-length'];

        if (fileSize) {
            return parseInt(fileSize, 10);  // Convert to number
        } else {
            console.log('Content-Length header is not present.');
            return 0;
        }
    } catch (error) {
        console.error(`Error fetching file size: ${error}`);
        return 0;
    }
}

// Function to check if a URL is valid
const checkUrl = async (url: string) : Promise<boolean> => {

    try {
        const encodedUrl = encodeURIComponent(url); 
        const response = await axios.get(`${process.env.API_GATEWAY_URL_PROD}/imageUrl/getImageUrl?URL=${encodedUrl}`);
        if (response.data === 'Image URL is valid') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

// Function to format the file name
const formatParcelName = (civicAddress: string) => {
    // Split the address into parts by space
    const addressParts = civicAddress.split(' ');

    if (addressParts.length > 1) {
        const streetNumber = addressParts[0]; // First part is the street number
        const streetName = addressParts[1].toLowerCase(); // Second part is the street name, convert to lowercase

        // Capitalize the first letter of the street name
        const formattedStreetName = streetName.charAt(0).toUpperCase() + streetName.slice(1);

        // Combine the street number and formatted street name
        return `${streetNumber}-${formattedStreetName}`;
    }

    return ''; // Return an empty string if the format doesn't match
};

// Function to format the street number
const formatStreetNumber = (civicAddress: string) => {
    // Split the address into parts by space
    const addressParts = civicAddress.split(' ');

    if (addressParts.length > 1) {
        const streetNumber = addressParts[0]; // First part is the street number
        const streetName = addressParts[1].toLowerCase(); // Second part is the street name, convert to lowercase

        // Capitalize the first letter of the street name
        const formattedStreetName = streetName.charAt(0).toUpperCase() + streetName.slice(1);

        // Combine the street number and formatted street name
        return `${streetNumber}`;
    }

    return ''; // Return an empty string if the format doesn't match
};

// Function to format the street name
const formatStreetName = (civicAddress: string) => {
    // Split the address into parts by space
    const addressParts = civicAddress.split(' ');

    if (addressParts.length > 1) {
        const streetNumber = addressParts[0]; // First part is the street number
        const streetName = addressParts[1].toLowerCase(); // Second part is the street name, convert to lowercase

        // Capitalize the first letter of the street name
        const formattedStreetName = streetName.charAt(0).toUpperCase() + streetName.slice(1);

        // Combine the street number and formatted street name
        return `${formattedStreetName}`;
    }

    return ''; // Return an empty string if the format doesn't match
};

// export const addParcelSeeder = async (
//     db: NodePgDatabase<Record<string, never>>
// ) => {
//     let validParcels: any[] = [];
//     let imageList: ImageInfo[] = [];

//     try {
//         const apiUrl = 'https://e7aogwfp91.execute-api.us-west-2.amazonaws.com/prod/parcels/getAllparcels';
//         const { data } = await axios.get(apiUrl);
//         const list = await Promise.all(data.map(async (parcel: any) => {
//             if (parcel.CivicAddress.Value !== null && parcel.CivicAddress.Value.trim() !== '' && parcel.CivicAddress.Value.split(' ').length > 1) {
//                 //Split the CivicAddress and modify it
//                 var civic_address = parcel.CivicAddress.Value.split(' ');

//                 civic_address[1] = civic_address[1][0].toUpperCase() + civic_address[1].slice(1).toLowerCase();
//                 // Build the image URL
//                 var bucket = 'https://sr-webimages-002.s3.us-west-2.amazonaws.com/Streetview/';
//                 var card_image = `${bucket}${civic_address[1]}/card/${civic_address[0]}-${civic_address[1]}.jpg`;
            
//                 // Check if the URL is valid
//                 const isValid = await checkUrl(card_image);
            
//                 // Return the parcel if the image URL is valid, otherwise return null
//                 return isValid ? parcel : null;
              
//             }
//         }));
        
//         // Filter out any null results (invaxlid images)
//         validParcels = list.filter(parcel => parcel !== null);

//         console.log("Images from DynamoDB" , validParcels.length);

//         try {
//            // Get all existing fileNames from the database
//             const fileNames = await db.select({ fileName: ecommerceParcels.fileName }).from(ecommerceParcels);

//             // Loop through all valid parcels
//             for (let parcel of validParcels) {
//                 if (parcel) {
//                     // Generate the fileName based on the parcel's civic address
//                     const fileName = `Streetview/${formatStreetName(parcel.CivicAddress.Value)}/landing/${formatParcelName(parcel.CivicAddress.Value)}.jpg`;
//                     const fileSize = await getFileSize(process.env.NEXT_PUBLIC_SHOP_URL + "/" + fileName);
//                     console.log(fileSize);
//                     // Check if the fileName already exists in the database
//                     if (fileNames.find(item => item.fileName === fileName)) {
//                         console.log(`❗️Parcel with fileName ${fileName} already exists. Skipping...`);
//                     }  else {

//                         // If the fileName is unique, insert the parcel into the database
//                         const parcelData = {
//                             name: formatParcelName(parcel.CivicAddress.Value),
//                             description: 'Landing Image',
//                             fileName,  // Using the unique fileName
//                             mime: 'image/jpeg',
//                             fileSize: fileSize,
//                             userId: 'j2uod9bfpdh8rt69s10tiel4',
//                             parentId: null,
//                             type: 'image',
//                             streetNumber: formatStreetNumber(parcel.CivicAddress.Value),
//                             streetName: formatStreetName(parcel.CivicAddress.Value),
//                             subArea: parcel.Neighbourhood.Value,
//                             city: 'Squamish',
//                             stateProvince: 'British Columbia',
//                             postalCode: parcel.PostalCode.Value,
//                             country: 'Canada',
//                             extension: 'jpeg',
//                             createdAt: new Date(),
//                             updatedAt: new Date(),
//                             pid: parcel.PID.Value,
//                             propertyType: 'Detached Property',
//                         };

//                            // Insert the parcel into the database
//                         const [insertSettings] = await db.insert(ecommerceParcels).values(parcelData).returning();
//                         console.log(`✔️Parcel with fileName ${fileName} added`);
        
//                     }
//                 }
                
//             }
//             console.log("✅ All valid parcels have been processed.");
           
//         } catch (error) {
//             console.error('Error inserting parcels into the database:', error);
//         }

//         // try {
//         //     const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY as string;
//         //     const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID as string;
//         //     const endpoint = process.env.CLOUDFLARE_ENDPOINT as string;
//         //     const s3Client = new S3Client({
//         //         region: 'auto',
//         //         endpoint: endpoint,
//         //         credentials: {
//         //             accessKeyId,
//         //             secretAccessKey
//         //         },
//         //     });

//         //     const listImagesInBucket = async (bucketName: string) => {
//         //         console.log('Starting to list images in the R2 bucket');
//         //         const imageList: ImageInfo[] = [];
//         //         let continuationToken: string | undefined = undefined;
            
//         //         try {
//         //             do {
//         //                 const command: ListObjectsV2Command = new ListObjectsV2Command({
//         //                     Bucket: bucketName,
//         //                     Prefix: 'Streetview/', // Start from the base directory
//         //                     ContinuationToken: continuationToken // Set the continuation token if available
//         //                 });
                    
//         //                 const response = await s3Client.send(command);
//         //                 if (response.Contents) {
//         //                     response.Contents.forEach((item) => {
//         //                         if (item.Key) {
//         //                             const keyParts = item.Key.split('/');
//         //                             // Check if the item is in the landing directory
//         //                             if (keyParts[2] === 'landing') {
//         //                                 const streetName = keyParts[1]; // Extract street name from the path
//         //                                 const imageName = keyParts[3].replace('.jpg', ''); // Extract image name
//         //                                 const imagePath = `https://${bucketName}.r2.cloudflarestorage.com/${item.Key}`; // Construct full URL
            
//         //                                 // Store the image details in the imageList array
//         //                                 imageList.push({
//         //                                     streetName,
//         //                                     imageName,
//         //                                     imagePath,
//         //                                 });
//         //                             }
//         //                         }
//         //                     });
//         //                 }
            
//         //                 // Check if there are more objects to retrieve
//         //                 continuationToken = response.NextContinuationToken;
//         //             } while (continuationToken); // Continue fetching while there are more objects to retrieve
            
//         //         } catch (error) {
//         //             console.error('Error listing images:', error);
//         //         }
            
//         //         return imageList;
//         //     };        
    
//         //     // Call the function and get all the image details
//         //     const bucketName = 'shop'; // Replace with your R2 bucket name
//         //     console.log('Listing images in the R2 bucket...');
//         //     imageList = await listImagesInBucket(bucketName);
//         //     console.log('Image list:', imageList.length);
//         // } catch (error) {
//         //     console.error('Error inserting parcels into the database:', error);
//         // }
//     } catch (error) {

//         console.error('Error inserting user and assigning role:', error);
//     }
// }

export const addParcelSeeder = async (
    db: NodePgDatabase<Record<string, never>>
) => {
    let validParcels: any[] = [];
    let imageList: ImageInfo[] = [];

    try {
        const apiUrl = 'https://e7aogwfp91.execute-api.us-west-2.amazonaws.com/prod/parcels/getAllparcels';
        const { data } = await axios.get(apiUrl);
        const list = await Promise.all(data.map(async (parcel: any) => {
            if (parcel.CivicAddress.Value !== null && parcel.CivicAddress.Value.trim() !== '' && parcel.CivicAddress.Value.split(' ').length > 1) {
                //Split the CivicAddress and modify it
                var civic_address = parcel.CivicAddress.Value.split(' ');

                civic_address[1] = civic_address[1][0].toUpperCase() + civic_address[1].slice(1).toLowerCase();
                // Build the image URL
                var bucket = 'https://sr-webimages-002.s3.us-west-2.amazonaws.com/Streetview/';
                var card_image = `${bucket}${civic_address[1]}/card/${civic_address[0]}-${civic_address[1]}.jpg`;
            
                // Check if the URL is valid
                const isValid = await checkUrl(card_image);
            
                // Return the parcel if the image URL is valid, otherwise return null
                return isValid ? parcel : null;
              
            }
        }));
        
        // Filter out any null results (invaxlid images)
        validParcels = list.filter(parcel => parcel !== null);

        console.log("Images from DynamoDB" , validParcels.length);

        try {
           // Get all existing fileNames from the database
            const fileNames = await db.select({ fileName: ecommerceParcels.fileName }).from(ecommerceParcels);

            // Loop through all valid parcels
            for (let parcel of validParcels) {
                if (parcel) {
                    // Generate the fileName based on the parcel's civic address
                    const fileName = `Streetview/${formatStreetName(parcel.CivicAddress.Value)}/landing/${formatParcelName(parcel.CivicAddress.Value)}.jpg`;
                    const fileSize = await getFileSize(process.env.NEXT_PUBLIC_SHOP_URL + "/" + fileName);
                    console.log(fileSize);
                    // Check if the fileName already exists in the database
                    if (fileNames.find(item => item.fileName === fileName)) {
                        console.log(`❗️Parcel with fileName ${fileName} already exists. Skipping...`);
                    }  else {
                        const parcelFolderID = createId();

                        const folder = {
                            id: parcelFolderID,
                            name: formatParcelName(parcel.CivicAddress.Value),
                            description: 'Property Documents',
                            fileName: formatParcelName(parcel.CivicAddress.Value),  // Using the unique fileName
                            mime: null,
                            fileSize: fileSize,
                            userId: 'j2uod9bfpdh8rt69s10tiel4',
                            parentId: null,
                            type: 'folder',
                            streetNumber: formatStreetNumber(parcel.CivicAddress.Value),
                            streetName: formatStreetName(parcel.CivicAddress.Value),
                            subArea: parcel.Neighbourhood.Value,
                            city: 'Squamish',
                            stateProvince: 'British Columbia',
                            postalCode: parcel.PostalCode.Value,
                            country: 'Canada',
                            extension: null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            pid: parcel.PID.Value,
                            propertyType: 'Detached Property',
                        }
                        const [parcelFolderSetting] = await db.insert(ecommerceParcels).values(folder).returning();

                        const ImagesFolderID = createId();
                        const imagesFolder = {
                            id: ImagesFolderID,
                            name: "Images",
                            description: 'Property Images',
                            fileName: "Images",  // Using the unique fileName
                            mime: null,
                            fileSize: fileSize,
                            userId: 'j2uod9bfpdh8rt69s10tiel4',
                            parentId: parcelFolderID,
                            type: 'folder',
                            streetNumber: formatStreetNumber(parcel.CivicAddress.Value),
                            streetName: formatStreetName(parcel.CivicAddress.Value),
                            subArea: parcel.Neighbourhood.Value,
                            city: 'Squamish',
                            stateProvince: 'British Columbia',
                            postalCode: parcel.PostalCode.Value,
                            country: 'Canada',
                            extension: null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            pid: parcel.PID.Value,
                            propertyType: 'Detached Property',
                        }
                        const [imagesFolderSetting] = await db.insert(ecommerceParcels).values(imagesFolder).returning();

                        // If the fileName is unique, insert the parcel into the database
                        const parcelData = {
                            name: formatParcelName(parcel.CivicAddress.Value),
                            description: 'Landing Image',
                            fileName,  // Using the unique fileName
                            mime: 'image/jpeg',
                            fileSize: fileSize,
                            userId: 'j2uod9bfpdh8rt69s10tiel4',
                            parentId: ImagesFolderID,
                            type: 'image',
                            streetNumber: formatStreetNumber(parcel.CivicAddress.Value),
                            streetName: formatStreetName(parcel.CivicAddress.Value),
                            subArea: parcel.Neighbourhood.Value,
                            city: 'Squamish',
                            stateProvince: 'British Columbia',
                            postalCode: parcel.PostalCode.Value,
                            country: 'Canada',
                            extension: 'jpeg',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            pid: parcel.PID.Value,
                            propertyType: 'Detached Property',
                        };

                           // Insert the parcel into the database
                        const [insertSettings] = await db.insert(ecommerceParcels).values(parcelData).returning();
                        console.log(`✔️Parcel with fileName ${fileName} added`);
        
                    }
                }
                
            }
            console.log("✅ All valid parcels have been processed.");
           
        } catch (error) {
            console.error('Error inserting parcels into the database:', error);
        }
    } catch (error) {

        console.error('Error inserting user and assigning role:', error);
    }
}
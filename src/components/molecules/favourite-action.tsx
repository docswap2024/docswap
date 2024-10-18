import { CompleteParcel } from '@/db/schema';
import { User } from 'lucia';
import { handleFavourite } from '@/lib/utils/favourite';


// export const handleFavourite = async (file: CompleteParcel, user: User) => {
//     const currentFavStatus = file.favouritedBy?.includes(user.id) || false;
//     console.log('currentFavStatus', currentFavStatus);
  
//     toast.promise(() => makeParcelFavourite(file.id, !currentFavStatus, user.id), {
//       loading: currentFavStatus
//         ? `${
//             file?.type === 'folder' ? 'Folder' : 'File'
//           } removing from favourite...`
//         : `${
//             file?.type === 'folder' ? 'Folder' : 'File'
//           } adding to favourite...`,
//       success: () => {
//         // setIsLiked(!currentFavStatus);
//         return currentFavStatus
//           ? `${
//               file?.type === 'folder' ? 'Folder' : 'File'
//             } removed from favourite`
//           : `${file?.type === 'folder' ? 'Folder' : 'File'} added to favourite`;
//       },
//       error: MESSAGES.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
//     });
// };


export function FavouriteAction({
  file,
  user,
}: {
  file: CompleteParcel;
  user: User;
}) {

    return (
        <button onClick={(e) => 
            {
              e.stopPropagation();
              handleFavourite(file, user);
            }
          } className="p-1 transition transform hover:-translate-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={file.favouritedBy?.includes(user.id) ? 'red' : 'gray'} // Change fill color based on like state
              stroke="white" // White border
              strokeWidth="2" // Border thickness
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        </button>
    )
    
}
"use client" ;

import {
 CompleteSwap
} from '@/db/schema';
import { User } from 'lucia';
import { Controller, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import {  Text, Button, Input, Textarea, Switch } from 'rizzui';
import { FaEllipsisV } from "react-icons/fa";
import { acceptedMimeType, uploadFilesAndGetPaths } from '@/lib/utils/file';
import { toast } from 'sonner';
import { MESSAGES } from '@/config/messages';
import { handleError } from '@/lib/utils/error';
import { uploadSwapDocument } from '@/server/actions/swap.action';
import prettyBytes from 'pretty-bytes';
import {
    UploadSwapInput,
    UploadSwapSchema,
} from '@/lib/validations/swap.schema';
import { Form } from '@/components/atoms/forms';
import isEmpty from 'lodash/isEmpty';
import {  Flex } from '@/components/atoms/layout';
import { Uploader } from '@/components/molecules/uploader/uploader';

export const SwapDocs = ({
    user,
    swapDocuments,
    count
} : {
    user: User,
    swapDocuments: CompleteSwap[];
    count: number;
}) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [onMarketplace, setOnMarketplace] = useState<boolean>(false);
    const [reset, setReset] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [allProgress, setAllProgress] = useState<{
        [key: number]: {
          progress: number;
          file: string;
          signal?: AbortController;
        };
      }>({});


    // Function to handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("event.target.files")
        const files = event.target.files;
        console.log(files)
        if (!files) return;
        const file = files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleProgress = (index: number, file: string) => {
        return (progress: number, signal?: AbortController) => {
          setAllProgress((prev) => ({
            ...prev,
            [index]: {
              progress,
              file,
              signal,
            },
          }));
        };
    };

    const onSubmit: SubmitHandler<UploadSwapInput> = async (
        inputs: UploadSwapInput
    )=> {
        try {
          if (isEmpty(inputs.file)) return;
          setIsUploading(true);
    
          const uploadData = await uploadFilesAndGetPaths(
            inputs.file,
           'swap',
            handleProgress,
            ''
          );
          const uploadDataWithFormDetails = uploadData.map((fileData) => ({
            ...fileData,                       // Spread the existing file data
            address: inputs.address,                           // Add form field 'address'
            tags: inputs.tags,                              // Add form field 'tags'
            description: inputs.description,                       // Add form field 'description'
            onMarketplace: inputs.onMarketplace,  // Add marketplace option
            price: inputs.price,  // Add price if applicable
          }));
            console.log(uploadDataWithFormDetails)
            await uploadSwapDocument(uploadDataWithFormDetails);
            setIsUploading(false);
            setReset({ file: [], address: '', tags: '', description: '', onMarketplace: false, price: '' });
            toast.success(MESSAGES.FILES_UPLOAD_COMPLETED);
        } catch (error) {
          setIsUploading(false);
          handleError(error);
        }
    };

    // Function to add the uploaded document details to the swap list
    // const handleAddToList = async () => {
    //     try {
    //         if (!uploadedFile || !address || !tags || !description || marketplaceOption === null || (marketplaceOption === 'yes' && !price)) {
    //             return; // Ensure all fields are filled before submission
    //         }

    //         const uploadData = await uploadFilesAndGetPaths(
    //           [uploadedFile],
    //           'swap',
    //           handleProgress,
    //           ''
    //         );
    //         const uploadDataWithFormDetails = uploadData.map((fileData) => ({
    //             ...fileData,                       // Spread the existing file data
    //             address,                           // Add form field 'address'
    //             tags,                              // Add form field 'tags'
    //             description,                       // Add form field 'description'
    //             marketplace: marketplaceOption === 'yes',  // Add marketplace option
    //             price: marketplaceOption === 'yes' ? price : null,  // Add price if applicable
    //           }));
          
    //         console.log(uploadDataWithFormDetails)
    //         await uploadSwapDocument(uploadDataWithFormDetails);
      
    //         setIsUploading(false);
    //         setUploadedFile(null); // Clear the uploaded file
    //         setAddress(''); // Reset address
    //         setTags(''); // Reset tags
    //         setDescription(''); // Reset description
    //         setMarketplaceOption(null); // Reset marketplace option
    //         setPrice(''); // Reset price
    //         setIsUploading(true);

    //         toast.success(MESSAGES.FILES_UPLOAD_COMPLETED);
    //       } catch (error) {
    //         setIsUploading(false);
    //         handleError(error);
    //       }
    // };

    // Function to delete an item from the swap list
    const handleDelete = (index: number) => {
        // const updatedList = swapList.filter((_, i) => i !== index);
        // setSwapList(updatedList);
    };

    const [actionMenu, setActionMenu] = useState<number | null>(null); // State to manage the open action menu

    // Function to toggle the action menu
    const toggleActionMenu = (index: number) => {
        console.log("toggle ",  index);
        // Toggle the action menu for the specified index
        setActionMenu(actionMenu === index ? null : index);
    };

    // Function to handle edit action
    const handleEdit = (index: number) => {
        // Implement the logic for editing an item in swapList
        // This could involve opening a modal or redirecting to an edit page
        console.log('Edit item at index:', index);
    };

    
    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-0">
        {/* Full Width Form */}
        <div className="bg-white dark:bg-steel-700 dark:shadow-[0_3px_18px_rgba(0,0,0,0.1)] dark:border-steel-600/50 dark:border dark:text-white p-6 rounded-lg shadow-lg text-gray-800 mb-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Upload Your Document</h3> 
            <Form<UploadSwapInput>
            validationSchema={UploadSwapSchema}
            resetValues={reset}
            onSubmit={onSubmit}
            >
                {({
                register,
                control,
                setValue,
                formState: { errors, defaultValues }, watch,
                }) => (
                    <Flex direction="col" align="stretch" className="gap-5">
                    <Controller
                    control={control}
                    name="file"
                    render={({ field: { value, onChange } } ) => {
                        return (
                            <Flex direction="col" align="stretch">
                                <Uploader
                                onChange={(file: File) => {
                                    setAllProgress({});
                                    setUploadedFile(file);
                                    onChange(file);
                                }}
                                placeholder="Upload your file"
                                defaultValue={defaultValues?.file}
                                accept={acceptedMimeType()}
                                isUploading={!isEmpty(allProgress)}
                                />
                                <Text className="text-red text-xs mt-0.5">
                                {errors.file?.message as string}
                                </Text>
                            </Flex>
                        )
                    }}
                    />
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <Input
                                autoComplete="off"
                                type="text"
                                label="Address *"
                                labelClassName="text-custom-black font-semibold mb-2 lg:mb-4"
                                placeholder="Enter Address"
                                {...register('address')}
                                error={errors.address?.message}
                                className="[&_.rizzui-input-container]:bg-white lg:[&_.rizzui-input-container]:rounded-xl [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-12 lg:[&_.rizzui-input-container]:px-7"
                                inputClassName="[&.is-focus]:border-gray-500 [&.is-focus]:ring-2 ring-1 ring-[#CBD5E1] [&.is-focus]:ring-gray-500 [&.is-hover]:border-0 border-0 text-[#475569]"
                            />
                        </div>

                        <div>
                            <Input
                                autoComplete="off"
                                type="text"
                                label="Tags *"
                                labelClassName="text-custom-black font-semibold mb-2 lg:mb-4"
                                placeholder="Enter Tags (seperated by comma ',')"
                                {...register('tags')}
                                error={errors.tags?.message}
                                className="[&_.rizzui-input-container]:bg-white lg:[&_.rizzui-input-container]:rounded-xl [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-12 lg:[&_.rizzui-input-container]:px-7"
                                inputClassName="[&.is-focus]:border-gray-500 [&.is-focus]:ring-2 ring-1 ring-[#CBD5E1] [&.is-focus]:ring-gray-500 [&.is-hover]:border-0 border-0 text-[#475569]"
                            />
                        </div>
                    </div>
                    <Textarea
                    autoComplete="off"
                    label="Description *"
                    labelClassName="text-custom-black font-semibold mb-2 lg:mb-4"
                    placeholder="Enter a brief description of the document"
                    {...register('description')}
                    error={errors.description?.message}
                    className="lg:[&_textarea]:rounded-xl lg:[&_textarea]:py-4 lg:[&_textarea]:px-7 [&_textarea]:text-[#475569] [&_textarea]:placeholder:text-[#475569]/70 [&_textarea]:border-0 [&_textarea.is-focus]:border-1 [&_textarea.is-focus]:ring-2 [&_textarea.is-focus]:ring-gray-500 [&_textarea]:ring-[#CBD5E1]"
                    />
                    <Controller
                        control={control}
                        name="onMarketplace"
                        defaultValue={false}
                        render={({ field: { value = false, onChange } }) => {
                            return (
                            <Flex>
                               <Text className="text-custom-black font-semibold mb-2 lg:mb-4">
                                    Put Document on Marketplace?
                                </Text>
                                <Switch checked={value} onChange={onChange} />
                            </Flex>
                            );
                        }}
                    />
                    {watch('onMarketplace') && (
                            <Input
                                autoComplete="off"
                                type="number"
                                label="Price"
                                labelClassName="text-custom-black font-semibold mb-2 lg:mb-4"
                                placeholder="Enter price in CAD"
                                {...register('price')}
                                error={errors.price?.message}
                                className="[&_.rizzui-input-container]:bg-white lg:[&_.rizzui-input-container]:rounded-xl [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-12 lg:[&_.rizzui-input-container]:px-7"
                                inputClassName="[&.is-focus]:border-gray-500 [&.is-focus]:ring-2 ring-1 ring-[#CBD5E1] [&.is-focus]:ring-gray-500 [&.is-hover]:border-0 border-0 text-[#475569]"
                            />
                    )}
                    <Button
                    isLoading={isUploading}
                    type="submit"
                    size="lg"
                    className="w-full"
                  >
                    Upload
                  </Button>
                  </Flex>
                )}
            </Form>
        </div>

        <div className="bg-white dark:bg-steel-700 dark:text-white p-6 rounded-lg shadow-lg w-full">
            {swapDocuments.length > 0 ? (
                <>
                    <h3 className="text-lg font-bold mb-4">Submitted Files</h3>
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100 dark:bg-steel-600">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Swap File</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Address</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Tags</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                                    <th className='px-4 py-2 text-left text-sm font-semibold'>Size</th>

                                    <th className='px-4 py-2 text-left text-sm font-semibold'>Approved</th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {swapDocuments.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-2 text-sm">{item.name}</td>
                                        <td className="px-4 py-2 text-sm">{item.address}</td>
                                        <td className="px-4 py-2 text-sm">{item.tags}</td>
                                        <td className="px-4 py-2 text-sm">{item.description}</td>
                                        <td className="px-4 py-2 text-sm">

                                            {item.onMarketplace ? `${item.price}` : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2 text-sm">{prettyBytes(item.fileSize as number)}</td>
                                        <td className="px-4 py-2 text-sm">{item.approved}</td>
                                        <td className="px-4 py-2 text-center">
                                        <div className="relative inline-block text-left">
                                                <button
                                                    className="text-gray-600 hover:text-gray-900 focus:outline-none"
                                                    onClick={() => toggleActionMenu(index)}
                                                >
                                                    <FaEllipsisV className="w-5 h-5" />
                                                </button>
                                                {actionMenu === index && (
                                                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-steel-700 border border-gray-200 dark:border-steel-600 rounded-md shadow-lg z-10">
                                                        <button
                                                            onClick={() => handleEdit(index)}
                                                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-steel-600"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(index)}
                                                            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-steel-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </>
            ) : (
                <p className="text-gray-600">No files submitted yet.</p>
            )}
        </div>
    </div>

    );}
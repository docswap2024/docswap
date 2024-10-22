"use client" 

import {
    type Cart,
    CartWithFiles
} from '@/db/schema';
import { User } from 'lucia';
import { Box, Flex } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';
import { useState } from 'react';
import { PiTrash } from 'react-icons/pi';
import { Button } from 'rizzui';
import { TrashIcon, FolderOpen } from 'lucide-react';

export const SwapDocs = ({
    user,
    cart,
    cartWithFiles
} : {
    user: User,
    cart: Cart | null;
    cartWithFiles: CartWithFiles | null;
}) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [swapList, setSwapList] = useState<Array<{ swapFileName: string, cartFileId: string }>>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleFileSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFileId(e.target.value);
    };

    const handleAddToList = () => {
        if (uploadedFile && selectedFileId) {
            setSwapList([...swapList, { swapFileName: uploadedFile.name, cartFileId: selectedFileId }]);
            setUploadedFile(null);
            setSelectedFileId('');
        }
    };

    const handleDelete = (index: number) => {
        const updatedList = swapList.filter((_, i) => i !== index);
        setSwapList(updatedList);
    };
  
    return (
        <Flex direction="col" align="stretch" className="gap-0">
            <Flex className="gap-6 mb-3 lg:mb-8 flex-col sm:flex-row" justify="start">
                <PageHeader
                title="Swap Documents"
                description="Swap Documents with DocSwap"
                descriptionClassName="hidden"
                titleClassName="text-xl"
                className="pb-0 mb-0 md:mb-0 border-b-0"
                />
            </Flex>
             {/* Content Section with Two Columns */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Upload Section */}
                <div className="bg-white dark:dark:bg-steel-700 dark:shadow-[0_3px_18px_rgba(0,0,0,0.1)] dark:border-steel-600/50 dark:border dark:text-white p-6 rounded-lg shadow-lg text-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Upload Your Document</h3>
                    <label className="block w-full cursor-pointer">
                        <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg transition duration-200 hover:border-primary hover:bg-gray-50">
                            <FolderOpen size={18} />
                            <span className="ml-2 text-sm">Click to upload a document</span>
                        </div>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                    
                    {uploadedFile && (
                        <p className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                            <strong>Uploaded:</strong> {uploadedFile.name}
                        </p>
                    )}
                </div>
                {/* Cart Items Selection Section */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose Items from Cart to Swap</h3>
                    
                    {cart && cart?.fileIds && cart.fileIds.length > 0 ? (
                        <div className="mb-6">
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select a file from your cart
                            </label> */}
                            <select
                                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition duration-200"
                                value={selectedFileId || ''}
                                onChange={handleFileSelection}
                            >
                                <option value="">Select a file to swap</option>
                                {cart.fileIds.map((item) => (
                                    <option key={item} value={item}>
                                        File ID: {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                            Your cart is empty. Add items to your cart to swap documents.
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleAddToList}
                    disabled={!uploadedFile || !selectedFileId}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition duration-300"
                >
                    Swap Document
                </button>
            </div>

            {/* List View of Swap Files */}
            {swapList.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-4">Files to Swap</h3>
                    <ul className="space-y-4">
                        {swapList.map((item, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
                            >
                                <div>
                                    <p className="text-sm font-semibold">Swap File: {item.swapFileName}</p>
                                    <p className="text-sm text-gray-600">Cart File ID: {item.cartFileId}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 transition duration-200">
                                            <TrashIcon size={20} strokeWidth={1.75} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={handleAddToList}
                    disabled={!uploadedFile || !selectedFileId}
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition duration-300"
                >
                    Submit For Approval
                </button>
            </div>

        </Flex>
    )
}
import { Collapse } from 'rizzui';
import { PiCaretDownBold } from 'react-icons/pi';
import { cn } from '@/lib/utils/cn';
import { CompleteParcel } from '@/db/schema';
import React, { useState } from 'react';
import format from 'date-fns/format';
import prettyBytes from 'pretty-bytes';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai'; 
import { DynamicFileIcon, FileIconType } from '@/components/atoms/dynamic-file-icon';
import { FolderIcon } from '@/components/atoms/icons/folder';

interface FileNode extends CompleteParcel {
    children?: FileNode[];
}
  
interface FileTreeNodeProps {
    node: FileNode;
    level?: number; // Level to calculate the margin for nested folders
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, level = 0 }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };
    
  
    return (
        <>
            <tr className="border-b">
                <td className="p-2 flex items-center">
                    {/* Add margin only to the name based on the nesting level */}
                    <div style={{ marginLeft: `${level * 40}px` }} className="flex items-center">
                        {node.type === 'folder' && (
                        <button onClick={toggleCollapse} className="mr-2">
                            {isCollapsed ? <AiOutlineRight /> : <AiOutlineDown />}
                        </button>
                        )}
                        
                        {/* Folder or File Icon */}
                        {node.type === 'folder' ? (
                            <FolderIcon className="w-4 h-4 mr-2" />
                        ) : (
                            <DynamicFileIcon
                                className="w-4 h-4 mr-2"
                                iconType={node.type as FileIconType}
                            />
                        )}
                        
                        {/* File/Folder Name */}
                        {node.name} {node.type === 'folder' && (
                            <span className="text-gray-500 text-sm ml-1">
                                ({node.children?.length || 0})
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-4 md:px-6">{node.description}</td>
                <td className="px-4 md:px-6">{node.userName}</td>
                <td className="px-4 md:px-6">{format(node.updatedAt, 'MMM dd, yyyy')}</td>
                <td className="px-4 md:px-6">{prettyBytes(node?.fileSize as number)}</td>
                <td className="px-4 md:px-6">{node.fileName.includes('landing') ? '1920 x 870': '--'}</td>
                <td className="px-4 md:px-6">
                    {
                        node.type === 'folder' ? (
                            <span>${(node.children?.length ?? 0) * 10}</span>
                        ) : (
                            <span>$10</span>
                        )
                    }
                </td>
            </tr>

            {/* Nested Rows for Folders */}
            {!isCollapsed && node.children && node.type === 'folder' && (
            <>
                {node.children.map((child) => (
                <FileTreeNode key={child.id} node={child} level={level + 1} />
                ))}
            </>
            )}
         </>
    );
};


export const FolderContents = ({fileTree}: {fileTree: FileNode[]}) => {
    return (
        <Collapse
            className="last-of-type:border-t-0 border-b border-muted "
            defaultOpen={true}
            header={({ open, toggle }) => (
                <div
                role="button"
                onClick={toggle}
                className="flex w-full cursor-pointer items-center justify-between py-6 font-lexend text-lg font-semibold text-gray-900"
                >
                Contents
                <div className="flex shrink-0 items-center justify-center">
                    <PiCaretDownBold
                    className={cn(
                        'h-[18px] w-[18px] transform transition-transform duration-300',
                        open && 'rotate-180'
                    )}
                    />
                </div>
                </div>
            )}
        >
            <div className="-mt-2 pb-7">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th scope='col' className='text-left px-4 py-2 md:px-6 md:py-3 border'>Name</th>
                        <th scope='col' className='text-left px-4 py-2 md:px-6 md:py-3 border'>Description</th>
                        <th scope='col' className='text-left px-4 py-2 md:px-6 md:py-3 border'>Added By</th>
                        <th scope='col' className='text-left px-4 py-2 md:px-6 md:py-3 border'>Updated At</th>
                        <th scope='col' className='text-left px-4 py-2 md:px-6 md:py-3 border'>File Size</th>
                        <th scope='col' className='text-left px-4 py-2 md:px-6 md:py-3 border'>Dimensions</th>
                        <th scope ='col' className='text-left px-4 py-2 md:px-6 md:py-3 border'>Cost</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fileTree.map((node) => (
                        <FileTreeNode key={node.id} node={node} />
                    ))}
                    </tbody>
                </table>
            </div>
        </Collapse>
    )
}

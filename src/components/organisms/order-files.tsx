import { useState, useEffect } from 'react';
import { CompleteParcel, Cart } from "@/db/schema";
import { Empty, Title } from 'rizzui';
import SimpleBar from '@/components/atoms/simplebar';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import { getR2FileLink } from "@/lib/utils/parcel";
import { User } from 'lucia';
import { modifyCart } from '@/lib/utils/cart';
import { PiTrash } from 'react-icons/pi';
import Link from 'next/link';

export default function OrderFiles({
    items,
    className,
    itemClassName,
    showControls,
    user,
    cart,
}: {
    items: CompleteParcel[] | undefined;
    className?: string;
    itemClassName?: string;
    showControls?: boolean;
    user: User;
    cart: Cart | null;
}) {
    const [cardImages, setCardImages] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!items) return;

        const fetchCardImages = async () => {
            const images: { [key: string]: string } = {};
            for (const item of items) {
                const imagePath = `Streetview/${item.streetName}/card/${item.streetNumber}-${item.streetName}.jpg`;
                const link = await getR2FileLink(imagePath);
                if (link) {
                    images[item.id] = link;
                }
            }
            setCardImages(images);
        };

        fetchCardImages();
    }, [items]);

    if (!items || items.length === 0) {
        return (
            <div className="pb-3">
                <Empty />
            </div>
        );
    }

    return (
        <SimpleBar className={cn('h-[calc(100vh_-_170px)] pb-3', className)}>
            <div className={cn('grid gap-3.5', className)}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            'group relative flex items-center justify-between',
                            itemClassName
                        )}
                    >
                        <div className="flex items-center pe-3">
                            <figure className="relative aspect-[4/4.5] w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {cardImages[item.id] && (
                                    <Image
                                        src={cardImages[item.id]}
                                        alt={item.name}
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 100vw"
                                        className="h-full w-full object-cover"
                                    />
                                )}
                                {showControls && (
                                    <>
                                        <span className="absolute inset-0 grid place-content-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100" />
                                        <RemoveItem
                                            file={item}
                                            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform rounded text-white opacity-0 transition duration-300 group-hover:opacity-100"
                                            user={user}
                                            cart={cart}
                                        />
                                    </>
                                )}
                            </figure>
                            <div className="ps-3">
                                <Title
                                    as="h3"
                                    className="mb-1 text-sm font-medium text-steel-900 dark:text-white"
                                >
                                    <Link href={`/dashboard/ecommerce/shop/details/${item.id}`}>
                                        {item.name}
                                    </Link>
                                </Title>
                                <div className="flex items-center gap-3 font-medium text-gray-600 dark:text-gray-400">
                                    {item.description && item.description}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 font-medium text-gray-700">
                            $20.00
                        </div>
                    </div>
                ))}
            </div>
        </SimpleBar>
    );
}

function RemoveItem({
    file,
    user,
    cart,
    className,
}: {
    file: CompleteParcel;
    className?: string;
    user: User;
    cart: Cart | null;
}) {
    return (
        <button
            className={cn('', className)}
            onClick={() => modifyCart(user, file, cart)}
        >
            <PiTrash className="h-6 w-6" />
        </button>
    );
}

import { FileSortType, SortOrderType, ShopSortType } from './sorting';

type FileSortOptions = {
  label: string;
  value: FileSortType;
};

export const FILE_SORT_OPTIONS: FileSortOptions[] = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Size',
    value: 'size',
  },
  {
    label: 'Modified',
    value: 'updatedAt',
  },
];

type OrderOptions = {
  label: string;
  value: SortOrderType;
};

export const ORDER_OPTIONS: OrderOptions[] = [
  {
    label: 'Ascending',
    value: 'asc',
  },
  {
    label: 'Descending',
    value: 'desc',
  },
];

type ShopSortOptions = {
  label: string;
  value: ShopSortType;
};

export const SHOP_SORT_OPTIONS: ShopSortOptions[] = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Street',
    value: 'streetName',
  },
  {
    label: 'Sub Area',
    value: 'subArea',
  },
  {
    label: 'City',
    value: 'city',
  },
  {
    label: 'Modified',
    value: 'updatedAt',
  },
  {
    label: 'Size',
    value: 'size',
  },
];
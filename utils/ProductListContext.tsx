import { createContext } from 'react';

export type ItemData = { id: string, name: string, price: string, aisle: string };

export const ProductListContext = createContext<ItemData[]>([]);

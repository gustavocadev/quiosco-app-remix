import type { Category, Product } from '@prisma/client';
import { createContext } from 'react';
import type { NewOrderType } from './';

export type CategorySelectedType = Category & {
  products?: Product[];
};

export type QuioscoContextType = {
  categorySelected: CategorySelectedType;
  productModal: boolean;
  productSelected?: Product;
  orders: NewOrderType[];
  totalPrice: number;

  // methods
  setCategorySelected: (categorySelected: CategorySelectedType) => void;
  toggleProductModal: () => void;
  setProductSelected: (productSelected: Product) => void;
  handleUpdateOrders: (product: NewOrderType) => void;
  handleDeleteProduct: (productId: number) => void;
  handleEditQuantities: (productId: number, quantity: number) => void;
};

export const QuioscoContext = createContext({} as QuioscoContextType);

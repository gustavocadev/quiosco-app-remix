import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

type ProductSelected = {
  name: string;
  price: number;
  image: string;
  quantity: number;
  categorySlug: string;
  id: string;
};

type Product = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  productSelected: ProductSelected | null;
  setProductSelected: (productSelected: ProductSelected | null) => void;
  increaseQuantity: (quantityProps: number) => void;
  decreaseQuantity: (quantityProps: number) => void;
  isEditing: boolean;

  setIsEditing: (isEditing: boolean) => void;
};

const productStore: StateCreator<Product> = (set) => ({
  // State
  isModalOpen: false,
  productSelected: null,
  isEditing: false,

  // Actions
  setIsModalOpen: (isModalOpen: boolean) =>
    set({
      isModalOpen,
    }),

  setIsEditing: (isEditing: boolean) =>
    set({
      isEditing,
    }),

  setProductSelected: (productSelected: ProductSelected | null) =>
    set({
      productSelected,
    }),

  increaseQuantity: (quantityProps: number) =>
    set(({ productSelected }) => ({
      productSelected: {
        ...productSelected!,
        quantity: quantityProps + 1,
      },
    })),

  decreaseQuantity: (quantityProps: number) =>
    set(({ productSelected }) => ({
      productSelected: {
        ...productSelected!,
        quantity: quantityProps - 1,
      },
    })),
});

export const useProductStore = create(
  devtools(productStore, {
    name: 'Product Store',
  })
);

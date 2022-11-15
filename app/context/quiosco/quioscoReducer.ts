import type { QuioscoState } from './';
import type { Product } from '@prisma/client';
import type { CategorySelectedType } from './QuioscoContext';
import type { NewOrderType } from './';

type QuioscoActionType =
  | {
      type: 'SET_CATEGORY_SELECTED';
      payload: CategorySelectedType;
    }
  | {
      type: 'TOGGLE_PRODUCT_MODAL';
      payload: boolean;
    }
  | {
      type: 'SET_PRODUCT_SELECTED';
      payload: Product;
    }
  | {
      type: 'UPDATE_ORDERS';
      payload: NewOrderType[];
    }
  | {
      type: 'SET_TOTAL_PRICE';
      payload: number;
    };

const quioscoReducer = (state: QuioscoState, action: QuioscoActionType) => {
  switch (action.type) {
    case 'SET_CATEGORY_SELECTED':
      return {
        ...state,
        categorySelected: action.payload,
      };
    case 'TOGGLE_PRODUCT_MODAL':
      return {
        ...state,
        productModal: action.payload,
      };
    case 'SET_PRODUCT_SELECTED':
      return {
        ...state,
        productSelected: action.payload,
      };
    case 'UPDATE_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };
    case 'SET_TOTAL_PRICE':
      return {
        ...state,
        totalPrice: action.payload,
      };
    default:
      return state;
  }
};
export { quioscoReducer };

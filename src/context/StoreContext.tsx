import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react'
import { Product, CartItem, Order, OrderStatus } from '@/types'
import { useToast } from '@/hooks/use-toast'

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'X-Tudo Monstro',
    description:
      'Pão brioche, 2 hambúrgueres artesanais de 180g, bacon, ovo, queijo cheddar, alface e tomate.',
    price: 32.9,
    category: 'Burgers',
    image: 'https://img.usecurling.com/p/400/300?q=double%20burger',
  },
  {
    id: '2',
    name: 'Smash Clássico',
    description:
      'Pão de batata, smash burger 100g, queijo prato e molho especial da casa.',
    price: 18.5,
    category: 'Burgers',
    image: 'https://img.usecurling.com/p/400/300?q=smash%20burger',
  },
  {
    id: '3',
    name: 'Combo Casal',
    description: '2 X-Salada, 2 Batatas fritas médias e 1 Refrigerante de 2L.',
    price: 55.0,
    category: 'Combos',
    image: 'https://img.usecurling.com/p/400/300?q=burger%20combo',
  },
  {
    id: '4',
    name: 'Batata com Cheddar e Bacon',
    description:
      'Porção generosa de batatas fritas crocantes cobertas com cheddar cremoso e cubos de bacon.',
    price: 24.9,
    category: 'Lanches',
    image: 'https://img.usecurling.com/p/400/300?q=fries%20cheddar%20bacon',
  },
  {
    id: '5',
    name: 'Milkshake de Morango',
    description: 'Sorvete de creme batido com morangos frescos e calda.',
    price: 15.9,
    category: 'Bebidas',
    image: 'https://img.usecurling.com/p/400/300?q=strawberry%20milkshake',
  },
  {
    id: '6',
    name: 'Coca-Cola Lata',
    description: 'Lata 350ml gelada.',
    price: 6.0,
    category: 'Bebidas',
    image: 'https://img.usecurling.com/p/400/300?q=coke%20can',
  },
]

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    items: [],
    total: 0,
    status: 'preparing',
    createdAt: new Date().toISOString(),
    customerName: 'João Silva',
    customerAddress: 'Rua A, 123',
    estimatedTime: 25,
  },
  {
    id: 'ORD-1002',
    items: [],
    total: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    customerName: 'Maria Oliveira',
    customerAddress: 'Rua B, 456',
    estimatedTime: 30,
  },
]

// State Types
interface State {
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  isCartOpen: boolean
}

// Action Types
type Action =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload: boolean }
  | { type: 'CREATE_ORDER'; payload: Order }
  | {
      type: 'UPDATE_ORDER_STATUS'
      payload: { id: string; status: OrderStatus }
    }

// Initial State
const initialState: State = {
  products: INITIAL_PRODUCTS,
  cart: [],
  orders: INITIAL_ORDERS,
  isCartOpen: false,
}

// Reducer
const storeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      }
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      }
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id,
      )
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      }
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: action.payload }
    case 'CREATE_ORDER':
      return { ...state, orders: [...state.orders, action.payload] }
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order,
        ),
      }
    default:
      return state
  }
}

// Context
interface StoreContextType extends State {
  dispatch: React.Dispatch<Action>
  calculateETA: () => number
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  // ETA Logic: Base Time (20 mins) + (Active Orders count * 5 mins)
  const calculateETA = () => {
    const activeOrders = state.orders.filter(
      (o) => o.status !== 'delivered',
    ).length
    return 20 + activeOrders * 5
  }

  return (
    <StoreContext.Provider value={{ ...state, dispatch, calculateETA }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

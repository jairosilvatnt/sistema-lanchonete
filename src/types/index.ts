export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export interface CartItem extends Product {
  quantity: number
}

export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'delivered'

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: OrderStatus
  createdAt: string // ISO String
  customerName: string
  customerAddress: string
  estimatedTime: number // in minutes
}

export interface Category {
  id: string
  name: string
  slug: string
}

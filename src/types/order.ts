export interface ShippingInfo {
    name: string;
    phone: string;
    address: string;
    city: string;
    isInsideDhaka: boolean;
  }
  
  export interface OrderItem {
    productId: string;
    size: string;
    color: string;
    quantity: number;
  }
  
  export interface CreateOrderPayload {
    shippingInfo: ShippingInfo;
    items: OrderItem[];
  }
  
  export interface OrderResponse {
    success: boolean;
    message: string;
    order?: {
      _id: string;
      orderNumber?: string;
      totalAmount: number;
      shippingCost: number;
      status: string;
      shippingInfo: ShippingInfo;
      items: OrderItem[];
      createdAt: string;
    };
  }
  
  export const SHIPPING_COST = {
    insideDhaka: 70,
    outsideDhaka: 120,
  } as const;
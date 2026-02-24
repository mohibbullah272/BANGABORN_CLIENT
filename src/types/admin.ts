export interface IAdmin {
    _id: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AdminLoginPayload {
    email: string;
    password: string;
  }
  
  export interface AdminLoginResponse {
    success: boolean;
    message?: string;
    token?: string;
    admin?: {
      _id: string;
      email: string;
    };
  }
  
  export interface OrderStatus {
    status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  }
  
  export interface IOrder {
    _id: string;
    shippingInfo: {
      name: string;
      phone: string;
      address: string;
      city: string;
      isInsideDhaka: boolean;
    };
    items: Array<{
      productId: string;
      size: string;
      color: string;
      quantity: number;
      name?: string;
      image?: string;
      price?: number;
    }>;
    totalAmount: number;
    deliveryCharge:number;
    total:number;
    subtotal:number;
    status: OrderStatus['status'];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface OrdersResponse {
    success: boolean;
    orders: IOrder[];
    total: number;
    page: number;
    totalPages: number;
  }


  


 
export interface NewUserRequestBody{
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    _id: string;
    dob: string;
}

export interface NewProductRequestBody{
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
}

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};
export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}

export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string
}

export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    review?: boolean;
    userId?: string;
    orderId?: string;
     productId?: string | string[];
  };


  export interface BaseQuery{
    name?:{
        $regex: string;
        $options: string;
    };
    price?:{$lte: number};
    category?:string;
  }

  export type SearchRequestQuery = {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?:string;
  }
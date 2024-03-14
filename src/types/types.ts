 
export interface NewUserRequestBody{
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    _id: string;
    dob: string;
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
    userId?: string;
    orderId?: string;
    productId?: string | string[];
  };
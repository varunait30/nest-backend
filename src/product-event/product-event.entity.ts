export enum ProductEventType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export class ProductEvent {
  id: number;
  type: ProductEventType;
  productId: string;
  productName: string;
  email: string;
  processed: boolean;
  createdAt: Date;
}
import { Customer } from './customer.model';
import { OrderItem } from './order-item.model';

export interface Order {

  id: number;

  customer?: Customer;

  paymentMethod?: string;

  items: OrderItem[];

  total: number;

  date: string;

  status: string;

}
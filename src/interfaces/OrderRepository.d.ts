import { Order } from "../classes/Order";

export interface OrderRepository {
  findById(id: number): Promise<Order | null>;
  save(order: Order): Promise<void>;
  delete(order: Order): Promise<void>;
  findAll(): Promise<Order[]>;
}

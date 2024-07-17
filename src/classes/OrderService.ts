import { OrderRepository } from '../interfaces/OrderRepository';
import { PaymentService } from '../interfaces/PaymentService';
import { Order } from './Order';

export class OrderService {
  private orderRepository: OrderRepository;
  private paymentService: PaymentService;

  constructor(orderRepository: OrderRepository, paymentService: PaymentService) {
    this.orderRepository = orderRepository;
    this.paymentService = paymentService;
  }

  async placeOrder(order: Order) {
    const paymentProcessed = await this.paymentService.processPayment(order.amount);

    if (paymentProcessed) {
      this.orderRepository.save(order);
      return true;
    }

    return false;
  }

  getOrderById(id: number) {
    return this.orderRepository.findById(id);
  }

  async cancelOrder(id: number) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }
    
    this.orderRepository.delete(order);
  }

  listAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
import { OrderService } from '../classes/OrderService';
import { OrderRepository } from '../interfaces/OrderRepository';
import { PaymentService } from '../interfaces/PaymentService';
import { Order } from '../classes/Order';

describe('OrderService', () => {
  let orderRepository: jest.Mocked<OrderRepository> | undefined;
  let paymentService: jest.Mocked<PaymentService> | undefined;
  let orderService: OrderService | undefined;

  beforeEach(() => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    paymentService = {
      processPayment: jest.fn(),
    };

    orderService = new OrderService(orderRepository, paymentService);
  });

  it('should place an order successfully', async () => {
    const order = new Order(1, 100);
    paymentService?.processPayment.mockResolvedValue(true);

    const result = await orderService?.placeOrder(order);

    expect(result).toBe(true);
    expect(orderRepository?.save).toHaveBeenCalledWith(order);
  });

  it('should not place an order if payment fails', async () => {
    const order = new Order(1, 100);
    paymentService?.processPayment.mockResolvedValue(false);

    const result = await orderService?.placeOrder(order);

    expect(result).toBe(false);
    expect(orderRepository?.save).not.toHaveBeenCalled();
  });

  it('should return an order by id', async () => {
    const order = new Order(1, 100);
    orderRepository?.findById.mockResolvedValue(order);

    const result = await orderService?.getOrderById(1);

    expect(result).toBe(order);
  });

  it('should return null if order not found by id', async () => {
    orderRepository?.findById.mockResolvedValue(null);

    const result = await orderService?.getOrderById(1);

    expect(result).toBeNull();
  });

  it('should cancel an order', async () => {
    const order = new Order(1, 100);
    orderRepository?.findById.mockResolvedValue(order);

    await orderService?.cancelOrder(1);

    expect(orderRepository?.delete).toHaveBeenCalledWith(order);
  });

  it('should throw error if canceling an order that does not exist', async () => {
    orderRepository?.findById.mockResolvedValue(null);

    await expect(orderService?.cancelOrder(1)).rejects.toThrow("Order not found");
  });

  it('should list all orders', async () => {
    const orders = [new Order(1, 100), new Order(2, 200)];
    orderRepository?.findAll.mockResolvedValue(orders);

    const result = await orderService?.listAllOrders();

    expect(result).toBe(orders);
  });
});

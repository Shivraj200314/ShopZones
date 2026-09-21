export const loadRemoteModule =
  jest.fn().mockResolvedValue({

    ProductsModule:
      class ProductsModule {},

    CartModule:
      class CartModule {},

    CheckoutModule:
      class CheckoutModule {},

    OrdersModule:
      class OrdersModule {},

    UsersModule:
      class UsersModule {}

  });
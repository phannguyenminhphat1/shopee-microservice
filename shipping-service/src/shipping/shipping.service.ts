import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from 'prisma/prisma.service';
import { Status } from 'src/constant/enum';
import { USERS_MESSAGES } from 'src/constant/messages';
import { AuthInfo, SuccessResponse } from 'src/constant/response';
import { StoresProducts } from 'src/constant/types';
import { wrapRequestHandler } from 'src/utils/wrapRequestHandler';

@Injectable()
export class ShippingService {
  constructor(
    private prismaService: PrismaService,
    @Inject('PRODUCT_SERVICE') private productService: ClientProxy,
  ) {}

  checkRequiredAndIsNumber(
    key: number,
    messageRequired: string,
    messageNumber: string,
    messageNegative: string,
  ) {
    if (!key) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          key: messageRequired,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (typeof key !== 'number') {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          key: messageNumber,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (key <= 0) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          key: messageNegative,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
  }

  async createShipping(payload: { purchase_id: number }) {
    const { purchase_id } = payload;
    const newShipping = await this.prismaService.shippings.create({
      data: {
        purchase_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return newShipping;
  }

  async pickingPurchase(payload: { shipping_id: number; authInfo: AuthInfo }) {
    const { shipping_id } = payload;
    this.checkRequiredAndIsNumber(
      shipping_id,
      USERS_MESSAGES.SHIPPING_ID_IS_REQUIRED,
      USERS_MESSAGES.SHIPPING_ID_MUST_BE_A_NUMBER,
      USERS_MESSAGES.SHIPPING_ID_MUST_BE_POSITIVE,
    );
    const shipping = await this.prismaService.shippings.findUnique({
      where: { shipping_id },
      include: {
        purchases: true,
      },
    });
    if (!shipping) {
      throw new RpcException({
        message: USERS_MESSAGES.SHIPPING_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (shipping.purchases.status !== Status.Picking) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          shipping_id: USERS_MESSAGES.THIS_PURCHASE_IN_NOT_CONFIRM,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    const picking = await this.prismaService.shippings.update({
      where: {
        shipping_id: shipping.shipping_id,
      },
      data: {
        updated_at: new Date(),
        purchases: {
          update: {
            status: Status.Shipping,
            updated_at: new Date(),
          },
        },
      },
    });
    return {
      message: USERS_MESSAGES.PICKING_SUCCESSFULLY,
      data: picking,
    };
  }

  async canceledAndDeliveredPurchase(payload: {
    authInfo: AuthInfo;
    shipping_id: number;
    status: number;
  }) {
    const { shipping_id, status } = payload;
    this.checkRequiredAndIsNumber(
      shipping_id,
      USERS_MESSAGES.SHIPPING_ID_IS_REQUIRED,
      USERS_MESSAGES.SHIPPING_ID_MUST_BE_A_NUMBER,
      USERS_MESSAGES.SHIPPING_ID_MUST_BE_POSITIVE,
    );

    // Nếu không nhập status
    if (!status) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          status: USERS_MESSAGES.STATUS_IS_REQUIRED,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    // Nếu Status không nằm trong STATUS
    const statusNumber = Number(status);
    const statusValues = Object.values(Status).filter(
      (value) => typeof value === 'number',
    );

    if (!statusValues.includes(statusNumber)) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          status: USERS_MESSAGES.STATUS_INVALID,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    const shipping = await this.prismaService.shippings.findUnique({
      where: { shipping_id },
      include: {
        purchases: true,
      },
    });
    if (!shipping) {
      throw new RpcException({
        message: USERS_MESSAGES.SHIPPING_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (shipping.purchases.status === Status.Canceled) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          shipping_id: USERS_MESSAGES.THIS_PURCHASE_HAS_BEEN_CANCELED,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (shipping.purchases.status === Status.Delivered) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          shipping_id: USERS_MESSAGES.THIS_PURCHASE_HAS_BEEN_DELIVERED,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (status !== Status.Delivered && status !== Status.Canceled) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          shipping_id: USERS_MESSAGES.STATUS_MUST_BE_DELIVERD_OR_CANCELED,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    // Tìm sản phẩm thuộc mã ship này
    const getStoresProducts = await wrapRequestHandler<
      SuccessResponse<StoresProducts>
    >(
      this.productService,
      'get-product',
      shipping.purchases.stores_products_id,
    );

    if (shipping.purchases.status === Status.Shipping) {
      if (status === Status.Canceled) {
        await this.prismaService.shippings.update({
          where: { shipping_id: shipping.shipping_id },
          data: {
            updated_at: new Date(),
            purchases: {
              update: {
                status: Status.Canceled,
                updated_at: new Date(),
                stores_products: {
                  update: {
                    stock_quantity:
                      shipping.purchases.buy_count +
                      getStoresProducts.data.stock_quantity,
                  },
                },
              },
            },
          },
        });
        return {
          message: USERS_MESSAGES.PURCHASE_CANCELED,
          data: shipping,
        };
      } else if (status === Status.Delivered) {
        await this.prismaService.shippings.update({
          where: {
            shipping_id: shipping.shipping_id,
          },
          data: {
            updated_at: new Date(),
            purchases: {
              update: {
                status: Status.Delivered,
                updated_at: new Date(),
                stores_products: {
                  update: {
                    sold:
                      getStoresProducts.data.sold +
                      shipping.purchases.buy_count,
                  },
                },
              },
            },
          },
        });
        return {
          message: USERS_MESSAGES.PURCHASE_DELIVERD,
          data: shipping,
        };
      } else {
        return {
          message: USERS_MESSAGES.CAN_ONLY_CANCEL_OR_DELIVERD,
        };
      }
    } else {
      return {
        message:
          USERS_MESSAGES.THIS_PURCHASE_IS_IN_DIFFERENT_STATUS_OR_UNAVAIABLE,
      };
    }
  }
}

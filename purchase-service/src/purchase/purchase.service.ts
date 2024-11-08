import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { USERS_MESSAGES } from 'src/constant/messages';
import { Status, UserRole } from 'src/constant/enum';
import { wrapRequestHandler } from 'src/utils/wrapRequestHandler';
import { SuccessResponse } from 'src/constant/response';
import { StoresProducts, User } from 'src/constant/types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PurchaseService {
  constructor(
    private prismaService: PrismaService,
    @Inject('PRODUCT_SERVICE') private productService: ClientProxy,
    @Inject('USER_SERVICE') private userService: ClientProxy,
  ) {}

  async addToCart(payload: { authInfo: AuthInfo; addToCartDto: AddToCartDto }) {
    const {
      addToCartDto: { buy_count, stores_products_id },
      authInfo: {
        decodeAccessToken: { user_id },
      },
    } = payload;
    if (!buy_count) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          buy_count: USERS_MESSAGES.BUY_COUNT_IS_REQUIRED,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (typeof buy_count !== 'number') {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          buy_count: USERS_MESSAGES.BUY_COUNT_MUST_BE_A_NUMBER,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (!stores_products_id) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          stores_products_id: USERS_MESSAGES.STORES_PRODUCTS_IS_REQUIRED,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    if (typeof stores_products_id !== 'number') {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          buy_count: USERS_MESSAGES.STORES_PRODUCTS_MUST_BE_A_NUMBER,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    // Lấy và check xem stores_products_id khi người dùng click có tồn tại không
    try {
      const storesProducts = await wrapRequestHandler<
        SuccessResponse<StoresProducts>
      >(this.productService, 'get-product', stores_products_id);

      // Lấy ra số lượng tồn kho còn lại của thức ăn của cửa hàng đó
      const stockQuantity = storesProducts.data.stock_quantity;
      if (buy_count > stockQuantity) {
        throw new RpcException({
          message: USERS_MESSAGES.ERROR,
          data: {
            buy_count:
              USERS_MESSAGES.STORE_REMAINING_QUANTITY_NOT_EQUAL_SELECTED_QUANTITY,
          },
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }

      // Kiểm tra xem món ăn đã có trong giỏ hàng chưa
      const existingPurchases = await this.prismaService.purchases.findFirst({
        where: {
          user_id,
          stores_products_id: storesProducts.data.stores_products_id,
          status: Status.InCart,
        },
      });
      if (!existingPurchases) {
        await this.prismaService.purchases.create({
          data: {
            user_id,
            stores_products_id: storesProducts.data.stores_products_id,
            buy_count,
            total_price: buy_count * Number(storesProducts.data.price),
            status: Status.InCart,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      } else {
        const newBuyCount = existingPurchases.buy_count + buy_count;
        const newTotalPrice = Number(storesProducts.data.price) * newBuyCount;
        await this.prismaService.purchases.update({
          where: { purchase_id: existingPurchases.purchase_id },
          data: {
            buy_count: newBuyCount,
            total_price: newTotalPrice,
            updated_at: new Date(),
          },
        });
      }
      return {
        message: USERS_MESSAGES.ADD_TO_CART_SUCCESSFULLY,
        data: {
          stores_products_id: storesProducts.data.stores_products_id,
          buy_count,
        },
      };
    } catch (err) {
      if (err.response) {
        return err.response;
      }
      return err.error;
    }
  }

  async getPurchases(payload: { authInfo: AuthInfo; status: number }) {
    const {
      status,
      authInfo: {
        decodeAccessToken: { user_id },
      },
    } = payload;

    // Nếu không nhập status
    if (!status) {
      throw new RpcException({
        message: USERS_MESSAGES.STATUS_IS_REQUIRED,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Nếu Status không nằm trong STATUS
    const statusNumber = Number(status);
    const statusValues = Object.values(Status).filter(
      (value) => typeof value === 'number',
    );

    if (!statusValues.includes(statusNumber)) {
      throw new RpcException({
        message: USERS_MESSAGES.STATUS_INVALID,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Lấy ra User
    try {
      const me = await wrapRequestHandler<SuccessResponse<User>>(
        this.userService,
        'get-me',
        { user_id },
      );
      const statusCondition =
        Number(status) === Status.AllProducts ? {} : { status: Number(status) };
      const roleCondition =
        me.data.role === UserRole.ADMIN || me.data.role === UserRole.SHIPPER
          ? {}
          : user_id;
      const getPurchases = await this.prismaService.purchases.findMany({
        where: {
          user_id: roleCondition,
          ...statusCondition,
        },
        include: {
          shippings: true,
          stores_products: {
            include: { products: true, stores: true },
          },
          users: true,
        },
      });
      return {
        message: USERS_MESSAGES.GET_PURCHASE_SUCCESSFULLY,
        data: getPurchases,
      };
    } catch (err) {
      return err;
    }
  }

  async buyProducts(payload: { authInfo: AuthInfo; purchase_id: number[] }) {
    const {
      purchase_id,
      authInfo: {
        decodeAccessToken: { user_id },
      },
    } = payload;

    if (!purchase_id || purchase_id.length <= 0) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          purchase_id: USERS_MESSAGES.PURCHASE_ID_IS_REQUIRED,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    if (!Array.isArray(purchase_id)) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          purchase_id: USERS_MESSAGES.PURCHASE_ID_MUST_BE_AN_ARRAY_OF_NUMBER,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    // Check mảng phải là số hay không
    const isAllNumbers = purchase_id.every(
      (id) => typeof id === 'number' && !isNaN(id),
    );
    if (!isAllNumbers) {
      throw new RpcException({
        message: USERS_MESSAGES.ERROR,
        data: {
          purchase_id: USERS_MESSAGES.PURCHASE_ID_MUST_BE_AN_ARRAY_OF_NUMBER,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    await this.prismaService.$transaction(async (prisma) => {
      for (const id of purchase_id) {
        const purchase = await prisma.purchases.findUnique({
          where: { purchase_id: id },
          include: {
            stores_products: { include: { products: true, stores: true } },
          },
        });

        if (!purchase || purchase.user_id !== user_id) {
          throw new RpcException({
            message: USERS_MESSAGES.ERROR,
            data: {
              purchase: `Mã mua hàng ${id} không hợp lệ hoặc không thuộc về người dùng`,
            },
            status: HttpStatus.UNPROCESSABLE_ENTITY,
          });
        }
        if (purchase.status !== Status.InCart) {
          throw new RpcException({
            message: USERS_MESSAGES.ERROR,
            data: {
              purchase: `Mã mua hàng ${id} không nằm trong giỏ hàng`,
            },
            status: HttpStatus.UNPROCESSABLE_ENTITY,
          });
        }
        if (purchase.stores_products.stock_quantity < purchase.buy_count) {
          throw new RpcException({
            message: USERS_MESSAGES.ERROR,
            data: {
              product_name: `Số lượng tồn kho của sản phẩm ${purchase.stores_products.products.product_name} không đủ để hoàn thành đơn hàng`,
            },
            status: HttpStatus.UNPROCESSABLE_ENTITY,
          });
        }

        // Cập nhật stock quantity cho stores_products
        await lastValueFrom(
          this.productService.emit('update-stock-quantity', {
            stores_products_id: purchase.stores_products_id,
            buy_count: purchase.buy_count,
          }),
        );
      }

      // Sau khi kiểm tra và cập nhật tồn kho, cập nhật trạng thái purchases
      await prisma.purchases.updateMany({
        where: {
          purchase_id: { in: purchase_id },
          user_id: user_id,
          status: Status.InCart,
        },
        data: {
          status: Status.WaitingForConfirmation,
          updated_at: new Date(),
        },
      });
    });

    return {
      message: 'Mua hàng thành công',
      data: {
        purchase_id,
      },
    };
  }
}

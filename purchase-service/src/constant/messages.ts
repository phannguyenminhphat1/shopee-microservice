export const USERS_MESSAGES = {
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  USERS_NOT_FOUND: 'Không tìm thấy người dùng nào',
  INVALID_USER_ID: 'ID người dùng không hợp lệ',
  USER_ID_IS_REQUIRED: 'ID người dùng không được để trống',
  REFRESH_TOKEN_SUCCESS: 'Làm mới token thành công',
  UNAUTHORIZE_ERROR: 'Lỗi xác thực',
  TOKEN_INVALID: 'Token không hợp lệ',
  TOKEN_EXPIRED_ERROR: 'Token đã hết hạn',
  ERROR: 'Lỗi',
  BUY_COUNT_IS_REQUIRED: 'Số lượng mua không được rỗng',
  BUY_COUNT_MUST_BE_A_NUMBER: 'Số lượng mua phải là số',
  STORES_PRODUCTS_IS_REQUIRED: 'Mã sản phẩm không được rỗng',
  STORES_PRODUCTS_MUST_BE_A_NUMBER: 'Mã sản phẩm phải là số',
  STORE_REMAINING_QUANTITY_NOT_EQUAL_SELECTED_QUANTITY:
    'Số lượng còn lại của cửa hàng không đủ bằng số lượng bạn chọn',
  ADD_TO_CART_SUCCESSFULLY: 'Thêm sản phẩm vào giỏ hàng thành công',
  STATUS_IS_REQUIRED: 'Status không được rỗng',
  STATUS_MUST_BE_A_NUMBER: 'Status phải là số',
  STATUS_INVALID: 'Status phải là các giá trị hợp lệ',
  GET_PURCHASE_SUCCESSFULLY: 'Lấy giỏ hàng thành công',
  PURCHASE_ID_IS_REQUIRED: 'Mã mua hàng không được trống',
  PURCHASE_ID_MUST_BE_AN_ARRAY_OF_NUMBER: 'Mã mua hàng phải là mảng các số',
  DELETE_PRODUCT_SUCCESSFULLY: 'Xóa sản phẩm khỏi giỏ hàng thành công',
  PURCHASE_ID_MUST_BE_A_NUMBER: 'Mã mua hàng phải là số',
  PURCHASE_ID_MUST_BE_POSITIVE: 'Mã mua hàng phải là số dương',
  BUY_COUNT_MUST_BE_POSITIVE: 'Số lượng mua phải là số dương',
  STORES_PRODUCTS_MUST_BE_POSITIVE: 'Mã sản phẩm phải là số dương',
  PURCHASE_ID_IS_INVALID_OR_DOES_NOT_BELONG_TO_USER:
    'Mã mua hàng không hợp lệ hoặc không thuộc về người dùng',
  ONLY_UPDATE_PRODUCT_IN_CART:
    'Chỉ có thể cập nhật các sản phẩm trong giỏ hàng',
  UPDATE_CART_SUCCESSFULLY: 'Cập nhật giỏ hàng thành công',
  BUY_PRODUCTS_SUCCESSFULLY: 'Mua hàng thành công',
  STOCK_QUANTITY_IS_NOT_ENOUGH_TO_UPDATE:
    'Số lượng tồn kho không đủ để cập nhật đơn hàng',
  PURCHASE_NOT_FOUND: 'Không tìm thấy đơn hàng này',
  THIS_PURCHASE_HAS_BEEN_CONFIRMED_OR_SHIPPED_OR_HAS_NOT_BEEN_PURCHASED:
    'Đơn hàng này đã xác nhận hoặc vận chuyển hoặc chưa được mua',
  CONFIRMATION_SUCCESSFULLY:
    'Xác nhận đơn hàng thành công, đơn hàng đang chờ lấy',
} as const;

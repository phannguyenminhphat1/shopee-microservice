export const USERS_MESSAGES = {
  ERROR: 'Lỗi',
  // SHIP
  SHIPPING_ID_IS_REQUIRED: 'Mã ship không được trống',
  SHIPPING_ID_MUST_BE_A_NUMBER: 'Mã ship phải là số',
  SHIPPING_ID_MUST_BE_POSITIVE: 'Mã ship phải là số dương',
  THIS_PURCHASE_IN_NOT_CONFIRM: 'Đơn hàng này chưa được shop xác nhận',
  SHIPPING_NOT_FOUND: 'Không tìm thấy đơn hàng này',
  PICKING_SUCCESSFULLY: 'Đã lấy đơn hàng thành công',
  THIS_PURCHASE_HAS_BEEN_CANCELED: 'Đơn hàng này đã bị hủy',
  THIS_PURCHASE_HAS_BEEN_DELIVERED: 'Đơn hàng này đã được giao',
  STATUS_MUST_BE_DELIVERD_OR_CANCELED:
    'Status phải là 4 (Delivered) hoặc 5 (Canceled)',
  STATUS_IS_REQUIRED: 'Status không được rỗng',
  STATUS_MUST_BE_A_NUMBER: 'Status phải là số',
  STATUS_INVALID: 'Status phải là các giá trị hợp lệ',
  PURCHASE_CANCELED: 'Đã hủy đơn hàng thành công',
  PURCHASE_DELIVERD: 'Đơn hàng được giao thành công',
  CAN_ONLY_CANCEL_OR_DELIVERD: 'Chỉ có thể hủy hoặc giao hàng',
  THIS_PURCHASE_IS_IN_DIFFERENT_STATUS_OR_UNAVAIABLE:
    'Đơn hàng này đang ở trạng thái khác hoặc không có',
} as const;

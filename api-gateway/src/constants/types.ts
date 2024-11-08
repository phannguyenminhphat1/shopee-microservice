export interface TokenPayload {
  user_id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  address: string;
  role: string;
  created_at: string;
  updated_at: string;
  avatar: string;
  date_of_birth: string;
}

export interface StoresProducts {
  stores_products_id: number;
  store_id: number;
  product_id: number;
  stock_quantity: number;
  rating: string;
  view: number;
  sold: number;
  price_before_discount: string;
  price: string;
  stores: Store;
  products: Product;
}

export interface Store {
  store_id: number;
  store_name: string;
  address: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  description: string;
  category_id: number;
  image_url: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductElastic {
  updated_at: string;
  view: number;
  sold: number;
  rating: number;
  price: number;
  store_id: number;
  product_id: number;
  product_name: string;
  created_at: string;
  price_before_discount: number;
  category_name: string;
  stores_products_id: number;
  store_name: string;
  stock_quantity: number;
  category_id: number;
}

export interface Pagination {
  total: any;
  page: number;
  limit: number;
  page_size: number;
}

// const pro = {
//   stores_products_id: 5,
//   store_id: 2,
//   product_id: 12,
//   stock_quantity: 7977,
//   rating: '2.1',
//   view: 15,
//   sold: 688,
//   price_before_discount: '3240000',
//   price: '1790000',
//   stores: {
//     store_id: 2,
//     store_name: 'Galle Watch',
//     address: '456 Lê Lợi, Quận 1, TP.HCM',
//     phone_number: '0987654321',
//     created_at: '2024-10-15T12:59:18.246Z',
//     updated_at: '2024-10-15T12:59:18.246Z',
//   },
//   products: {
//     product_id: 12,
//     product_name: 'Đồng Hồ Nam WWOOR 8018 Dây Thép Nhật Cao Cấp Nhiều Màu',
//     description:
//       '<p>➫ Kh&aacute;ch h&agrave;ng vui l&ograve;ng đọc r&otilde; th&ocirc;ng tin về sản phẩm để tr&aacute;nh trường hợp mua về kh&ocirc;ng h&agrave;i l&ograve;ng nh&eacute; ^^</p><p>☑ Chất liệu mặt : K&iacute;nh kho&aacute;ng chất (chống xước tốt, đ&aacute;nh b&oacute;ng được) được &eacute;p trong khung th&eacute;p kh&ocirc;ng gỉ<br />☑ Chất liệu d&acirc;y đeo : Th&eacute;p kh&ocirc;ng gỉ<br />☑ Chống nước : 30M - 3ATM<br />☑ Độ d&agrave;y : 0.9 CM<br />☑ Đường k&iacute;nh mặt : 4.1 CM<br />☑ Độ rộng d&acirc;y đeo : 2.2 CM<br />☑ Trọng lượng : 99 gram<br />☑ Lịch ng&agrave;y : C&oacute;<br />☑ Xuất xứ m&aacute;y : M&aacute;y miyota nhật<br />☑ Sản xuất tại : HongKong<br />🕦 Bảo h&agrave;nh : 12 th&aacute;ng (t&iacute;nh từ ng&agrave;y mua h&agrave;ng)<br /> ❃ N&ecirc;n tr&aacute;nh tiếp x&uacute;c với h&oacute;a chất như x&agrave; ph&ograve;ng, nước tẩy rửa, kh&ocirc;ng mang khi bơi lội. Tr&aacute;nh va đập mạnh</p><p>❃ Ch&iacute;nh s&aacute;ch bảo h&agrave;nh:<br />🎁 Được đổi trả sản phẩm trong v&ograve;ng 2 ng&agrave;y kể từ khi nhận được h&agrave;ng nếu sản phẩm bị lỗi do nh&agrave; sản xuất.<br />🎁 Kh&ocirc;ng bảo h&agrave;nh cho c&aacute;c trường hợp: c&aacute;c loại d&acirc;y đeo, kho&aacute;, vỏ, m&agrave;u xi, mặt số, mặt kiếng bị hỏng h&oacute;c, vỡ do sử dụng kh&ocirc;ng đ&uacute;ng, tai nạn, l&atilde;o h&oacute;a tự nhi&ecirc;n, va đập, &hellip; trong qu&aacute; tr&igrave;nh sử dụng.<br />🎁 Kh&ocirc;ng bảo h&agrave;nh hỏng h&oacute;c do hậu quả gi&aacute;n tiếp của việc sử dụng sai hướng dẫn.<br />🎁 Kh&ocirc;ng bảo h&agrave;nh trầy xước về d&acirc;y hoặc mặt kiếng bị trầy xước, vỡ do va chạm trong qu&aacute; tr&igrave;nh sử dụng. <br />🎁 Kh&ocirc;ng bảo h&agrave;ng khi tự &yacute; thay đổi m&aacute;y m&oacute;c b&ecirc;n trong, mở ra can thiệp sửa chữa trong thời gian c&ograve;n bảo h&agrave;nh &ndash; Tại những nơi kh&ocirc;ng phải l&agrave; trung t&acirc;m của h&atilde;ng.</p><p>❖ C&Aacute;C TRƯỜNG HỢP CỤ THỂ CỦA ĐỒNG HỒ CHỐNG NƯỚC :<br />➫ 30M, 3ATM, 3BAR (hoặc chỉ ghi l&agrave; Water Resistance) &ndash; Chỉ chịu nước ở mức rửa tay, đi mưa nhẹ.<br />➫ 50M, 5ATM, 5 BAR &ndash; Được sử dụng trong bơi lội, lặn s&ocirc;ng nước (kh&ocirc;ng sử dụng được trong lặn biển, chơi thể thao mạnh dưới nước&hellip;)<br />➫ 100M, 10 ATM, 10BAR &ndash; Được sử dụng trong bơi lội, lặn v&ugrave;ng s&ocirc;ng nước, lặn biển, kh&ocirc;ng được sử dụng khi chơi thể thao mạnh dưới nước.</p><p>❖ THỜI GIAN GIAO H&Agrave;NG<br />➫ Hcm, B&igrave;nh Dương, Đồng Nai : 1-2 ng&agrave;y<br />➫ H&agrave; Nội, Huế, Đ&agrave; Nẵng : dự kiến 2-4 ng&agrave;y (hoặc c&oacute; thể sớm hơn)<br />➫ C&aacute;c tỉnh th&agrave;nh kh&aacute;c : dự kiến 3-4 ng&agrave;y (hoặc c&oacute; thể sớm hơn)</p><p>❖ ƯU Đ&Atilde;I<br />➫ Giảm gi&aacute; khi mua h&agrave;ng lần 2<br />➫ Qu&agrave; tặng khi mua h&agrave;ng lần 2<br />➫ Mua 10 tặng 1</p><p><br />❖ CH&Uacute; &Yacute; : Hiện c&oacute; 1 số c&aacute; nh&acirc;n lấy h&igrave;nh ảnh v&agrave; phần chi tiết của shop H&agrave;ng Ch&iacute;nh Hiệu đăng b&aacute;n c&aacute;c sản phẩm tương tự nhưng với chất lượng v&agrave; gi&aacute; th&agrave;nh thấp hơn rất nhiều. Rất mong qu&yacute; kh&aacute;ch h&agrave;ng c&oacute; lựa chọn s&aacute;ng suốt khi mua h&agrave;ng.</p><p>&clubs; HƯỚNG DẪN LẤY M&Atilde; GIẢM GI&Aacute; VẬN CHUYỂN TRƯỚC KHI ĐẶT H&Agrave;NG:<br />BƯỚC 1: V&agrave;o trang chủ shopee =&gt; mục giảm gi&aacute; =&gt; lấy m&atilde; <br />BƯỚC 2: Nhấn v&agrave;o m&atilde; giảm gi&aacute; trong giỏ h&agrave;ng khi tiến h&agrave;nh thanh to&aacute;n<br />BƯỚC 3: M&atilde; miễn ph&iacute; vận chuyển được tự động chọn, bạn c&oacute; thể chọn th&ecirc;m m&atilde; giảm gi&aacute; kh&aacute;c (nếu c&oacute;) v&agrave; bấm OK để được ưu đ&atilde;i cho đơn h&agrave;ng<br />BƯỚC 4: Tiến h&agrave;nh thanh to&aacute;n cho đơn h&agrave;ng sau khi chọn m&atilde; giảm gi&aacute; <br />LƯU &Yacute;: 1 đơn h&agrave;ng được d&ugrave;ng tối đa 1 m&atilde; miễn ph&iacute; vận chuyển v&agrave; 1 m&atilde; giảm gi&aacute; loại kh&aacute;c</p>',
//     category_id: 1,
//     image_url:
//       'https://api-ecom.duthanhduoc.com/images/a04c55a2-9569-4a59-a6de-2b3bbdcb570a.jpg',
//     images: [
//       'https://api-ecom.duthanhduoc.com/images/a04c55a2-9569-4a59-a6de-2b3bbdcb570a.jpg',
//       'https://api-ecom.duthanhduoc.com/images/79e4b0c3-1ae4-4a09-b97b-4de76da2d184.jpg',
//       'https://api-ecom.duthanhduoc.com/images/a2b2203e-0e10-499b-9f37-44c832cc0b5f.jpg',
//       'https://api-ecom.duthanhduoc.com/images/157767d1-b7d7-4c00-b70c-fdb35d1da438.jpg',
//       'https://api-ecom.duthanhduoc.com/images/d4d6a55d-3b98-4616-9317-b04db19d76f7.jpg',
//       'https://api-ecom.duthanhduoc.com/images/72485884-ef06-4e1a-8aa5-0bc47088aa75.jpg',
//       'https://api-ecom.duthanhduoc.com/images/b86eb037-1f44-4610-bd9c-3ee9b7943cd9.jpg',
//       'https://api-ecom.duthanhduoc.com/images/cb20f2a5-47ed-4a9e-a9f5-45198119dbe3.jpg',
//       'https://api-ecom.duthanhduoc.com/images/f62e3461-8f34-4261-8b64-aba54e3d4523.jpg',
//     ],
//     created_at: '2021-05-27T14:32:53.476Z',
//     updated_at: '2024-10-15T10:05:00.327Z',
//   },
// };

import { RESOURCE } from "@/configs/api-config";
import axiosInstance from "@/utils/axios";
import MockAdapter from "axios-mock-adapter";

export const setupMocks = () => {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 500 });

  // --- MOCK DATA ---

  const users = [
    {
      id: 1,
      tai_khoan: "admin",
      mat_khau: "$2b$12$sjGDcgdH17VTvOrGhP1pduNGPTlYkUQN7XjXVhUrP7AmB4lR6yC0W",
      ho_va_ten: "Quản trị viên",
      email: "admin@example.com",
      ma_vai_tro: "Admin",
      trang_thai: 1,
      so_dien_thoai: "0900000001",
      ngay_tao: "2024-01-01T00:00:00.000Z",
      avatar: "https://xsgames.co/randomusers/assets/avatars/male/1.jpg"
    },
    {
      id: 2,
      tai_khoan: "nhanvien01",
      mat_khau: "$2b$12$sjGDcgdH17VTvOrGhP1pduNGPTlYkUQN7XjXVhUrP7AmB4lR6yC0W",
      ho_va_ten: "Nguyễn Văn A",
      email: "nva@example.com",
      ma_vai_tro: "Editor",
      trang_thai: 1,
      so_dien_thoai: "0900000002",
      ngay_tao: "2024-01-02T00:00:00.000Z",
      avatar: "https://xsgames.co/randomusers/assets/avatars/male/2.jpg"
    },
    {
      id: 3,
      tai_khoan: "nhanvien02",
      mat_khau: "$2b$12$sjGDcgdH17VTvOrGhP1pduNGPTlYkUQN7XjXVhUrP7AmB4lR6yC0W",
      ho_va_ten: "Trần Thị B",
      email: "ttb@example.com",
      ma_vai_tro: "Viewer",
      trang_thai: 1,
      so_dien_thoai: "0900000003",
      ngay_tao: "2024-01-03T00:00:00.000Z",
      avatar: "https://xsgames.co/randomusers/assets/avatars/female/3.jpg"
    }
  ];

  const products = [
    {
      id: "P001",
      name: "iPhone 15 Pro",
      price: 25000000,
      stock: 50,
      category: "Electronics",
      description: "Hàng chính hãng Apple",
      status: "active",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10"
    },
    {
      id: "P002",
      name: "MacBook Air M2",
      price: 28000000,
      stock: 20,
      category: "Electronics",
      status: "active",
      createdAt: "2024-01-12"
    },
    {
      id: "P003",
      name: "Sony WH-1000XM5",
      price: 8000000,
      stock: 0,
      category: "Accessories",
      status: "inactive",
      createdAt: "2024-01-15"
    }
  ];

  const roles = [
    { value: "Admin", label: "Quản trị cao cấp" },
    { value: "Editor", label: "Biên tập viên" },
    { value: "Viewer", label: "Người xem" }
  ];

  // --- AUTH & PROFILE ---

  mock.onPost(RESOURCE.LOGIN).reply((config) => {
    const { tai_khoan, mat_khau } = JSON.parse(config.data);
    const user = users.find((u) => u.tai_khoan === tai_khoan);

    if (user && mat_khau === "123456") {
      return [
        200,
        {
          code: 200,
          status: true,
          message: "Đăng nhập thành công",
          data: { user, token: "mock-jwt-token" }
        }
      ];
    }
    return [401, { code: 401, status: false, message: "Tài khoản hoặc mật khẩu không chính xác (Gợi ý: 123456)" }];
  });

  mock.onPost(RESOURCE.LOGOUT).reply(200, { code: 200, status: true, message: "Đăng xuất thành công" });

  mock.onGet(RESOURCE.PROFILE).reply(200, { code: 200, status: true, data: users[0] });
  mock
    .onPatch(RESOURCE.PROFILE)
    .reply(200, { code: 200, status: true, message: "Cập nhật thành công", data: users[0] });
  mock.onPatch(RESOURCE.CHANGE_PASSWORD).reply(200, { code: 200, status: true, message: "Đổi mật khẩu thành công" });
  mock
    .onPatch(`${RESOURCE.PROFILE}/avatar`)
    .reply(200, { code: 200, status: true, message: "Cập nhật ảnh đại diện thành công" });

  // --- USERS MOCK ---

  mock.onGet(RESOURCE.USER).reply(200, {
    code: 200,
    status: true,
    message: "OK",
    data: {
      collection: users,
      total: users.length,
      current_page: 1,
      last_page: 1
    }
  });

  mock.onGet(new RegExp(`${RESOURCE.USER}/\\d+`)).reply((config) => {
    const id = parseInt(config.url!.split("/").pop()!);
    const user = users.find((u) => u.id === id);
    return user
      ? [200, { code: 200, status: true, data: user }]
      : [404, { code: 404, message: "Không tìm thấy người dùng" }];
  });

  mock.onPost(RESOURCE.USER).reply((config) => {
    const data = JSON.parse(config.data);
    return [200, { code: 200, status: true, message: "Thêm thành công", data: { ...data, id: Date.now() } }];
  });

  mock.onPatch(new RegExp(`${RESOURCE.USER}/\\d+`)).reply((config) => {
    const data = JSON.parse(config.data);
    return [200, { code: 200, status: true, message: "Cập nhật thành công", data }];
  });

  mock.onDelete(new RegExp(`${RESOURCE.USER}/\\d+`)).reply(200, { code: 200, status: true, message: "Xóa thành công" });

  // --- PRODUCTS MOCK ---

  mock.onGet("/products").reply(200, {
    code: 200,
    status: true,
    data: {
      collection: products,
      total: products.length,
      current_page: 1,
      last_page: 1
    }
  });

  mock.onGet(new RegExp("/products/.+")).reply((config) => {
    const id = config.url!.split("/").pop();
    const product = products.find((p) => p.id === id);
    return product
      ? [200, { code: 200, status: true, data: product }]
      : [404, { code: 404, message: "Không tìm thấy sản phẩm" }];
  });

  mock.onPost("/products").reply((config) => {
    const data = JSON.parse(config.data);
    return [
      200,
      { code: 200, status: true, message: "Thêm sản phẩm thành công", data: { ...data, id: "P" + Date.now() } }
    ];
  });

  mock.onPatch(new RegExp("/products/.+")).reply((config) => {
    const data = JSON.parse(config.data);
    return [200, { code: 200, status: true, message: "Cập nhật thành công", data }];
  });

  mock.onDelete(new RegExp("/products/.+")).reply(200, { code: 200, status: true, message: "Xóa thành công" });

  // --- OPTIONS MOCK ---

  mock.onGet("/roles/options").reply(200, {
    code: 200,
    status: true,
    data: { collection: roles }
  });

  // --- NOTIFICATIONS MOCK ---

  const notifications = [
    {
      id: "1",
      title: "Cài đặt hệ thống",
      description: "Hệ thống vừa được cập nhật phiên bản mới.",
      type: "info",
      read: false,
      createdAt: "5 phút trước"
    },
    {
      id: "2",
      title: "Người dùng mới",
      description: "Có 5 người dùng mới vừa đăng ký tài khoản.",
      type: "success",
      read: true,
      createdAt: "1 giờ trước"
    }
  ];

  mock.onGet("/notifications").reply(200, {
    code: 200,
    status: true,
    data: notifications
  });

  mock.onPatch(new RegExp("/notifications/.+/read")).reply(200, { code: 200, status: true });
  mock.onPatch("/notifications/read-all").reply(200, { code: 200, status: true });

  // --- DASHBOARD MOCK ---

  mock.onGet(`${RESOURCE.DASHBOARD}/stats`).reply(200, {
    code: 200,
    status: true,
    data: {
      totalUsers: 1500,
      activeUsers: 850,
      totalRevenue: 500000000,
      totalOrders: 320
    }
  });

  mock.onGet(`${RESOURCE.DASHBOARD}/activities`).reply(200, {
    code: 200,
    status: true,
    data: [
      { id: "1", user: "Admin", action: "Đã cập nhật cấu hình hệ thống", timestamp: "2 phút trước", type: "config" },
      { id: "2", user: "nhanvien01", action: "Đã thêm sản phẩm mới", timestamp: "15 phút trước", type: "product" }
    ]
  });

  // --- AUTH FORGOT/RESET MOCK ---
  mock
    .onPost(RESOURCE.FORGOTPASS)
    .reply(200, { code: 200, status: true, message: "Link đặt lại mật khẩu đã được gửi" });
  mock.onPost(RESOURCE.RESET).reply(200, { code: 200, status: true, message: "Đặt lại mật khẩu thành công" });

  // --- ROLES MOCK ---

  const defaultPermissions = [
    {
      name: "users",
      actions: {
        index: true,
        create: true,
        show: true,
        edit: true,
        delete: true,
        export: true,
        showMenu: true
      }
    },
    {
      name: "roles",
      actions: {
        index: true,
        create: true,
        show: true,
        edit: true,
        delete: true,
        export: true,
        showMenu: true
      }
    },
    {
      name: "thong-bao",
      actions: {
        index: true,
        create: true,
        show: true,
        edit: true,
        delete: true,
        export: true,
        showMenu: true
      }
    },
    {
      name: "khach-hang",
      actions: {
        index: true,
        create: true,
        show: true,
        edit: true,
        delete: true,
        export: true,
        showMenu: true
      }
    },
    {
      name: "qua-trinh-khach-hang",
      actions: {
        index: true,
        create: true,
        show: true,
        edit: true,
        delete: true,
        export: true,
        showMenu: true
      }
    },
    {
      name: "trang-thai",
      actions: {
        index: true,
        create: true,
        show: true,
        edit: true,
        delete: true,
        export: true,
        showMenu: true
      }
    },
    {
      name: "dashboard",
      actions: {
        index: true,
        create: true,
        show: true,
        edit: true,
        delete: true,
        export: true,
        showMenu: true
      }
    },
    {
      name: "cong-viec",
      actions: {
        index: true,
        create: true,
        show: true,
        edit: true,
        delete: true,
        export: true,
        showMenu: true
      }
    }
  ];

  const rolesList = [
    {
      id: 1,
      ma_vai_tro: "ADMIN",
      ten_vai_tro: "Quản trị viên",
      phan_quyen: defaultPermissions,
      ngay_tao: "2024-01-01T00:00:00.000Z",
      ngay_cap_nhat: "2024-01-01T00:00:00.000Z"
    },
    {
      id: 2,
      ma_vai_tro: "USER",
      ten_vai_tro: "Người dùng",
      phan_quyen: defaultPermissions.map((p) => ({
        ...p,
        actions: { ...p.actions, delete: false, create: false, edit: false }
      })),
      ngay_tao: "2024-01-02T00:00:00.000Z",
      ngay_cap_nhat: "2024-01-02T00:00:00.000Z"
    }
  ];

  mock.onPost(`${RESOURCE.ROLES}/default-permission`).reply(200, {
    code: 200,
    status: true,
    data: defaultPermissions
  });

  mock.onGet(RESOURCE.ROLES).reply((config) => {
    // Basic pagination mock
    const { page = 1, limit = 10 } = config.params || {};
    const start = (page - 1) * limit;
    const end = start + limit;
    const pagedRoles = rolesList.slice(start, end);

    return [
      200,
      {
        code: 200,
        status: true,
        message: "OK",
        data: {
          collection: pagedRoles,
          total: rolesList.length,
          current_page: Number(page),
          last_page: Math.ceil(rolesList.length / limit)
        }
      }
    ];
  });

  mock.onGet(new RegExp(`${RESOURCE.ROLES}/\\d+`)).reply((config) => {
    const id = parseInt(config.url!.split("/").pop()!);
    const role = rolesList.find((r) => r.id === id);
    return role
      ? [200, { code: 200, status: true, data: role }]
      : [404, { code: 404, message: "Không tìm thấy vai trò" }];
  });

  mock.onPost(RESOURCE.ROLES).reply((config) => {
    const data = JSON.parse(config.data);
    const newRole = {
      ...data,
      id: Date.now(),
      ngay_tao: new Date().toISOString(),
      ngay_cap_nhat: new Date().toISOString()
    };
    // In a real mock, you'd push to rolesList, but for static mock responses usually just return success is enough for frontend dev
    return [200, { code: 200, status: true, message: "Thêm vai trò thành công", data: newRole }];
  });

  mock.onPatch(new RegExp(`${RESOURCE.ROLES}/\\d+`)).reply((config) => {
    const data = JSON.parse(config.data);
    return [200, { code: 200, status: true, message: "Cập nhật vai trò thành công", data }];
  });

  mock.onDelete(new RegExp(`${RESOURCE.ROLES}/\\d+`)).reply(200, {
    code: 200,
    status: true,
    message: "Xóa vai trò thành công"
  });

  // --- FALLBACK ---
  mock.onAny().passThrough();
};

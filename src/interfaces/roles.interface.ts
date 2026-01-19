export interface IPermissionAction {
  index: boolean;
  create: boolean;
  show: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  showMenu: boolean;
}

export interface IPermission {
  name: string;
  actions: IPermissionAction;
}

export interface IRoles {
  id: number;
  ma_vai_tro: string;
  ten_vai_tro: string;
  phan_quyen: IPermission[];
  ngay_tao: string;
  ngay_cap_nhat: string;
}

/**
 * Resource-based actions (New system)
 */
export interface ResourceAction {
  index?: boolean;
  create?: boolean;
  show?: boolean;
  edit?: boolean;
  delete?: boolean;
  export?: boolean;
  showMenu?: boolean;
}

/**
 * User permission structure (New system)
 */
export interface UserPermission {
  name: string;
  actions: ResourceAction;
}

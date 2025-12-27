import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";

export const signOut = async () => {
  store.dispatch(logout());
};

export const getToken = () => {
  return store.getState().auth.user?.token;
};

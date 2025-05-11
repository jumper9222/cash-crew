import { CurrentUser } from "user.types";
import { categories } from "./categoriesConfig";

export const initialState: CurrentUser = {
  displayName: "",
  email: "",
  phoneNumber: "",
  photoURL: "",
  uid: "",
  birthday: "",
  gender: "",
  loading: false,
  settings: {
    defaultCurrency: "MYR",
    categories: categories,
  },
};

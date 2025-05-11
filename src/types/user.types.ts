import { Categories } from "../configs/categoriesConfig";

export type CurrentUser = {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  uid: string;
  birthday: string;
  gender: string;
  loading: boolean;
  settings: {
    defaultCurrency: string;
    categories: Categories;
  };
};

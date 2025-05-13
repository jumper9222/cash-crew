import { Categories } from "./categories.types";
import { Friend } from "./friends.types";
export type CurrentUser = {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  uid: string;
  birthday: string;
  gender: string;
  loading: boolean;
  friends: Friend[];
  settings: {
    defaultCurrency: string;
    categories: Categories;
  };
};

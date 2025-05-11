export type Category = {
  name: string;
  type: string;
  emoji: string;
  parentCategory: string | null;
  parentCategoryID: string | null;
};

export type Categories = Record<string, Category>;

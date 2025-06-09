import { Parser, createQueryState, useQueryState } from "@/lib/query-state";
import { useCategories } from "@/services";

export const SORT_OPTIONS = ["asc", "desc"] as const;
export const SORT_OPTION_LABEL: Record<(typeof SORT_OPTIONS)[number], string> =
  {
    asc: "오름차순",
    desc: "내림차순",
  };

const defaultValue = {
  page: 1,
  sort: "asc",
  categories: [],
  instock: false,
  rating: null,
} as const;

export const useProductListPageQueryState = () => {
  const { data: categories } = useCategories();
  const categorieValues = categories.map((category) => category.value);

  const ProductListPageQueryState = createQueryState({
    page: Parser.Page.catch(defaultValue.page),
    sort: Parser.OneOf(SORT_OPTIONS).catch(defaultValue.sort),
    categories: Parser.ArrayOf(categorieValues).catch(defaultValue.categories),
    instock: Parser.Boolean.catch(defaultValue.instock),
    rating: Parser.StarRating.nullable().catch(defaultValue.rating),
  });

  const queryState = useQueryState(ProductListPageQueryState, defaultValue);

  return {
    defaultValue,
    ...queryState,
  };
};

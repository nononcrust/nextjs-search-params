import { useSuspenseQuery } from "@tanstack/react-query";

const categories = [
  { label: "가전", value: "electronics" },
  { label: "도서", value: "books" },
  { label: "의류", value: "clothing" },
];

export const useCategories = () => {
  return useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return categories;
    },
  });
};

"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { useCheckboxGroup } from "@/hooks/use-checkbox-group";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { SearchParam } from "@/lib/search-param";
import { FilterIcon, RotateCcwIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod/v4";

const CATEGORIES = ["electronics", "books", "clothing"] as const;
const CATEGORY_LABEL: Record<(typeof CATEGORIES)[number], string> = {
  electronics: "전자제품",
  books: "도서",
  clothing: "의류",
};

const SORT_OPTIONS = ["asc", "desc"] as const;
const SORT_OPTION_LABEL: Record<(typeof SORT_OPTIONS)[number], string> = {
  asc: "오름차순",
  desc: "내림차순",
};

const defaultSearchParams = {
  page: 1,
  sort: "asc",
  categories: [],
  instock: false,
} as const;

type ProductListPageSearchParams = z.infer<typeof ProductListPageSearchParams>;
const ProductListPageSearchParams = z.object({
  page: SearchParam.Page.catch(defaultSearchParams.page),
  sort: SearchParam.Enum(SORT_OPTIONS).catch(defaultSearchParams.sort),
  categories: SearchParam.ArrayOf(CATEGORIES).catch(
    defaultSearchParams.categories
  ),
  instock: SearchParam.Boolean.catch(defaultSearchParams.instock),
});

export default function ProductListPage() {
  return (
    <main className="h-dvh flex justify-center items-center flex-col gap-2">
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>
            <FilterIcon className="size-3" />
            필터
          </Button>
        </Dialog.Trigger>
        <Dialog.Content className="w-[320px]">
          <Dialog.Header>
            <Dialog.Title>검색 옵션</Dialog.Title>
            <Dialog.Description className="sr-only">
              검색 옵션을 선택해주세요.
            </Dialog.Description>
          </Dialog.Header>
          <SearchOption />
        </Dialog.Content>
      </Dialog>
    </main>
  );
}

const SearchOption = () => {
  const searchParams = useSearchParams();
  const parsedSearchParams = ProductListPageSearchParams.parse(
    Object.fromEntries(searchParams.entries())
  );

  const { updateMultiple } =
    useUpdateSearchParams<ProductListPageSearchParams>(defaultSearchParams);

  const page = parsedSearchParams.page;
  const [sort, setSort] = useState(parsedSearchParams.sort);
  const [inStock, setInStock] = useState(parsedSearchParams.instock);
  const categoriesCheckboxGroup = useCheckboxGroup({
    entries: CATEGORIES,
    initialEntries: parsedSearchParams.categories,
  });

  const applyFilter = () => {
    updateMultiple([
      ["page", page],
      ["sort", sort],
      ["categories", categoriesCheckboxGroup.checkedItems],
      ["instock", inStock],
    ]);
  };

  const resetFilter = () => {
    setSort(defaultSearchParams.sort);
    setInStock(defaultSearchParams.instock);
    categoriesCheckboxGroup.setCheckedItems(defaultSearchParams.categories);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <span className="font-semibold text-[15px]">정렬</span>
      <RadioGroup value={sort} onChange={setSort}>
        {SORT_OPTIONS.map((sort) => (
          <RadioGroup.Option key={sort} value={sort}>
            {SORT_OPTION_LABEL[sort]}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
      <span className="font-semibold text-[15px] mt-4">카테고리</span>
      {CATEGORIES.map((category) => (
        <Checkbox
          key={category}
          {...categoriesCheckboxGroup.getCheckboxProps(category)}
        >
          <Checkbox.Label>{CATEGORY_LABEL[category]}</Checkbox.Label>
        </Checkbox>
      ))}
      <span className="font-semibold text-[15px] mt-4">기타</span>
      <Checkbox checked={inStock} onChange={setInStock}>
        <Checkbox.Label>재고 있는 상품만</Checkbox.Label>
      </Checkbox>
      <div className="flex gap-2 mt-4 justify-between">
        <Button size="large" variant="outlined" onClick={resetFilter}>
          <RotateCcwIcon className="size-4" />
          초기화
        </Button>
        <Dialog.Close asChild>
          <Button size="large" onClick={applyFilter}>
            적용하기
          </Button>
        </Dialog.Close>
      </div>
    </div>
  );
};

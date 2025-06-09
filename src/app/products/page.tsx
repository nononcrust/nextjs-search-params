"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { useControlledCheckboxGroup } from "@/hooks/use-controlled-checkbox-group";
import { useQueryState } from "@/hooks/use-query-state";
import { SearchParam } from "@/lib/search-param";
import { useCategories } from "@/services";
import { FilterIcon, RotateCcwIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod/v4";

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
  rating: null,
} as const;

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
  const { data: categories } = useCategories();

  const { searchParams, updateMany } = useProductListPageQueryState();

  const defaultFilters = {
    sort: searchParams.sort,
    instock: searchParams.instock,
    rating: searchParams.rating,
    categories: searchParams.categories,
  };

  const [filters, setFilters] = useState(defaultFilters);

  const categoriesCheckboxGroup = useControlledCheckboxGroup({
    checkedItems: filters.categories,
    entries: categories.map((category) => category.value),
    onCheckedItemsChange: (checkedItems) => {
      setFilters((prev) => ({
        ...prev,
        categories: checkedItems,
      }));
    },
  });

  const applyFilter = () => {
    updateMany(filters);
  };

  const resetFilter = () => {
    setFilters({
      sort: defaultSearchParams.sort,
      instock: defaultSearchParams.instock,
      rating: defaultSearchParams.rating,
      categories: defaultSearchParams.categories,
    });
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <span className="font-semibold text-[15px]">정렬</span>
      <RadioGroup
        value={filters.sort}
        onChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
      >
        {SORT_OPTIONS.map((sort) => (
          <RadioGroup.Option key={sort} value={sort}>
            {SORT_OPTION_LABEL[sort]}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
      <span className="font-semibold text-[15px] mt-4">카테고리</span>
      {categories.map((category) => (
        <Checkbox
          key={category.value}
          {...categoriesCheckboxGroup.getCheckboxProps(category.value)}
        >
          <Checkbox.Label>{category.label}</Checkbox.Label>
        </Checkbox>
      ))}
      <span className="font-semibold text-[15px] mt-4">평점</span>
      <StarRatingRadioGroup
        value={filters.rating}
        onChange={(rating) => setFilters((prev) => ({ ...prev, rating }))}
      />
      <span className="font-semibold text-[15px] mt-4">기타</span>
      <Checkbox
        checked={filters.instock}
        onChange={(checked) =>
          setFilters((prev) => ({ ...prev, instock: checked }))
        }
      >
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

const useProductListPageQueryState = () => {
  const { data: categories } = useCategories();
  const categorieValues = categories.map((category) => category.value);

  const ProductListPageSearchParams = z.object({
    page: SearchParam.Page.catch(defaultSearchParams.page),
    sort: SearchParam.OneOf(SORT_OPTIONS).catch(defaultSearchParams.sort),
    categories: SearchParam.ArrayOf(categorieValues).catch(
      defaultSearchParams.categories
    ),
    instock: SearchParam.Boolean.catch(defaultSearchParams.instock),
    rating: SearchParam.StarRating.nullable().catch(defaultSearchParams.rating),
  });

  const { searchParams, updateMany } = useQueryState(
    ProductListPageSearchParams,
    defaultSearchParams
  );

  return {
    searchParams,
    updateMany,
  };
};

const StarRatingRadioGroup = ({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) => {
  const options = [1, 2, 3, 4, 5] as const;

  const onClick = (option: number) => {
    if (value === option) {
      onChange(null);
    } else {
      onChange(option);
    }
  };

  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onClick(option)}
          aria-label={`평점 ${option}점`}
        >
          <StarIcon
            className={
              value && value >= option
                ? "fill-yellow-400 stroke-yellow-400"
                : "fill-gray-200 stroke-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
};

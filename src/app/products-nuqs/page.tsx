"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { useControlledCheckboxGroup } from "@/hooks/use-controlled-checkbox-group";
import { useCategories } from "@/services";
import { FilterIcon, RotateCcwIcon, StarIcon } from "lucide-react";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { useState } from "react";

const SORT_OPTIONS = ["asc", "desc"] as const;
const SORT_OPTION_LABEL: Record<(typeof SORT_OPTIONS)[number], string> = {
  asc: "오름차순",
  desc: "내림차순",
};

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
  const { data: allCategories } = useCategories();

  const {
    categories,
    setCategories,
    sort,
    setSort,
    instock,
    setInstock,
    rating,
    setRating,
    defaultSearchParams,
  } = useProductListPageQueryState();

  const defaultFilters = {
    sort: sort,
    instock: instock,
    rating: rating,
    categories: categories,
  };

  const [filters, setFilters] = useState(defaultFilters);

  const categoriesCheckboxGroup = useControlledCheckboxGroup({
    checkedItems: filters.categories,
    entries: allCategories.map((category) => category.value),
    onCheckedItemsChange: (checkedItems) => {
      setFilters((prev) => ({
        ...prev,
        categories: checkedItems as string[],
      }));
    },
  });

  const applyFilter = () => {
    setSort(filters.sort);
    setInstock(filters.instock);
    setRating(filters.rating);
    setCategories(filters.categories);
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
      {allCategories.map((category) => (
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
  const defaultSearchParams = {
    page: 1,
    sort: "asc",
    instock: false,
    rating: null,
    categories: [] as string[],
  } as const;

  const [page, setPage] = useQueryState("page", parseAsInteger);
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(SORT_OPTIONS).withDefault("asc")
  );
  const [categories, setCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [instock, setInstock] = useQueryState(
    "instock",
    parseAsBoolean.withDefault(false)
  );
  const [rating, setRating] = useQueryState(
    "rating",
    parseAsNumberLiteral(STAR_RATINGS)
  );

  return {
    page,
    setPage,
    sort,
    setSort,
    categories,
    setCategories,
    instock,
    setInstock,
    rating,
    setRating,
    defaultSearchParams,
  };
};

type StarRating = (typeof STAR_RATINGS)[number];
const STAR_RATINGS = [1, 2, 3, 4, 5] as const;

const StarRatingRadioGroup = ({
  value,
  onChange,
}: {
  value: StarRating | null;
  onChange: (value: StarRating | null) => void;
}) => {
  const onClick = (option: StarRating) => {
    if (value === option) {
      onChange(null);
    } else {
      onChange(option);
    }
  };

  return (
    <div className="flex gap-1">
      {STAR_RATINGS.map((option) => (
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

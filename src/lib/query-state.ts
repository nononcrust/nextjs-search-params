import { z } from "zod/v4";
import { objectEntries } from "@/lib/object";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const createQueryState = z.object;

const Page = z.coerce.number().int().positive();

const StarRating = z.enum(["1", "2", "3", "4", "5"]).transform(Number);

const Boolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const ArrayOf = <T extends readonly string[]>(value: T) =>
  z
    .string()
    .transform((value) => value.split(","))
    .readonly()
    .pipe(z.array(z.enum(value)).readonly());

const OneOf = <T extends readonly string[]>(value: T) => z.enum(value);

export const Parser = {
  /**
   * 페이지 번호를 나타내는 쿼리 파라미터를 정의합니다.
   * 페이지 번호로는 1보다 큰 정수만 허용됩니다.
   *
   * "1" -> 1
   * "2" -> 2
   * "3" -> 3
   *
   * @example
   * SearchParam.Page.catch(1)
   *
   */
  Page,
  /**
   * boolean을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * "true" -> true
   * "false" -> false
   *
   * @example
   * SearchParam.Boolean.catch(false)
   *
   */
  Boolean,
  /**
   * 문자열로 이루어진 배열을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * "book%2Cclothing" -> ["book", "clothing"]
   *
   * @example
   * SearchParam.ArrayOf(["book", "clothing"]).catch([])
   *
   */
  ArrayOf,
  /**
   * 특정 문자열을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * @example
   * SearchParam.Enum(["asc", "desc"]).catch("asc")
   */
  OneOf,
  /**
   * 별점(1, 2, 3, 4, 5)을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * @example
   * SearchParam.StarRating.catch(5)
   * SearchParam.StarRating.nullable().catch(null)
   */
  StarRating,
};

export const getQueryState = async <TSchema extends z.ZodType>(
  schema: TSchema,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) => {
  return schema.parse(await searchParams);
};

export const useQueryState = <TSchema extends z.ZodType>(
  schema: TSchema,
  defaultValue: z.infer<TSchema>
) => {
  type TSearchParams = z.infer<TSchema>;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const compareValue = (
    a: TSearchParams[keyof TSearchParams] | undefined,
    b: TSearchParams[keyof TSearchParams]
  ) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return (
        a.length === b.length && a.every((value, index) => value === b[index])
      );
    }

    return a === b;
  };

  const encodeValue = (value: TSearchParams[keyof TSearchParams]) => {
    if (Array.isArray(value)) {
      return value.join(",");
    }

    return String(value);
  };

  const value = schema.parse(Object.fromEntries(searchParams.entries()));

  const update = <TKey extends keyof TSearchParams>(
    key: TKey,
    value: TSearchParams[TKey]
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (compareValue(value, defaultValue[key])) {
      params.delete(key.toString());
    } else {
      params.set(key.toString(), encodeValue(value));
    }

    router.push(pathname + "?" + params.toString());
  };

  const updateMany = (
    entries: Partial<
      Record<keyof TSearchParams, TSearchParams[keyof TSearchParams]>
    >
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    objectEntries(entries).forEach(([key, value]) => {
      if (compareValue(value, defaultValue[key as keyof TSearchParams])) {
        params.delete(key);
      } else {
        params.set(
          key,
          encodeValue(value as TSearchParams[keyof TSearchParams])
        );
      }
    });

    router.push(pathname + "?" + params.toString());
  };

  const remove = (key: keyof TSearchParams) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key.toString());

    router.push(pathname + "?" + params.toString());
  };

  const clear = () => {
    router.push(pathname);
  };

  return {
    value,
    defaultValue,
    update,
    updateMany,
    remove,
    clear,
  };
};

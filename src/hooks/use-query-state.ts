import { objectEntries } from "@/lib/object";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod/v4";

export const useQueryState = <TSchema extends z.ZodType>(
  schema: TSchema,
  defaultValues: z.infer<TSchema>
) => {
  type TSearchParams = z.infer<TSchema>;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const encodeValue = (value: TSearchParams[keyof TSearchParams]) => {
    if (Array.isArray(value)) {
      return value.join(",");
    }

    return String(value);
  };

  const parsedSearchParams = schema.parse(
    Object.fromEntries(searchParams.entries())
  );

  const update = <TKey extends keyof TSearchParams>(
    key: TKey,
    value: TSearchParams[TKey]
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === defaultValues[key]) {
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
      if (value === defaultValues[key as keyof TSearchParams]) {
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
    searchParams: parsedSearchParams,
    update,
    updateMany,
    remove,
    clear,
  };
};

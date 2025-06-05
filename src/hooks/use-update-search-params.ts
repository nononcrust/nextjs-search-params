import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useUpdateSearchParams = <TSearchParams>(
  defaultValues: TSearchParams
) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const encodeValue = (value: TSearchParams[keyof TSearchParams]) => {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }

    return String(value);
  };

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

  const updateMultiple = (
    entries: {
      [K in keyof TSearchParams]: [K, TSearchParams[K]];
    }[keyof TSearchParams][]
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    entries.forEach(([key, value]) => {
      if (value === defaultValues[key]) {
        params.delete(key.toString());
      } else {
        params.set(key.toString(), encodeValue(value));
      }
    });

    router.push(pathname + "?" + params.toString());
  };

  return { update, updateMultiple };
};

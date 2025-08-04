import { TableProps, TablePaginationConfig } from "antd";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChangeEventHandler, useCallback, useMemo } from "react";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { User } from "@/graphql/generated/graphql";

interface UsePaginatedQueryParamsOptions {
  defaultValues?: {
    current?: number;
    pageSize?: number;
  };
  filterKeys?: string[];
  sortKeys?: string[];
}

type QueryParams = {
  current?: number;
  pageSize?: number;
  search?: string | null;
  sortField?: string | null;
  sortOrder?: "ascend" | "descend" | null;
} & Record<string, string | null | undefined | number>;

export function usePaginatedQueryParams({
  defaultValues = { current: 1, pageSize: 10 },
  filterKeys = [],
  sortKeys = [],
}: UsePaginatedQueryParamsOptions = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const current = Number(searchParams.get("current") ?? defaultValues.current);
  const pageSize = Number(
    searchParams.get("pageSize") ?? defaultValues.pageSize
  );
  const search = searchParams.get("search") ?? undefined;
  const sortField = searchParams.get("sortField") ?? undefined;
  const sortOrder =
    (searchParams.get("sortOrder") as "ascend" | "descend" | null) ?? undefined;

  const selectedFilters = useMemo(() => {
    const result: Record<string, string | undefined> = {};
    for (const key of filterKeys) {
      const value = searchParams.get(key);
      if (value !== null) result[key] = value;
    }
    return result;
  }, [filterKeys, searchParams]);

  const updateQuery = useCallback(
    (newParams: QueryParams) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newParams.current !== undefined) {
        params.set("current", newParams.current.toString());
      }
      if (newParams.pageSize !== undefined) {
        params.set("pageSize", newParams.pageSize.toString());
      }

      if ("search" in newParams) {
        if (newParams.search) {
          params.set("search", newParams.search);
          params.set("current", "1");
        } else {
          params.delete("search");
        }
      }

      if ("sortField" in newParams) {
        if (newParams.sortField) {
          params.set("sortField", newParams.sortField);
        } else {
          params.delete("sortField");
        }
      }
      if ("sortOrder" in newParams) {
        if (newParams.sortOrder) {
          params.set("sortOrder", newParams.sortOrder);
        } else {
          params.delete("sortOrder");
        }
      }

      filterKeys.forEach((key) => {
        if (key in newParams) {
          const value = newParams[key];
          if (value) {
            params.set(key, String(value));
            params.set("current", "1");
          } else {
            params.delete(key);
          }
        }
      });

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, pathname, router, filterKeys]
  );

  const onTableChange: TableProps<User>["onChange"] = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, FilterValue | null>,
      sorter: SorterResult<User> | SorterResult<User>[]
    ) => {
      const newParams: QueryParams = {
        current: pagination.current,
        pageSize: pagination.pageSize,
      };

      if (!Array.isArray(sorter) && sorter.field && sorter.order) {
        newParams.sortField = sorter.field as string;
        newParams.sortOrder = sorter.order;
      } else {
        newParams.sortField = null;
        newParams.sortOrder = null;
      }

      updateQuery(newParams);
    },
    [updateQuery]
  );

  const handleSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      updateQuery({ search: e.target.value.trim() ?? null, current: 1 });
    },
    [updateQuery]
  );

  const handleSelectChange = useCallback(
    (key: string, value: string) => {
      updateQuery({ [key]: value ?? null, current: 1 });
    },
    [updateQuery]
  );

  return useMemo(
    () => ({
      current,
      pageSize,
      search,
      sortField,
      sortOrder,
      selectedFilters,
      updateQuery,
      onTableChange,
      handleSearch,
      handleSelectChange,
    }),
    [
      current,
      pageSize,
      search,
      sortField,
      sortOrder,
      selectedFilters,
      updateQuery,
      onTableChange,
      handleSearch,
      handleSelectChange,
    ]
  );
}

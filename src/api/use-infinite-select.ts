import { useClient } from 'react-supabase';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import {
  Dispatch, SetStateAction,
} from 'react';
import { UseSelectState } from 'react-supabase/dist/types/hooks/data/use-select';
import { useSWRInfinite } from 'swr';
import { SupabaseClient } from '@supabase/supabase-js';

export type PagedFilter<Data> = (
  query: PostgrestFilterBuilder<Data>,
  page: number, limit: number) => PostgrestFilterBuilder<Data>;
export type UseInfiniteSelectConfig<Data = any> = {
  columns?: string,
  filter?: PagedFilter<Data>,
  initialPage?: number,
  limit?: number,
};
export type UseInfiniteSelectState<Data> = Omit<UseSelectState<Data>, 'data'> & {
  page: number,
  data: Data[][],
  hasMore: boolean,
};
export type UseInfiniteSelectResponse<Data = any> = [
  UseInfiniteSelectState<Data>,
  Dispatch<SetStateAction<number>>,
  () => void,
];

type UseInfiniteKey<Data = any> = [string, string, PagedFilter<Data>, number, number];
const generateKey = <Data = any>(
  table: string,
  config: UseInfiniteSelectConfig<Data>,
) => (page: number): UseInfiniteKey<Data> => {
    const {
      columns = '*',
      filter,
      limit = 10,
    } = config;
    return [table, columns, filter, limit, page];
  };

const createFetcher = <Data = any>(client: SupabaseClient) => (
  table: string,
  columns: string,
  filter: PagedFilter<Data>,
  limit: number,
  page: number,
): Promise<Data[]> => {
  const query = client
    .from(table)
    .select(columns)
    .range((page) * limit, page * limit + limit - 1);
  return filter(query, page, limit)
    .then(({ data, error }) => {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
      if (error) throw error;
      return data;
    }) as Promise<Data[]>;
};
export function useInfiniteSelect<Data = any>(
  table: string,
  config: UseInfiniteSelectConfig<Data> = {},
) {
  const client = useClient();
  return useSWRInfinite<Data[]>(generateKey(table, config), createFetcher(client));
}

import { useCallback } from 'react';
import type { PagedFilter } from './use-infinite-select';

// eslint-disable-next-line import/prefer-default-export
export function useInfiniteFilter<Data = any>(
  filter: PagedFilter<Data>,
  deps: any[] = [],
): PagedFilter<Data> {
  return useCallback(filter, deps);
}

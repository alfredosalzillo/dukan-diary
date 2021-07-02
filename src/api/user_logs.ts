import { useInfiniteFilter } from './use-infinite-filter';
import { useInfiniteSelect } from './use-infinite-select';

export type UserLogType = 'weight' | 'diet' | 'physical_activity' | 'mood' | 'photo' | 'meal';

export type UserLog = {
  id: string,
  user_id: string,
  type: UserLogType,
  value: string,
  date: string,
  created_at: string,
  updated_at: string,
  version: number,
};

export const useUserLogInfinite = (limit = 10) => {
  const filter = useInfiniteFilter((query) => query
    .order('date', {
      ascending: false,
    })
    .order('created_at', {
      ascending: false,
    }), []);
  return useInfiniteSelect('user_logs', {
    columns: '*',
    filter,
    limit,
  });
};

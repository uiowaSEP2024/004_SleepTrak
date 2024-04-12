import { Paginator } from '@twilio/conversations';

export const getPaginatorItems = <T>(paginator: Paginator<T>) => {
  const items: T[] = [];
  items.push(...paginator.items);
  while (paginator.hasNextPage) {
    items.push(...paginator.items);
  }
  return items;
};

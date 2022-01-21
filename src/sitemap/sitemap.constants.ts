import { TopLevelCategory } from 'src/top-page/top-page.model';

type routeTypeMap = Record<TopLevelCategory, string>;

export const CATEGORY_URL: routeTypeMap = {
  0: '/courses',
  1: '/services',
  2: '/books',
  3: '/products',
}
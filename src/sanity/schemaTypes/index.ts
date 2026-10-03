import { collection } from './collection';
import { customRequest } from './customRequest';
import { order } from './order';
import { page } from './page';
import { product } from './product';
import { settings } from './settings';
import { blockContent, seo } from './shared';

export const schemaTypes = [
  product,
  collection,
  order,
  customRequest,
  page,
  settings,
  blockContent,
  seo,
];

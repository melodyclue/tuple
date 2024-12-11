import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  // List your search param keys and associated parsers here:
  id: parseAsString.withDefault(''),
  // q: parseAsString.withDefault(''),
  // maxResults: parseAsInteger.withDefault(10),
});

import { TrigramConfig } from './ITrigram';

export const TRIGRAM_DEFAULT_CONFIG: Required<TrigramConfig> = {
  idField: 'id',
  searchField: 'title',
  sortField: 'sort',
  count: 10,
  minRate: 0,
};

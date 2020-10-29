export type TrigramInputItem = {
  id?: string | number;
  title?: string;
  sort?: number;
  [key: string]: unknown;
};

export type TrigramInput = TrigramInputItem[];

export type TrigramOutputItem = {
  value: TrigramInputItem;
  rate: number;
};

export type TrigramOutput = TrigramOutputItem[];

export type TrigramIndex = {
  [key: string]: number[];
};

export type TrigramFindSettings = {
  count?: number;
  minRate?: number;
};

export type TrigramConfig = {
  idField?: string;
  searchField?: string;
  sortField?: string;
} & TrigramFindSettings;

export interface ITrigram {
  find(query: string, settings: TrigramFindSettings): TrigramOutput;
}

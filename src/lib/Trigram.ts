import { ITrigram, TrigramConfig, TrigramIndex, TrigramInput, TrigramInputItem, TrigramOutput, TrigramOutputItem } from './ITrigram';
import { TRIGRAM_DEFAULT_CONFIG } from './constants';

const { idField: defIdField, searchField: defSearchField, sortField: defSortField, count: defCount, minRate: defMinRate } = TRIGRAM_DEFAULT_CONFIG;

export class Trigram implements ITrigram {

  private items: TrigramInput = [];
  private index: TrigramIndex = {};
  private idField: string;
  private searchField: string;
  private sortField: string;
  private count: number;
  private minRate: number;

  constructor(input: TrigramInput = [], {
    idField = defIdField,
    searchField = defSearchField,
    sortField = defSortField,
    count = defCount,
    minRate = defMinRate,
  }: TrigramConfig = {}) {
    this.idField = idField;
    this.searchField = searchField;
    this.sortField = sortField;
    this.count = count;
    this.minRate = minRate;

    input.forEach(this.addToIndex);
  }

  private addToIndex = (item: TrigramInputItem): void => {
    if (
      !item ||
      this.items.find((storedItem) => storedItem[this.idField] === item[this.idField]) ||
      typeof item[this.searchField] !== 'string'
    ) {
      return;
    }

    const id = this.items.push(item) - 1;
    Trigram.toTrigrams(item[this.searchField] as string, (trigram) => {
      const idsForTrigram = this.index[trigram] || [];
      if (idsForTrigram.indexOf(id) < 0) {
        idsForTrigram.push(id);
      }
      this.index[trigram] = idsForTrigram;
    });
  }

  public find(query = '', { count = this.count, minRate = this.minRate } = {}): TrigramOutput {
    const matches: { [key: number]: number } = {};
    Trigram.toTrigrams(query, (trigram) => {
      const idsForTrigram = this.index[trigram];
      if (idsForTrigram) {
        idsForTrigram.forEach((index) => {
          if (!matches[index]) {
            matches[index] = 0;
          }
          matches[index] += 1;
        });
      }
    });

    const result: TrigramOutput = [];
    Object.entries(matches).forEach(([i, rate]) => {
      if (!minRate || rate >= minRate) {
        result.push({ value: this.items[+i], rate });
      }
    });

    const sorter = this.sort.bind(this, query);
    result
      .sort(sorter)
      .splice(count || result.length);

    return result;
  }

  private sort (
    query: string,
    { value: { [this.searchField]: aTitle = '', [this.sortField]: aSort = 0 }, rate: aRawRate }: TrigramOutputItem,
    { value: { [this.searchField]: bTitle = '', [this.sortField]: bSort = 0 }, rate: bRawRate }: TrigramOutputItem,
  ): number {
    const q = query.toLowerCase();

    const aMatch = Number((<string>aTitle).toLowerCase().startsWith(q));
    const bMatch = Number((<string>bTitle).toLowerCase().startsWith(q));

    const aRate = aSort ? aRawRate + <number>aSort : aRawRate;
    const bRate = bSort ? bRawRate + <number>bSort : bRawRate;

    return (bMatch - aMatch) || (bRate - aRate) || (<string>aTitle).localeCompare(<string>bTitle);
  }

  private static toTrigrams(phrase: string, callback: (index: string) => void): void {
    const rawData = `  ${phrase.toLowerCase()}  `;
    for (let i = rawData.length - 3; i >= 0; i -= 1) {
      callback(rawData.slice(i, i + 3));
    }
  }
}

# Trigram search

Trigram-based library for fast indexing and search over large arrays of data, written in TypeScript, built for Node.js and browser.

## Demo
[At codesandbox](https://codesandbox.io/s/trigram-search-example-1cv0k)

## Installation
```shell script
npm i trigram-search
```

## Usage
```javascript
import Trigram from "trigram-search";
// or
// import Trigram from "trigram-search/build/browser";
```

```
const data = [{ id: 0, title: "Javascript" }, { id: 1, title: "Python" }, { id: 2, title: "Go" }, ...];
const searcher = new Trigram(data);

searcher.find('Py'); // will output sorted array of results
```

## API
### Constructor

```javascript
new Trigram(items, config);
```
`items` — array of objects with `id`, `title` and optional `sort` fields (defaults).

`id` — must be unique

`title` — contains text for search

`sort` — can be used to prioritize specific items higher in the results, even if match rate for them is lower

`config`:

```typescript
type TrigramConfig = {
  idField?: string; // key of the unique field of each item, default — "id"
  searchField?: string; // key of text-for-search field of each item, default — "title"
  sortField?: string; // key of sort field of each item, default — "sort"
  count?: number; // max length of the result array, default — "10"
  minRate?: number; // min match rate for item to be added to result, default — "0"
}
```

### Methods

```typescript
interface ITrigram {
  find(query: string, settings?: { count?: number; minRate?: number; }): TrigramOutput;
}
```

`count` and `minRate` in arguments will take precedence over global instance settings.

```typescript
type TrigramOutput = {
  value: any; // item from input
  rate: number; // match rating of item for provided query    
}[];
```

## Credits

Original [TrigramJS](https://github.com/tqh/TrigramJS) algo by [tqh](https://github.com/tqh).

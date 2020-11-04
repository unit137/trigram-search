import test from 'ava';

import data from '../data/test-data.json';
import output from '../data/test-output.json';

import { Trigram } from './Trigram';

test('find: basic', (t) => {
  const instance = new Trigram(data);
  t.deepEqual(instance.find('c'), output);
});

test('find: sort priority', (t) => {
  const instance = new Trigram(data);
  t.true(instance.find('java')[0].value.title === 'JavaScript');
});

test('find: count', (t) => {
  const instance = new Trigram(data);
  t.true(instance.find('java', { count: 3 }).length === 3);
});

test('find: minRate', (t) => {
  const instance = new Trigram(data);
  t.true(instance.find('java', { minRate: 3 }).every(({ rate }) => rate >= 3));
});

test('settings: count', (t) => {
  const instance = new Trigram(data, { count: 3 });
  t.true(instance.find('java').length === 3);
});

test('settings: minRate', (t) => {
  const instance = new Trigram(data, { minRate: 3 });
  t.true(instance.find('java', { minRate: 3 }).every(({ rate }) => rate >= 3));
});

test('settings: custom field names', (t) => {
  const instance = new Trigram(
    data.map(({ id, title, sort }) => ({ index: id, name: title, priority: sort })),
    { idField: 'index', searchField: 'name', sortField: 'priority' },
  );
  t.true(instance.find('java')[0].value.name === 'JavaScript');
});

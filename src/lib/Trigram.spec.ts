import test from 'ava';

import data from '../data/test-data.json';
import output from '../data/test-output.json';

import { Trigram } from './Trigram';

test('find', (t) => {
  const instance = new Trigram(data);
  t.is(instance.find('java'), output);
});

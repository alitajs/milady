import { handelRef, strToKey } from './handelStr';

test('handelRef', () => {
  expect(handelRef('#/definitions/aa')).toEqual('aa');
});
test('strToKey', () => {
  expect(strToKey('#/definitions/aa')).toEqual('definitionsaa');
  expect(strToKey('你会12aa')).toEqual('你会12aa');
  expect(strToKey('')).toEqual('');
});

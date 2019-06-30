import { handelRef } from './handelStr';

test('handelRef', () => {
  expect(handelRef('#/definitions/aa')).toEqual('aa');
});

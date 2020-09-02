/** 
 * @description demo测试用例
 * @author LSKReno
 */

function sum(a, b) {
  return a + b;
}

test('1 + 2 应该等于 3', () => {
  const res = sum(1, 2)
  expect(res).toBe(3)
})
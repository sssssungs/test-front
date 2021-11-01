import { produce, enableES5 } from 'immer';
// 커밋 테스트.
export default (...args) => {
  enableES5();
  return produce(...args);
};

import { HYDRATE } from 'next-redux-wrapper';

import { combineReducers } from 'redux';
import user from './user';
import post from './post';

// 이전상태와 액션을 통해 다음상태를 만들어내는 함수 : reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({ user, post });
      return combinedReducer(state, action);
    }
  }
};

//     combineReducers({
//   index: (state = {}, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         console.log('HYDRATE', HYDRATE);
//         return { ...state, ...action.payload };
//       default:
//         return state;
//     }
//   },
//   user,
//   post,
// });

export default rootReducer;

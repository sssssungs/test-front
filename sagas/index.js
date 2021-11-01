import { all, fork } from 'redux-saga/effects';

import axios from 'axios';

import postSaga from './post';
import userSaga from './user';
import { backUrl } from '../config/config';

// axios 공통설정
axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

// effect 정리
// put : dispatch
// take : event listener 역할 (1회용이다. 한번 실행 후 그다음 같은거 동작시 이벤트 리스너가 없어져서 실행되지 않음
// takeEvery : while 문 역할을 한다. 항상 listen 하도록
// takeLatest : 이거는 여러 이벤트 들어왔을때 최근꺼 한개만. 마우스 두번 클릭시 같은 이벤트가 두개 발생하지 않음.
// ex) 저장 두번 클릭시 저장이 두번되지 않고 마지막꺼만 실행. 응답을 취소하는것.
//              -> 백엔드 기준으로 같은 요청이 두개 가는건 있음 ㅇㅇ
// takeLeading : takeLatest 의 반대. 첫번째꺼만 실행.
// throttle : 어느정도 기간을 두어서 몇초제한. 몇초 안에는 여러번 요청이 갔을 경우 요청을 한번만 되도록하자.
// fork : 비동기 함수 호출 => 실행하고 기다리지 않음.
// call : 동기함수 호출 => 실행하고 완료될때 까지 기다림.

export default function* rootSaga() {
  // while (true) {
  //     yield '무한';
  // } >> saga 멈추는 코드 실행 할때마다 멈춤. 한번씩만 딱딱 실행됨.
  yield all([ // all: 배열 안에 있는거를 한방에 실행해
    fork(postSaga), // fork: 함수를 실행한다. => non-blocking
    fork(userSaga),
  ]);
}

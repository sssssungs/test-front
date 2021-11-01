import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Checkbox, Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { END } from 'redux-saga';
import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_POST_REQUEST } from '../reducers/post';

const LabelWrapper = styled.label`
  margin-left: 5px;
  font-weight: bold;
`;

const ErrorMsg = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [nickname, onchangeNickName] = useInput('');
  const [pw, onchangePw] = useInput('');

  const [pwConfirm, setPwConfirm] = useState('');
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    if (me && me.id) Router.replace('/'); // replace : history없이 그냥 새로고침이동 (뒤로가기할 페이지 없어짐)
  }, [me && me.id]);

  const onChangePwConfirm = useCallback((e) => {
    setPwConfirm(e.target.value);
    setPwError(e.target.value !== pw);
  }, [pw]);

  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (pw !== pwConfirm) return setPwError(true);
    if (!term) return setTermError(true);
    // console.log(email, nickname, pw)
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, nickname, pw },
    });
  }, [pw, pwConfirm, term]);

  React.useEffect(() => {
    console.log(signUpDone);
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  React.useEffect(() => {
    if (signUpError) {
      alert(signUpError); //eslint-disable-line
    }
  }, [signUpError]);

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <title>Sign Up | Twitter</title>
      </Head>
      <AppLayout>
        <Form onFinish={onSubmit}>
          <div>
            <LabelWrapper htmlFor="user-email">EMAIL</LabelWrapper>
            <br />
            <Input name="user-email" value={email} type="email" onChange={onChangeEmail} required />
          </div>
          <div>
            <LabelWrapper htmlFor="user-nickname">NickName</LabelWrapper>
            <br />
            <Input name="user-nickname" value={nickname} onChange={onchangeNickName} required />
          </div>
          <div>
            <LabelWrapper htmlFor="user-password">PW</LabelWrapper>
            <br />
            <Input name="user-password" type="password" value={pw} onChange={onchangePw} required />
          </div>
          <div>
            <LabelWrapper htmlFor="user-pw-confirm">PW Confirm</LabelWrapper>
            <br />
            <Input name="user-pw-confirm" type="password" value={pwConfirm} onChange={onChangePwConfirm} required />
            { pwError && <ErrorMsg>Check your pw !</ErrorMsg> }
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>I am an asshole.</Checkbox>
            {termError && <ErrorMsg>Check above, asshole.</ErrorMsg>}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>Sign up</Button>
          </div>
        </Form>
      </AppLayout>
    </div>
  );
};

// next 9버전부터
// 이 메소드가 있으면 먼저 실행을 알아서 시켜준다.
// front ㅅㅓ버에서 실행을 해주는 부분이다. (브라우저가 개입하는게 아님)
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 여기 부분 실행된 결과를 hydrate가 받는다.
  // front 서버에서 backend 서버로 요청을 하는데 도메인이 다르기 때문에 쿠키를 자동으로 전달못함.
  // 보통 브라우저에서 axios로 넣어주는것처럼 여기도 따로 해줘야한다.
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  // 로그인 풀렸다가 useEffect 같은걸로 로그인정보를 가져오는 형태가 아닌 서버사이드에서 바로.
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  // 게시글 불러옴
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
  });
  // request -> success 까지 완료된 후 리턴하도록 하는부분
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  // request -> success 까지 완료된 후 리턴하도록 하는부분
});

export default Signup;

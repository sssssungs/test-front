import React from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import useSWR from 'swr';
import AppLayout from '../components/AppLayout';

import FollowList from '../components/FollowList';
import NickNameEditForm from '../components/NickNameEditForm';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import { LOAD_POST_REQUEST } from '../reducers/post';
import { backUrl } from '../config/config';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  // const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = React.useState(3);
  const [followingsLimit, setFollowingsLimit] = React.useState(3);
  // load / get 같은 애들을 실행하도록 해주는 Hook. fetcher로 axios를 실행되도록 받아간다.
  const { data: followersData, error: followerError } = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher);

  // React.useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  // }, []);

  React.useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = React.useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = React.useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return <div>정보 로딩중...</div>;
  }
  // 어떤경우에도 hooks의 실행횟수는 동일해야한다. 이게 useEffect보다 위에 있을경우
  // 여기에 걸리는 경우에 useEffect 실행안되는 경우가 발생 -> 각각 다른 hooks call 횟수 -> hooks자체가 에러라고 인식함.
  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉 팔로워 로딩중 에러가 발생합니다</div>;
  }

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <title>Profile | Twitter</title>
      </Head>
      <AppLayout>
        <NickNameEditForm />
        <FollowList header="Following" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
        <FollowList header="Follower" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
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

export default Profile;

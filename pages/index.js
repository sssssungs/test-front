import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POST_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostLoading, retweetError } = useSelector((state) => state.post);

  const dispatch = useDispatch();
  // React.useEffect(() => {
  //   // ㅅㅐ로고침 되었을때 쿠키 존재하는 경우 로그인 시켜준다.
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST,
  //   });
  //   // 게시글 불러옴
  //   dispatch({
  //     type: LOAD_POST_REQUEST,
  //   });
  // }, []);

  React.useEffect(() => {
    if (retweetError) alert(retweetError);
  }, [retweetError]);

  React.useEffect(() => {
    function onScroll() {
      // window.scrollY: 얼마나 내렸는지
      // document.documentElement.clientHeight : 현재 브라우저 y height
      // document.documentElement.scrollHeight : 전체 스크롤 생긴 y height
      // eslint-disable-next-line max-len
      if (Math.floor(window.scrollY) + document.documentElement.clientHeight
          > document.documentElement.scrollHeight - 300) {
        if (hasMorePost && !loadPostLoading) {
          // takelatest : request를 막을수는 없다.
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POST_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostLoading, mainPosts]);

  return (
    <AppLayout>
      { me && <PostForm /> }
      { mainPosts.map((post) => <PostCard key={post.id} post={post} />) }
    </AppLayout>
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

export default Home;

import * as React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import wrapper from '../../store/configureStore';
import { LOAD_POST_BY_ID_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
  const singlePost = useSelector((state) => state.post.singlePost);
  const router = useRouter();
  const { id } = router.query;
  // if (router.isFallback && !singlePost) {
  //   return <div>loading</div>;
  // }
  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        {/* 공유할때 미리보기나 썸네일로 뜰때 정보 */}
        <meta property="og:title" content={`${singlePost.User.nickname}님의 글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://randybird.com/favicon.ico'} />
        <meta property="og:url" content={`https://randybird.com/post/${id}`} />

      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// getStaticPaths: getStaticProps랑 무조건 같이 사용하고, dynamic routing 일때 주로 사용.
// 미리 빌드할것을 지정해줄수 있다.
// export async function getStaticPaths() {
//   // const result = await axios.get('post/id')
//   // 가져와서 전체를 밑에 만들어 주는 방식으로 사용.
//   // path의 개수가 어느정도 제한을 둘수 있는 상황에서 사용한다.
//   return {
//     // path 안에 있는 애들만 미리 빌드해서 html 만들어준다.
//     paths: [
//       { params: { id: '7' } },
//       { params: { id: '8' } },
//     ],
//     fallback: true,
// false로 하면 path에 없는 애들은 에러페이지를 띄운다. true로 하면 path를 찾고 없는애를 getStaticProps한다.
//   };
// }

// get static props : 미리 페이지를 빌드해서 html로 만든다.
// export const getStaticProps = wrapper.getStaticProps(async (context) => {
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  // 게시글 불러옴
  // useRouter에 query를 context.params 에서 가져올수 있음
  context.store.dispatch({
    type: LOAD_POST_BY_ID_REQUEST,
    data: context.params.id,
  });
  // request -> success 까지 완료된 후 리턴하도록 하는부분
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  // request -> success 까지 완료된 후 리턴하도록 하는부분
});

export default Post;

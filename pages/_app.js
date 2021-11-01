// 공통페이지 처리
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import wrapper from '../store/configureStore';

// provider 감싸주는거 없음. next js 에서 제공해줌
const Root = ({ Component }) => (
  <div>
    <Head>
      <meta charSet="utf-8" />
      <title>Twitter</title>
    </Head>
    <Component />
  </div>
);

Root.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(Root);

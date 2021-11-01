import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) =>
// [] 안에 있는것에 다 적용
// \s 스페이스.
// 정규식을 괄호로 감싸야지 split 에서 적용이된다
// eslint-disable-next-line implicit-arrow-linebreak
  (
    <div>
      {
                postData.split(/(#[^\s#]+)/g).map((v, i) => {
                  if (v.match(/(#[^\s#]+)/)) {
                    return (
                    // eslint-disable-next-line react/no-array-index-key
                      <Link key={i} href={`/hashtag/${v.slice(1)}`}>
                        <a>{v}</a>
                      </Link>
                    );
                  }
                  return v;
                })
      }
    </div>
  );

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;

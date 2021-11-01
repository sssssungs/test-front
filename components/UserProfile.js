import React, { useCallback } from 'react';
import { Avatar, Card, Button, Form } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_OUT_REQUEST, logoutRequestAction } from '../reducers/user';

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logoutLoading } = useSelector((state) => state.user);

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  return (
    <FormWrapper>
      <Card
        actions={[
          <div key="twit">
            짹짹
            <br />
            {me.Posts.length}
          </div>,
          <div key="followings">
            팔로잉
            <br />
            {me.Followings.length}
          </div>,
          <div key="followers">
            팔로워
            <br />
            {me.Followers.length}
          </div>,
        ]}
      >
        <Card.Meta
          title={me.nickname}
          avatar={(
            <Link href={`/user/${me.id}`}>
              <a>
                {' '}
                <Avatar style={{ backgroundColor: '#87d068' }}>{me.nickname[0].toUpperCase()}</Avatar>
              </a>
            </Link>
)}
        />
        <Button onClick={onLogout} loading={logoutLoading}>logout</Button>
      </Card>
    </FormWrapper>
  );
};

export default UserProfile;

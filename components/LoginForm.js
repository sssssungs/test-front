import React, { useCallback, useEffect } from 'react';
import { Form, Button, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { loginRequestAction } from '../reducers/user';

const ButtonWrapper = styled.div`
    margin-top: 10px;
`;

const LabelWrapper = styled.label`
  margin-left: 5px;
  font-weight: bold;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, onchangeEmail] = useInput('');
  const [pw, onchangePw] = useInput('');
  const { loginLoading, loginError } = useSelector((state) => state.user);

  useEffect(() => {
    if (loginError) {
      alert(loginError); //eslint-disable-line
    }
  }, [loginError]);

  const onSubmitForm = useCallback(() => {
    console.log(email, pw);
    dispatch(loginRequestAction({ email, pw }));
  }, [email, pw]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <LabelWrapper htmlFor="user-email">EMAIL</LabelWrapper>
        <br />
        <Input name="user-email" value={email} type="" onChange={onchangeEmail} required />
      </div>
      <div>
        <LabelWrapper htmlFor="user-password"> PW</LabelWrapper>
        <br />
        <Input type="password" name="user-password" value={pw} onChange={onchangePw} required />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={loginLoading}>login</Button>
        <Link href="/signup">
          <a><Button>sign up</Button></a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;

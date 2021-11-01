import React, { useRef, useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { UPLOAD_IMAGE_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';
import { backUrl } from '../config/config';

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput('');
  const imageInput = useRef();

  useEffect(() => {
    if (addPostDone) setText('');
  }, [addPostDone]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      alert('게시글 내용을 작성하세요.');
      return;
    }
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('images', p);
    });
    formData.append('content', text);
    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
    // setText('');
  }, [text, imagePaths]);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    // e.target.files가 유사배열이므로 foreach를 못씀.
    // 그래서 [].forEach.call 로 [] 배열의 foreach 함수를 빌려쓴다.
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('images', f); // name을 통해 backend multer로 전달가능
    });
    dispatch({
      type: UPLOAD_IMAGE_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  }, []);
  return (
    // name을 통해 backend multer로 전달가능
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="What happened ?" />
      <div>
        <input type="file" multiple hidden ref={imageInput} name="imagesUpload" onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>upload</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">Post</Button>
      </div>
      <div style={{ marginTop: '10px' }}>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v.replace(/\/thumb\//, '/original/')} style={{ width: '100px', height: '100px', marginRight: '5px' }} alt={v} />
            <div>
              {/* // map안에서 parameter 넣으려면 고차함수로 사용 */}
              <Button onClick={onRemoveImage(i)}>remove</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;

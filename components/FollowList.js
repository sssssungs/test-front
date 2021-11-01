import React, { useMemo, useCallback } from 'react';
import { List, Card, Button } from 'antd';
import PropTypes from 'prop-types';
import { StopTwoTone } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST } from '../reducers/user';

const FollowList = ({ header, data, onClickMore, loading }) => {
  const style = useMemo(() => ({ marginBottom: '20px' }), []);
  const loadStyle = useMemo(() => ({ textAlign: 'center', margin: '10px 0' }), []);
  const dispatch = useDispatch();
  const unfollow = useCallback((id) => () => {
    if (header === 'Following') {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    }
  }, []);
  return (
    <List
      style={style}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={(
        <div style={loadStyle}>
          <Button onClick={onClickMore} loading={loading}>more</Button>
        </div>
      )}
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: 20 }}>
          <Card actions={header === 'Following' ? [<StopTwoTone key="stop" onClick={unfollow(item.id)} />] : []}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;

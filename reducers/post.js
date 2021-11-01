import produce from '../util/produce';

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  singlePost: null,
  hasMorePost: true,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,

  loadPostByIdLoading: false,
  loadPostByIdDone: false,
  loadPostByIdError: null,

  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,

  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,

  uploadImageLoading: false,
  uploadImageDone: false,
  uploadImageError: null,

  retweetLoading: false,
  retweetDone: false,
  retweetError: null,

  // loadUserPostsLoading: false,
  // loadUserPostsDone: false,
  // loadUserPostsError: null,
  //
  // loadHashtagPostsLoading: false,
  // loadHashtagPostsDone: false,
  // loadHashtagPostsError: null,
};

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_POST_BY_ID_REQUEST = 'LOAD_POST_BY_ID_REQUEST';
export const LOAD_POST_BY_ID_SUCCESS = 'LOAD_POST_BY_ID_SUCCESS';
export const LOAD_POST_BY_ID_FAILURE = 'LOAD_POST_BY_ID_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const UPLOAD_IMAGE_REQUEST = 'UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_FAILURE = 'UPLOAD_IMAGE_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

// state 대신 draft사용해서 불변성 안지키도록 코딩한다.
const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case LOAD_POST_REQUEST:
    case LOAD_USER_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
      draft.loadPostLoading = true;
      draft.loadPostDone = false;
      draft.loadPostError = null;
      break;
    case LOAD_POST_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS: {
      draft.mainPosts = draft.mainPosts.concat(action.data);
      draft.loadPostLoading = false;
      draft.loadPostDone = true;
      draft.hasMorePost = draft.mainPosts.length === 10;
      break;
    }
    case LOAD_POST_FAILURE:
    case LOAD_USER_POSTS_FAILURE:
    case LOAD_HASHTAG_POSTS_FAILURE:
      draft.loadPostLoading = false;
      draft.loadPostError = action.error;
      break;

    case LOAD_POST_BY_ID_REQUEST:
      draft.loadPostByIdLoading = true;
      draft.loadPostByIdDone = false;
      draft.loadPostByIdError = null;
      break;
    case LOAD_POST_BY_ID_SUCCESS: {
      draft.loadPostByIdLoading = false;
      draft.loadPostByIdDone = true;
      draft.singlePost = action.data;
      break;
    }
    case LOAD_POST_BY_ID_FAILURE:
      draft.loadPostByIdLoading = false;
      draft.loadPostByIdError = action.error;
      break;
    case ADD_POST_REQUEST:
      draft.addPostLoading = true;
      draft.addPostDone = false;
      draft.addPostError = null;
      break;
    case ADD_POST_SUCCESS: {
      draft.mainPosts.unshift(action.data); // 가장 위에 신규글 (unshift)
      draft.imagePaths = [];
      draft.addPostLoading = false;
      draft.addPostDone = true;
      break;
    }
    case ADD_POST_FAILURE:
      draft.addPostLoading = false;
      draft.addPostError = action.error;
      break;
    case REMOVE_POST_REQUEST:
      draft.removePostLoading = true;
      draft.removePostDone = false;
      draft.removePostError = null;
      break;
    case REMOVE_POST_SUCCESS:
      draft.removePostLoading = false;
      draft.removePostDone = true;
      draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
      break;
    case REMOVE_POST_FAILURE:
      draft.removePostLoading = false;
      draft.removePostError = action.error;
      break;
    case ADD_COMMENT_REQUEST:
      draft.addCommentLoading = true;
      draft.addCommentDone = false;
      draft.addCommentError = null;
      break;
    case ADD_COMMENT_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Comments.unshift(action.data);
      draft.addCommentLoading = false;
      draft.addCommentDone = true;
      break;
      // const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
      // const post = { ...state.mainPosts[postIndex] };
      // post.Comments = [dummyComment(action.data.content), ...post.Comments];
      // const mainPosts = [...state.mainPosts];
      // mainPosts[postIndex] = post;
      // return {
      //   ...state,
      //   mainPosts,
      //   addCommentLoading: false,
      //   addCommentDone: true,
      // };
    }
    case ADD_COMMENT_FAILURE:
      draft.addCommentLoading = false;
      draft.addCommentError = action.error;
      break;
    case LIKE_POST_REQUEST:
      draft.likePostLoading = true;
      draft.likePostDone = false;
      draft.likePostError = null;
      break;
    case LIKE_POST_SUCCESS: {
      console.log(action.data);
      draft.likePostLoading = false;
      draft.likePostDone = true;
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Likers.push({ id: action.data.UserId });
      break;
    }
    case LIKE_POST_FAILURE:
      draft.likePostLoading = false;
      draft.likePostError = action.error;
      break;
    case UNLIKE_POST_REQUEST:
      draft.unlikePostLoading = true;
      draft.unlikePostDone = false;
      draft.unlikePostError = null;
      break;
    case UNLIKE_POST_SUCCESS: {
      draft.unlikePostLoading = false;
      draft.unlikePostDone = true;
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
      break;
    }
    case UNLIKE_POST_FAILURE:
      draft.unlikePostLoading = false;
      draft.unlikePostError = action.error;
      break;
    case UPLOAD_IMAGE_REQUEST:
      draft.uploadImageLoading = true;
      draft.uploadImageDone = false;
      draft.uploadImageError = null;
      break;
    case UPLOAD_IMAGE_SUCCESS:
      draft.uploadImageLoading = false;
      draft.uploadImageDone = true;
      draft.imagePaths = draft.imagePaths.concat(action.data);
      break;
    case UPLOAD_IMAGE_FAILURE:
      draft.uploadImageLoading = false;
      draft.uploadImageError = action.error;
      break;
    case REMOVE_IMAGE:
      draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
      break;
    case RETWEET_REQUEST:
      draft.retweetLoading = true;
      draft.retweetDone = false;
      draft.retweetError = null;
      break;
    case RETWEET_SUCCESS:
      draft.retweetLoading = false;
      draft.retweetDone = true;
      draft.mainPosts.unshift(action.data);
      break;
    case RETWEET_FAILURE:
      draft.retweetLoading = false;
      draft.retweetError = action.error;
      break;

    // case LOAD_USER_POSTS_REQUEST:
    //   draft.loadUserPostsLoading = true;
    //   draft.loadUserPostsDone = false;
    //   draft.loadUserPostsError = null;
    //   break;
    // case LOAD_USER_POSTS_SUCCESS: {
    //   draft.mainPosts = draft.mainPosts.concat(action.data);
    //   draft.loadUserPostsLoading = false;
    //   draft.loadUserPostsDone = true;
    //   draft.hasMorePost = draft.mainPosts.length === 10;
    //   break;
    // }
    // case LOAD_USER_POSTS_FAILURE:
    //   draft.loadUserPostsLoading = false;
    //   draft.loadUserPostsError = action.error;
    //   break;
    //
    // case LOAD_HASHTAG_POSTS_REQUEST:
    //   draft.loadHashtagPostsLoading = true;
    //   draft.loadHashtagPostsDone = false;
    //   draft.loadHashtagPostsError = null;
    //   break;
    // case LOAD_HASHTAG_POSTS_SUCCESS: {
    //   draft.mainPosts = draft.mainPosts.concat(action.data);
    //   draft.loadHashtagPostsLoading = false;
    //   draft.loadHashtagPostsDone = true;
    //   draft.hasMorePost = draft.mainPosts.length === 10;
    //   break;
    // }
    // case LOAD_HASHTAG_POSTS_FAILURE:
    //   draft.loadHashtagPostsLoading = false;
    //   draft.loadHashtagPostsError = action.error;
    //   break;
    default:
      return state;
  }
});

export default reducer;

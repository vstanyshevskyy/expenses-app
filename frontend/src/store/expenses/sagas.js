import { call, put, takeLatest, throttle } from "redux-saga/effects";
import {
  FETCH_EXPENSES,
  EXPENSES_FETCHED,
  EXPENSES_FETCHING,
  POST_COMMENT,
  COMMENT_POSTING,
  COMMENT_POSTED,
  UPLOAD_FILE,
  FILE_UPLOADING,
  FILE_UPLOADED
} from './actions';
import { SHOW_NOTIFICATION } from '../global/actions';
import { fetchExpenses, postExpenseComment, uploadFile } from '../../api';
import { NotificationTypes } from '../../components/notification';

function* loadExpensesSaga({ payload: { offset = 0 } }) {
  yield put({ type: EXPENSES_FETCHING, payload: true });
  try {
    const data = yield call(fetchExpenses, offset);
    yield put({ type: EXPENSES_FETCHED, payload: data });
  } catch (e) {
    yield put({ type: EXPENSES_FETCHING, payload: false });
    yield put({ type: SHOW_NOTIFICATION, payload: {
      message: 'Failed to fetch expenses...',
      type: NotificationTypes.ERROR
    } });
  }
}

function* postCommentSaga({ payload: { id, comment } }) {
  yield put({ type: COMMENT_POSTING, payload: true });
  try {
    const data = yield call(postExpenseComment, { id, comment });
    yield put({ type: COMMENT_POSTED, payload: data });
  } catch (e) {
    yield put({ type: COMMENT_POSTING, payload: false });
    yield put({ type: SHOW_NOTIFICATION, payload: {
      message: 'Failed to post comment...',
      type: NotificationTypes.ERROR
    } });
  }
}

function* uploadFileSaga({ payload: { expenseId, file } }) {
  yield put({ type: FILE_UPLOADING, payload: true });
  try {
    const data = yield call(uploadFile, { expenseId, file });
    yield put({ type: FILE_UPLOADED, payload: data });
  } catch (e) {
    yield put({ type: FILE_UPLOADING, payload: false });
    yield put({ type: SHOW_NOTIFICATION, payload: {
      message: 'Failed to upload file...',
      type: NotificationTypes.ERROR
    } });
  }
}

export default function* expensesSaga() {
  yield takeLatest(FETCH_EXPENSES, loadExpensesSaga);
  yield throttle(1000, POST_COMMENT, postCommentSaga);
  yield takeLatest(UPLOAD_FILE, uploadFileSaga);
}
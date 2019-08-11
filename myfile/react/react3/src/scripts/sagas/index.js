import {fork} from 'redux-saga/effects'
import watchAjax from './watchAjax'
export default function* watchAsync() {
    yield [
        fork(watchAjax)
    ]
}
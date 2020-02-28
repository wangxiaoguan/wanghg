import { combineReducers } from 'redux'
import { IP, TOKEN, ORDER, ACTIVITY, USER, DETAIL } from './type.js'
const ip = (state = {}, action = {}) => {
  switch (action.type) {
    case IP:
      return action.payload
    default:
      return state
  }
}
const token = (state = {}, action = {}) => {
  switch (action.type) {
    case TOKEN:
      return action.payload
    default:
      return state
  }
}

const order = (state = {}, action = {}) => {
  switch (action.type) {
    case ORDER:
      return action.payload
    default:
      return state
  }
}
const activity = (state = {}, action = {}) => {
  switch (action.type) {
    case ACTIVITY:
      return action.payload
    default:
      return state
  }
}
const user = (state = {}, action = {}) => {
  switch (action.type) {
    case USER:
      return action.payload
    default:
      return state
  }
}
const detail = (state = {}, action = {}) => {
  switch (action.type) {
    case DETAIL:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  ip,
  token,
  order,
  activity,
  user,
  detail
})

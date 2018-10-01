import { AsyncStorage } from 'react-native'
import firebase from '../../firebase'

import * as types from '../types'

export function loggedOut() {
  return {
    type: types.LOGGED_OUT
  }
}

export function addMessages(messages) {
  return {
    type: types.SET_MESSAGES,
    messages
  }
}

export function addMessage(user, messageText) {
  return dispatch => {
    const userId = user.id
    const createdAt = Date.now()
    const message = {
      userId: userId,
      userName: user.name || 'User',
      message: messageText
    }
    firebase
      .database()
      .ref(`messages/${createdAt}`)
      .set(message)
      .then(() => {
        dispatch({
          type: types.ADD_MESSAGE,
          message
        })
      })
  }
}

export function removeMessage(id) {
  return dispatch => {
    firebase
      .database()
      .ref(`messages/${id}`)
      .remove()
      .then(() =>
        dispatch({
          type: types.REMOVE_MESSAGE,
          id
        })
      )
  }
}

export function removeUser(id) {
  return dispatch => {
    dispatch({ type: 'removing_user' })
    AsyncStorage.removeItem(id).then(() =>
      dispatch({
        type: types.REMOVE_USER,
        id
      })
    )
  }
}

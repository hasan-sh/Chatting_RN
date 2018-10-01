import React from 'react'
import { AsyncStorage } from 'react-native'

import firebase from '../../firebase'
import * as types from '../types'

export function signIn({ name, email, password }) {
  return dispatch => {
    dispatch({ type: types.SIGNING_IN })
    if (!email && !password) return dispatch({ type: FAILURE })
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user: { uid: id } }) =>
        loggedInDone(dispatch, { id, name, email })
      )
      .catch(() => signUp(dispatch, { name, email, password }))
  }
}

export function loggedInDone(dispatch, user) {
  AsyncStorage.setItem('user', JSON.stringify(user)).then(() =>
    dispatch(loggedIn(user))
  )
}

export function loggedIn(user) {
  return {
    type: types.LOGGED_IN,
    user
  }
}

export function signUp(dispatch, { name, email, password }) {
  dispatch({ type: types.SIGNING_UP })
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({ user: { uid, email } }) =>
      loggedInDone(dispatch, { id: uid, name, email })
    )
    .catch(error => dispatch({ type: types.FAILURE, error: error }))
}

export function signOut() {
  return dispatch =>
    firebase
      .auth()
      .signOut()
      .then(() => AsyncStorage.removeItem('user'))
      .then(() => dispatch({ type: types.SIGN_OUT }))
      .catch(error => dispatch({ type: types.FAILURE, error }))
}

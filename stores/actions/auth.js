import React from 'react'
import { AsyncStorage } from 'react-native'

import firebase from '../../firebase'
import * as types from '../types'

export function signIn({ name, email, password }) {
  return dispatch => {
    dispatch({ type: types.SIGNING_IN })
    if (!email && !password)
      return dispatch({
        type: FAILURE,
        error: { message: 'Missing Email Address or Password' }
      })
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user: { uid: id } }) => {
        const userName = firebase.auth().currentUser.displayName || name
        loggedInDone(dispatch, { id, name: userName, email })
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          dispatch({ type: types.FAILURE, error })
        } else {
          signUp(dispatch, { name, email, password })
        }
      })
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
    .then(({ user: { uid, email } }) => {
      if (name) {
        // This cannot fail..
        firebase
          .auth()
          .currentUser.updateProfile({ displayName: name })
          .then(() => console.log('user updated', name))
      }
      loggedInDone(dispatch, { id: uid, name, email })
    })
    .catch(error => dispatch({ type: types.FAILURE, error }))
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

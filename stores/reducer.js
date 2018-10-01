import {
  USER_EXISTS,
  ADD_USER,
  SIGN_OUT,
  ADD_MESSAGE,
  ADD_MESSAGES,
  REMOVE_MESSAGE,
  SIGNING_IN,
  LOGGED_IN,
  FAILURE,
  SIGNING_UP,
  SET_MESSAGES
} from './types'

const initialState = {
  messages: null,
  currentUser: null,
  loading: false,
  error: null
}

// user = { id: {name, email, ...}}

function reducer(state = initialState, action$) {
  switch (action$.type) {
    case SIGNING_IN: {
      return {
        ...state,
        loading: true
      }
    }
    case LOGGED_IN: {
      const { user } = action$
      if (!user.email) return state
      return {
        ...state,
        currentUser: user,
        loading: false
      }
    }
    case SIGNING_UP:
      return { ...state, loading: true }

    case ADD_MESSAGE: {
      // const { message } = action$
      // const { messages } = state
      // messages[Date.now()] = message
      return {
        ...state
        // messages
      }
    }

    case SET_MESSAGES: {
      const { messages } = action$

      return {
        ...state,
        messages
      }
    }

    case SIGN_OUT: {
      return { ...state, currentUser: null, messages: [] }
    }

    case REMOVE_MESSAGE: {
      return {
        ...state
      }
    }

    case FAILURE: {
      return { ...state, error: action$.error, loading: false }
    }
    default:
      return state
  }
}

export default reducer

import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducer'

// import { addMessage, addUser, removeMessage, removeUser } from './actions'

// const appReducer = combineReducers(reducer)

const store = createStore(reducer, applyMiddleware(thunk, logger))

// console.log(store.getState())

export default store
// store.dispatch(
//   addMessage({ user: { id: 1, name: 'hasan' }, text: 'hello world!!!' })
// )

// store.dispatch(
//   addUser({
//     id: 14,
//     name: 'hasan',
//     messages: [{ id: 324234234234, text: 'some message' }]
//   })
// )

// store.dispatch(removeUser(14))

// store.dispatch(
//   addMessage({ user: { id: 14, name: 'hasan' }, text: 'hello world!!!' })
// )

// store.dispatch(removeMessage(14))

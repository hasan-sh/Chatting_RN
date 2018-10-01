import React from 'react'
import RootStack from './Navigation'
import { Provider } from 'react-redux'

import store from './stores'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    )
  }
}

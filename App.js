import React from 'react'
import { StyleSheet } from 'react-native'
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

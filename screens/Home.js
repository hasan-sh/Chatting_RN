import React, { Component } from 'react'
import { StyleSheet, View, AsyncStorage, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import { loggedIn } from '../stores/actions/auth'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillMount = () => {
    console.ignoredYellowBox = ['Setting a timer']
    AsyncStorage.getItem('user')
      .then(user => {
        if (user) {
          const currUser = JSON.parse(user)
          this.props.loggedIn(currUser)
        } else {
          this.props.navigation.replace('Login')
        }
      })
      .catch(e => console.log(e))
  }

  componentWillReceiveProps = newProps => {
    if (newProps.currentUser) {
      this.props.navigation.replace('Chat')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
      </View>
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

export default connect(
  state => state,
  { loggedIn }
)(Home)

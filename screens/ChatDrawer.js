import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'

import { signOut } from '../stores/actions/auth'
import { DrawerItems, DrawerNavigationState } from 'react-navigation'

class ChatDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = { messages: null }
  }

  componentDidMount() {
    DrawerNavigationState
  }
  componentWillReceiveProps = newProps => {
    this.setState({ messages: newProps.messages })
  }

  render() {
    const { currentUser } = this.props
    const { messages } = this.state
    // console.log('drawers props', messages)
    const name = currentUser
      ? currentUser.name
        ? currentUser.name
        : currentUser.email
      : null

    const currentUsersMessages = messages
      ? Object.keys(messages)
          .filter(key => messages[key].userId === currentUser.id)
          .map(key => (
            <Text
              style={{
                color: 'white',
                backgroundColor: '#5a7ffc',
                padding: 10,
                marginLeft: 10,
                marginBottom: 2,
                marginTop: 2,
                borderRadius: 5
              }}
              key={key}
            >
              {messages[key].message}
            </Text>
          ))
      : null

    return (
      <View style={{ marginTop: 20, flex: 1, justifyContent: 'space-between' }}>
        <DrawerItems
          {...this.props}
          getLabel={() => {
            return (
              <Text
                style={{
                  color: 'white',
                  padding: 20,
                  fontSize: 18
                }}
              >
                Hallo {name} :)
              </Text>
            )
          }}
        />

        <View
          style={{
            flex: 1,
            // Check the width.
            // justifyContent: 'stretch',
            alignSelf: 'flex-start',
            marginTop: 10
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              backgroundColor: '#24e92e',
              padding: 10,
              borderRadius: 20
            }}
          >
            Your messages:
          </Text>
          <ScrollView
            contentContainerStyle={{ paddingVertical: 20, width: '100%' }}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'on-drag'}
          >
            {currentUsersMessages}
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.closeDrawer()
            this.props.signOut()
          }}
          style={{ backgroundColor: '#24296e' }}
        >
          <Text style={{ color: 'white', padding: 20, fontSize: 18 }}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default connect(
  state => state,
  { signOut }
)(ChatDrawer)

import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Keyboard
} from 'react-native'
import { Permissions, Notifications } from 'expo'

import { connect } from 'react-redux'
import firebase from '../firebase'

import { addMessage, addMessages, removeMessage } from '../stores/actions'

class Chat extends Component {
  static navigationOptions = {
    drawerLabel: 'Your Chat'
  }

  constructor(props) {
    super(props)
    this.state = { message: '' }
  }

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    )
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      return
    }
    const token = await Notifications.getExpoPushTokenAsync()
    if (!firebase.auth().currentUser) return
    const uid = firebase.auth().currentUser.uid
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('chat-messages', {
        name: 'Chat messages',
        sound: true
      })
    }

    firebase
      .database()
      .ref('users')
      .child(uid)
      .update({ expoToken: token })
  }

  scrollToEnd = () => {
    setTimeout(() => {
      this.refs.scrollView.scrollToEnd({ animated: true })
    }, 10)
  }

  componentWillMount() {
    this.registerForPushNotificationsAsync()
    firebase
      .database()
      .ref('messages')
      .on('value', snap => {
        const messages = snap.val()
        if (messages != null) {
          this.props.addMessages(messages)
        }
      })
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.scrollToEnd
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
  }

  componentWillReceiveProps = newProps => {
    if (newProps.currentUser == null) {
      this.props.navigation.replace('Login')
    }
  }

  submit = () => {
    const { message } = this.state
    if (message) {
      const { addMessage, currentUser } = this.props
      addMessage(currentUser, message)

      firebase
        .database()
        .ref('messages')
        .on('child_added', snap => {
          if (
            snap.val() != null &&
            snap.val().message === message &&
            snap.val().userId !== currentUser.id
          ) {
            Notifications.presentLocalNotificationAsync({
              title: `${snap.val().userName}'s sent a message.`,
              body: message,
              android: {
                channelId: 'chat-messages',
                vibrate: [0, 25, 25, 250]
              }
            })
          }
        })
      this.setState({ message: '' })
    }
  }

  getListOfMessages = () => {
    const { messages } = this.props
    const keys = Object.keys(messages)
    return keys.length > 0
      ? keys.map(key => this.messageItem(key, messages[key]))
      : null
  }

  messageItem = (id, message) => {
    const userName = message.userName || 'User'
    return (
      <View
        key={id}
        style={{
          padding: 5,
          justifyContent: 'space-around',
          flexDirection: `${
            message.userId !== this.props.currentUser.id ? 'row' : 'row-reverse'
          }`
        }}
      >
        <Text
          style={{
            color: 'white',
            backgroundColor: '#24292e',
            padding: 10,
            borderRadius: 15
          }}
        >
          {userName}
        </Text>

        <TouchableWithoutFeedback
          onLongPress={() => {
            if (message.userId === this.props.currentUser.id) {
              Alert.alert(
                `Remove Message`,
                `Do you want to remove '${message.message}'?`,
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Remove',
                    onPress: () => this.props.removeMessage(id)
                  }
                ]
              )
            }
          }}
          delayLongPress={300}
        >
          <View
            style={{
              marginRight: 3,
              marginLeft: 3,
              flex: 1
            }}
          >
            <Text
              style={{
                color: 'white',
                backgroundColor:
                  message.userId === this.props.currentUser.id
                    ? '#5a7ffc'
                    : '#009688',
                padding: 10
              }}
            >
              {message.message}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    const messages = this.props.messages ? (
      this.getListOfMessages()
    ) : (
      <Text>Loading messages...</Text>
    )

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, alignContent: 'flex-end' }}
        behavior="padding"
        enabled
      >
        <View style={styles.chatBody}>
          <ScrollView
            ref="scrollView"
            onContentSizeChange={this.scrollToEnd}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {messages}
          </ScrollView>
        </View>
        <View style={styles.inputsContainer}>
          <TextInput
            placeholder="Add Message.."
            style={styles.input}
            underlineColorAndroid="rgba(0,0,0,0)"
            value={this.state.message}
            onChangeText={message => this.setState({ message })}
          />
          <Button title="Submit" type="submit" onPress={this.submit} />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  chatBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 5,
    paddingVertical: 23
  },
  inputsContainer: {
    backgroundColor: '#24292e',
    padding: 10,
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    color: 'white'
  }
})

export default connect(
  state => state,
  { addMessage, addMessages, removeMessage }
)(Chat)

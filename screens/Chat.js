import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  Keyboard
} from 'react-native'

import { connect } from 'react-redux'
import firebase from '../firebase'

import { addMessage, addMessages, removeMessage } from '../stores/actions'

class Chat extends Component {
  static navigationOptions = {
    drawerLabel: 'Your Chat'
  }

  constructor(props) {
    super(props)
    this.state = { message: '', messages: null }
  }

  event = () => {
    setTimeout(() => {
      this.refs.scrollView.scrollToEnd({ animated: true })
    }, 10)
  }
  componentWillMount() {
    // ScrollView.scrollToEnd({ animated: true })
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
      this.event
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
  }

  componentWillReceiveProps = newProps => {
    if (newProps.currentUser == null) {
      this.props.navigation.navigate('Login')
    }
  }

  submit = () => {
    const { message } = this.state
    if (message) {
      const { addMessage, currentUser } = this.props
      addMessage(currentUser, message)
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
          {message.name || 'User'}
        </Text>
        {/* 
          <InputText 
          style={...} 
          onFocus={e=> firebase.database().ref(key).update(this.messageText)}
          value={this.state.messageText} 
          onTextChange={messageText=> this.setState({messageText})} 
          />
        */}

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
          delayLongPress={200}
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
      <ActivityIndicator size="large" color="black" />
    )

    return (
      // Check he scrolling behavior of the scrollView when the keyboard is opened.
      // If there's no built-in method that detects that, you can hack it by listening to the scrolling event on the scrollView and then change the height accordingly!
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: 25 }}
        behavior="padding"
        enabled
      >
        <ScrollView
          ref="scrollView"
          onContentSizeChange={this.event}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          {messages}
        </ScrollView>
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
    backgroundColor: '#ffc0cbdb',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 5,
    paddingVertical: 20
  },
  inputsContainer: {
    // flex: 1,
    backgroundColor: '#24292e',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end'
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

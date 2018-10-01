import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native'

import { connect } from 'react-redux'
import { signIn } from '../stores/actions/auth'

class Login extends Component {
  static navigationOptions = {
    title: 'Login'
  }

  constructor(props) {
    super(props)
    this.state = {
      email: 'hasan@gmail.com',
      name: '',
      password: 'Soso123'
    }
  }

  signIn = () => {
    const { ...user } = this.state
    if (!user.email && !user.password)
      return alert('Please provide valid email and password')
    this.props.signIn(user)
  }

  render() {
    const { loading } = this.props
    const button = loading ? (
      <ActivityIndicator size="small" color="blue" />
    ) : (
      <Button title={'Log in'} onPress={this.signIn} />
    )
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TextInput
          placeholder="Your Name.."
          textContentType="name"
          style={styles.input}
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        <TextInput
          placeholder="Your Email Address.."
          textContentType="emailAddress"
          style={styles.input}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          placeholder="Your password Address.."
          textContentType="password"
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <View style={styles.buttons}>{button}</View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '80%',
    margin: 10
  },
  buttons: {
    width: '80%'
  }
})

export default connect(
  state => ({ loading: state.loading }),
  { signIn }
)(Login)

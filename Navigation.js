import React from 'react'
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerItems
} from 'react-navigation'

import Home from './screens/Home'
import Chat from './screens/Chat'
import ChatDrawer from './screens/ChatDrawer'

import Login from './screens/Login'

const ChatDrawerStack = createDrawerNavigator(
  {
    Chat
  },
  {
    drawerBackgroundColor: '#24292e',
    contentComponent: ChatDrawer
  }
)

const AppStack = createStackNavigator(
  {
    Home: { screen: Home },
    Login: { screen: Login },
    Chat: {
      screen: ChatDrawerStack,
      navigationOptions: { title: 'Chat', headerMode: 'none' }
    }
  },
  { headerLayoutPreset: 'center', headerMode: 'none' }
)

export default AppStack

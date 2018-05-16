import { createStackNavigator } from 'react-navigation';

import AuthHomeScreen from './AuthHomeScreen';

const AuthStack = createStackNavigator({
  AuthHome: {
    screen: AuthHomeScreen,
  },
});

export default AuthStack;

import { createStackNavigator } from 'react-navigation';

import AuthHomeScreen from './AuthHomeScreen';

const AuthStack = createStackNavigator({
  AuthHome: AuthHomeScreen,
});

export default AuthStack;

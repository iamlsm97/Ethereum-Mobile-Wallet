import { createSwitchNavigator } from 'react-navigation';

import AppStack from './AppStack';
import AuthStack from './auth/AuthStack';
import AuthLoadingScreen from './auth/AuthLoadingScreen';

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default RootNavigator;

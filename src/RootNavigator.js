import { createSwitchNavigator } from 'react-navigation';

import AppTab from './AppTab';
import AuthStack from './auth/AuthStack';
import AuthLoadingScreen from './auth/AuthLoadingScreen';

const RootNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppTab,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default RootNavigator;

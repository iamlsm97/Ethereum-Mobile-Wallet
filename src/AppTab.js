import { createBottomTabNavigator } from 'react-navigation';

import AccountScreen from './screens/AccountScreen';
import TxScreen from './screens/TxScreen';
import SettingScreen from './screens/SettingScreen';

const AppTab = createBottomTabNavigator({
  Account: AccountScreen,
  Tx: TxScreen,
  Setting: SettingScreen,
});

export default AppTab;

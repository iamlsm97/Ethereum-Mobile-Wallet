import { createBottomTabNavigator } from 'react-navigation';

import AccountScreen from './screens/AccountScreen';
import TxScreen from './screens/TxScreen';
import SettingScreen from './screens/SettingScreen';
import TempBrowserScreen from './screens/TempBrowserScreen'

const AppTab = createBottomTabNavigator({
  Account: AccountScreen,
  Tx: TxScreen,
  Setting: SettingScreen,
  TempBrowser: TempBrowserScreen,
});

export default AppTab;

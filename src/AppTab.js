import { createBottomTabNavigator } from 'react-navigation';

import AccountScreen from './screens/AccountScreen';
import TxScreen from './screens/TxScreen';
import BrowserScreen from './screens/BrowserScreen';
import SettingScreen from './screens/SettingScreen';

const AppTab = createBottomTabNavigator({
  Account: AccountScreen,
  Tx: TxScreen,
  Browser: BrowserScreen,
  Setting: SettingScreen,
});

export default AppTab;

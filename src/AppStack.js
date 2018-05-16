import { createStackNavigator } from 'react-navigation';

import HomeScreen from './screens/HomeScreen';

const AppStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
});

export default AppStack;

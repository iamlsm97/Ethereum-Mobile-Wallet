/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  YellowBox,
} from 'react-native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/configureStore';
import WelcomeLoading from './src/components/WelcomeLoading';
import RootNavigator from './src/RootNavigator';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Class RCTCxxModule',
  'Module RNRandomBytes',
  'Module RCTWebViewBridgeManager',
]);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <PersistGate loading={<WelcomeLoading />} persistor={persistor}>
            <RootNavigator />
          </PersistGate>
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

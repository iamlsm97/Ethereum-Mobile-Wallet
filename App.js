/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { YellowBox } from 'react-native';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/configureStore';
import WelcomeLoading from './src/components/WelcomeLoading';
import RootNavigator from './src/RootNavigator';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<WelcomeLoading />} persistor={persistor}>
          <RootNavigator />
        </PersistGate>
      </Provider>
    );
  }
}

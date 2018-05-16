/* @flow */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';

import bip39 from 'react-native-bip39';

import * as Actions from '../actions';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.bootstrapWallet();
  }

  bootstrapWallet = () => {
    const { mnemonic } = this.props;

    if (!mnemonic || mnemonic === '') {
      this.props.navigation.navigate('Auth');
      return;
    }

    if (!bip39.validateMnemonic(mnemonic)) {
      this.props.clearAuth();
      this.props.navigation.navigate('Auth');
      return;
    }

    this.props.deriveWalletFromMnemonic(mnemonic)
      .then(() => this.props.navigation.navigate('App'))
      .catch((error) => {
        console.warn(error);
        this.props.navigation.navigate('Auth');
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Bootstrapping Wallet</Text>
        <ActivityIndicator size="large" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  mnemonic: state.auth.mnemonic,
});

const mapDispatchToProps = dispatch => ({
  deriveWalletFromMnemonic: mnemonic => dispatch(Actions.deriveWalletFromMnemonic(mnemonic)),
  clearAuth: () => {
    dispatch(Actions.clearAuth());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

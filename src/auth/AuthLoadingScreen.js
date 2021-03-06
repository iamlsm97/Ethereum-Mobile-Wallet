/* @flow */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';

import bip39 from 'react-native-bip39';

import Actions from '../actions/index';

class AuthLoadingScreen extends Component {
  componentDidMount() {
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

    requestAnimationFrame(() => {
      this.props.deriveWalletFromMnemonic(mnemonic)
        .then(() => this.props.navigation.navigate('App'))
        .catch((error) => {
          Toast.show(error.toString().split('\n', 1)[0], Toast.LONG);
          console.warn(error.toString());
          this.props.navigation.navigate('Auth');
        });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>Bootstrapping your Wallet</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  mnemonic: state.auth.mnemonic,
});

const mapDispatchToProps = dispatch => ({
  deriveWalletFromMnemonic: mnemonic => dispatch(Actions.auth.deriveWalletFromMnemonic(mnemonic)),
  clearAuth: () => {
    dispatch(Actions.auth.clearAuth());
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

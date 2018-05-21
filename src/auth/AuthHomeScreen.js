/* @flow */

import React, { Component } from 'react';
import {
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import Hr from 'react-native-hr-plus';
import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux';

import bip39 from 'react-native-bip39';

import * as Actions from '../actions';

class AuthHomeScreen extends Component {
  static navigationOptions = {
    title: 'Crypto Wallet React Native',
  };

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      isLoading: false,
    };
  }

  createNewWallet = () => {
    this.setState({ isLoading: true }, async () => {
      const mnemonic = await bip39.generateMnemonic(128);
      this.props.setMnemonic(mnemonic);
      this.props.deriveWalletFromMnemonic(mnemonic)
        .then(() => this.props.navigation.navigate('App'))
        .catch((error) => {
          this.setState({ isLoading: false });
          console.warn(error);
        });
    });
  };

  restoreWallet = () => {
    const mnemonic = this.state.input;
    if (!bip39.validateMnemonic(mnemonic)) {
      alert('Invalid Mnemonic');
      return;
    }

    this.setState({ isLoading: true }, () => {
      this.props.setMnemonic(mnemonic);
      this.props.deriveWalletFromMnemonic(mnemonic)
        .then(() => this.props.navigation.navigate('App'))
        .catch((error) => {
          this.setState({ isLoading: false });
          console.warn(error);
        });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.isLoading}
          textContent="Making your Wallet"
          textStyle={{ color: '#ffffff' }}
        />

        <View>
          <TextInput
            placeholder="Enter your 12-word Mnemonic"
            onChangeText={input => this.setState({ input })}
          />
          <Button
            title="Restore your Wallet"
            onPress={this.restoreWallet}
          />
        </View>

        <Hr color="black" width={1}>
          <Text>or</Text>
        </Hr>

        <Button
          title="Create New Wallet"
          onPress={this.createNewWallet}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setMnemonic: (mnemonic) => {
    dispatch(Actions.setMnemonic(mnemonic));
  },
  deriveWalletFromMnemonic: mnemonic => dispatch(Actions.deriveWalletFromMnemonic(mnemonic)),
});

export default connect(null, mapDispatchToProps)(AuthHomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

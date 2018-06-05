/* @flow */

import React, { Component } from 'react';
import {
  Button,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';

import axios from 'axios';

import CONSTS from '../consts';
import Actions from '../actions';

class SettingScreen extends Component {
  openEtherscan = () => {
    Linking.openURL(`${CONSTS.ROPSTEN_ETHERSCAN_URL}/address/${this.props.address}`);
  };

  getRopstenEther = () => {
    axios.get(`${CONSTS.ROPSTEN_FAUCET_URL}/donate/${this.props.address}`)
      .then(() => {
        Toast.show('Please wait a few seconds for confirmation.', Toast.LONG);
      })
      .catch((error) => {
        Toast.show('Failed to get Ropsten Ether');
        Toast.show(error.toString().split('\n', 1)[0], Toast.LONG);
        console.warn(error.toString());
      });
  };

  signOut = () => {
    this.props.clearAuth();
    this.props.clearEth();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show your Account in Etherscan" onPress={this.openEtherscan} />
        <Button title="Get 1 Ether (ROPSTEN ONLY)" onPress={this.getRopstenEther} />
        <Button title="Sign Out" onPress={this.signOut} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  address: state.auth.wallet.getChecksumAddressString(),
});

const mapDispatchToProps = dispatch => ({
  clearAuth: () => {
    dispatch(Actions.auth.clearAuth());
  },
  clearEth: () => {
    dispatch(Actions.eth.clearEth());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

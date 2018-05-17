/* @flow */

import React, { Component } from 'react';
import {
  Button,
  Clipboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import * as Actions from '../actions';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Cryto Wallet Home',
  };

  copyToClipboard = async (text) => {
    await Clipboard.setString(text);
    alert('Copied to Clipboard');
  }

  signOut = () => {
    this.props.clearAuth();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.info} onPress={() => this.copyToClipboard(this.props.mnemonic)}>
          Your Mnemonic is{'\n'}{this.props.mnemonic}
        </Text>
        <Text style={styles.info} onPress={() => this.copyToClipboard(this.props.address)}>
          Your Adress is{'\n'}{this.props.address}
        </Text>
        <Text style={styles.info} onPress={() => this.copyToClipboard(this.props.privateKey)}>
          Your Private Key is{'\n'}{this.props.privateKey}
        </Text>
        <Text>Click each for Copying to Clipboard</Text>

        <Text style={styles.info}>Your ETH balance is {this.props.eth}</Text>
        <View style={styles.btnContainer}>
          <View style={styles.btn}>
            <Button
              title="set to 3"
              onPress={() => this.props.setEth(3)}
            />
          </View>
          <View style={styles.btn}>
            <Button
              title="set to 100"
              onPress={() => this.props.setEth(100)}
            />
          </View>
        </View>
        <Button title="Sign Out" onPress={this.signOut} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  mnemonic: state.auth.mnemonic,
  address: state.auth.wallet.getChecksumAddressString(),
  privateKey: state.auth.wallet.getPrivateKeyString(),
  eth: state.eth,
});

const mapDispatchToProps = dispatch => ({
  clearAuth: () => {
    dispatch(Actions.clearAuth());
  },
  setEth: (amount) => {
    dispatch(Actions.setEth(amount));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  info: {
    fontSize: 18,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btn: {
    margin: 10,
  },
});

/* @flow */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';

import Web3 from 'web3';

import CONSTS from '../consts';
import Actions from '../actions/index';

class AccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const web3 = new Web3(CONSTS.ROPSTEN_RPC_URL);
    web3.eth.net.isListening()
      .then((isListening) => {
        if (isListening) {
          Toast.show('Connected to the Ethereum Network');
          this.props.setWeb3(web3);
          this.fetchBalance();
        } else {
          this.setState({ isLoading: false });
          Toast.show('Failed to Connect Ethereum Network', Toast.LONG);
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        Toast.show('Invalid JSON RPC response', Toast.LONG);
        console.warn(error);
      });
  }

  fetchBalance = () => {
    this.setState({ isLoading: true });
    this.props.web3.eth.getBalance(this.props.address)
      .then((balance) => {
        this.setState({ isLoading: false });
        this.props.setBalance(this.props.web3.utils.fromWei(balance, 'ether'));
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        Toast.show('Please Re-Fetch the Balance');
        console.warn(error);
      });
  }

  copyToClipboard = async (text) => {
    await Clipboard.setString(text);
    alert('Copied to Clipboard');
  }

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

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.info}>Your ETH balance is</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.info}>{this.props.balance} ether</Text>
            {this.state.isLoading && <ActivityIndicator />}
          </View>
        </View>
        <Button
          title="Fetch Balance"
          onPress={this.fetchBalance}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  mnemonic: state.auth.mnemonic,
  address: state.auth.wallet.getChecksumAddressString(),
  privateKey: state.auth.wallet.getPrivateKeyString(),
  web3: state.eth.web3,
  balance: state.eth.balance,
});

const mapDispatchToProps = dispatch => ({
  setWeb3: (web3) => {
    dispatch(Actions.eth.setWeb3(web3));
  },
  setBalance: (amount) => {
    dispatch(Actions.eth.setBalance(amount));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  info: {
    marginHorizontal: 10,
    fontSize: 18,
  },
});

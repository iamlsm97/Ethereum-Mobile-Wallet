/* @flow */

import React, { Component } from 'react';
import {
  Button,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';

import EthereumTx from 'ethereumjs-tx';

import CONSTS from '../consts';
import * as Actions from '../actions';

class TxScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: '',
      amount: '', // in ether
      gasPrice: 28, // in gwei
      gasLimit: 21000,
      txHash: '',
    };
  }

  send = async () => {
    const txParams = {
      nonce: this.props.web3.utils.toHex(await this.props.web3.eth.getTransactionCount(this.props.address)),
      to: this.state.to,
      value: this.props.web3.utils.toHex(this.props.web3.utils.toWei(this.state.amount.toString(), 'ether')),
      gasPrice: this.props.web3.utils.toHex(this.props.web3.utils.toWei(this.state.gasPrice.toString(), 'gwei')),
      gasLimit: this.props.web3.utils.toHex(this.state.gasLimit),
    };

    const tx = new EthereumTx(txParams);
    tx.sign(Buffer.from(this.props.privateKey.substring(2), 'hex'));
    const serializedTx = tx.serialize();

    this.props.web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
      .once('transactionHash', txHash => this.setState({ txHash }))
      .once('receipt', (receipt) => {
        Toast.show('Transaction is Confirmed!');
        console.log(receipt);
        this.props.web3.eth.getBalance(this.props.address)
          .then(balance => this.props.setBalance(this.props.web3.utils.fromWei(balance, 'ether')));
      })
      .on('confirmation', (confNumber, receipt) => console.log(confNumber, receipt))
      .on('error', error => console.warn(error));
  };

  openEtherscan = () => {
    Linking.openURL(`${CONSTS.ROPSTEN_ETHERSCAN_URL}/tx/${this.state.txHash}`);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>From</Text>
          <TextInput
            style={styles.formInput}
            editable={false}
            value={this.props.address}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>To</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Address to send"
            onChangeText={to => this.setState({ to })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Amount</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Amount in ether to send"
            onChangeText={amount => this.setState({ amount })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Gas Price</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Gas Price in gwei. Default is 28 gwei"
            onChangeText={gasPrice => this.setState({ gasPrice })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Gas Limit</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Gas Limit. Default is 21000"
            onChangeText={gasLimit => this.setState({ gasLimit })}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Button title="Send Ether" onPress={this.send} />
        </View>

        {this.state.txHash !== '' &&
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text>Tx Hash:</Text>
          <Text style={styles.textLink} onPress={this.openEtherscan}>{this.state.txHash}</Text>
        </View>}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  address: state.auth.wallet.getChecksumAddressString(),
  privateKey: state.auth.wallet.getPrivateKeyString(),
  web3: state.eth.web3,
});

const mapDispatchToProps = dispatch => ({
  setBalance: (amount) => {
    dispatch(Actions.setBalance(amount));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TxScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  formGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  formLabel: {
    flex: 1,
  },
  formInput: {
    flex: 4,
  },
  textLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

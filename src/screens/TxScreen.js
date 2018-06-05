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
import Actions from '../actions/index';

class TxScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txHash: '',
    };
  }

  estimateGas = async () => {
    const gasLimit = await this.props.web3.eth.estimateGas({
      from: this.props.address,
      to: this.props.to,
      data: this.props.data,
    });
    this.props.setGasLimit(gasLimit.toString());
  }

  handleReject = () => {
    if (this.props.callback) {
      this.props.callback.fail('User Rejected to sign Transaction');
      this.props.navigation.navigate('Browser');
    }
    this.props.clearTx();
    this.setState({ txHash: '' });
  }

  handleApprove = async () => {
    const web3Utils = this.props.web3.utils;
    const value = this.props.value === '' ? '0' : this.props.value;
    const gasPrice = this.props.gasPrice === '' ? CONSTS.DEFAULT_GAS_PRICE.toString() : this.props.gasPrice;
    const gasLimit = this.props.gasLimit === '' ? CONSTS.DEFAULT_GAS_LIMIT.toString() : this.props.gasLimit;

    const txParams = {
      nonce: web3Utils.toHex(await this.props.web3.eth.getTransactionCount(this.props.address)),
      to: this.props.to,
      value: web3Utils.toHex(web3Utils.toWei(value, 'ether')),
      gasPrice: web3Utils.toHex(web3Utils.toWei(gasPrice, 'gwei')),
      gasLimit: web3Utils.toHex(gasLimit),
      data: this.props.data,
    };

    const tx = new EthereumTx(txParams);
    tx.sign(Buffer.from(this.props.privateKey.substring(2), 'hex'));
    const serializedTx = tx.serialize();

    this.props.web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
      .once('transactionHash', (txHash) => {
        this.setState({ txHash });
        if (this.props.callback) {
          this.props.callback.respond(txHash);
          this.props.navigation.navigate('Browser');
          this.props.setCallback(null);
        }
      })
      .once('receipt', (receipt) => {
        Toast.show('Transaction is Confirmed!');
        console.log(receipt);
        this.props.web3.eth.getBalance(this.props.address)
          .then(balance => this.props.setBalance(web3Utils.fromWei(balance, 'ether')));
      })
      .on('confirmation', (confNumber, receipt) => console.log(`confNumber: ${confNumber}, gasUsed: ${receipt.gasUsed}`))
      .on('error', (error) => {
        Toast.show(error.toString().split('\n', 1)[0], Toast.LONG);
        console.warn(error.toString());
      });
  }

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
            onChangeText={to => this.props.setTo(to)}
            value={this.props.to}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Amount</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Amount in ether to send"
            onChangeText={value => this.props.setValue(value)}
            value={this.props.value}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Gas Price</Text>
          <TextInput
            style={styles.formInput}
            placeholder={`Enter Gas Price in gwei. Default is ${CONSTS.DEFAULT_GAS_PRICE} gwei`}
            onChangeText={gasPrice => this.props.setGasPrice(gasPrice)}
            value={this.props.gasPrice}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Gas Limit</Text>
          <View style={styles.formInput}>
            <TextInput
              style={{ flex: 1 }}
              placeholder={`Default is ${CONSTS.DEFAULT_GAS_LIMIT}`}
              onChangeText={gasLimit => this.props.setGasLimit(gasLimit)}
              value={this.props.gasLimit}
            />
            <Button title="Estimate" onPress={this.estimateGas} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Data</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Only for using Contracts"
            onChangeText={data => this.props.setData(data)}
            value={this.props.data}
          />
        </View>

        <View style={styles.btnGroup}>
          <View style={styles.btnContainer}>
            <Button title={this.props.callback ? 'Reject' : 'Clear'} onPress={this.handleReject} color="#ff0000" />
          </View>
          <View style={styles.btnContainer}>
            <Button title="Approve" onPress={this.handleApprove} />
          </View>
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

  to: state.tx.to,
  value: state.tx.value,
  gasPrice: state.tx.gasPrice,
  gasLimit: state.tx.gasLimit,
  data: state.tx.data,
  callback: state.tx.callback,
});

const mapDispatchToProps = dispatch => ({
  setBalance: (amount) => {
    dispatch(Actions.eth.setBalance(amount));
  },
  setTo: (to) => {
    dispatch(Actions.tx.setTo(to));
  },
  setValue: (value) => {
    dispatch(Actions.tx.setValue(value));
  },
  setGasPrice: (gasPrice) => {
    dispatch(Actions.tx.setGasPrice(gasPrice));
  },
  setGasLimit: (gasLimit) => {
    dispatch(Actions.tx.setGasLimit(gasLimit));
  },
  setData: (data) => {
    dispatch(Actions.tx.setData(data));
  },
  setCallback: (callback) => {
    dispatch(Actions.tx.setCallback(callback));
  },
  clearTx: () => {
    dispatch(Actions.tx.clearTx());
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    marginHorizontal: 30,
  },
  textLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

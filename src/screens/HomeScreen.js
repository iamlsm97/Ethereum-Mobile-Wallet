/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';

import * as Actions from '../actions';

class HomeScreen extends Component {
  signOutAsync = () => {
    this.props.clearAuth();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>I{'\''}m the HomeScreen component</Text>
        <Text style={styles.info}>Your Mnemonic is {this.props.mnemonic}</Text>
        <Text style={styles.info}>Your Adress is {this.props.address}</Text>
        <Text style={styles.info}>Your Private Key is {this.props.privateKey}</Text>
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
        <Button title="Sign Out" onPress={this.signOutAsync} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  mnemonic: state.auth.mnemonic,
  address: state.auth.address,
  privateKey: state.auth.privateKey,
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
    fontSize: 20,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btn: {
    margin: 10,
  },
});

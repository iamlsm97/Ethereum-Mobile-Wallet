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

import { setAccount } from '../actions';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  bootstrapAsync = () => {
    // get seed
    const { seed } = this.props;

    // if seed doesn't exist, navigate to Auth
    if (!seed || seed === '') {
      this.props.navigation.navigate('Auth');
      return;
    }

    // validate seed first
    // if error CLEAR_AUTH and navigate to Auth

    // if success calculate address and privateKey
    const address = seed.split('').reverse().join('');
    const privateKey = address.substring(0, 4);

    // save to redux store
    this.props.setAccount(address, privateKey);

    // then goto App
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>I{'\''}m the AuthLoadingScreen component</Text>
        <ActivityIndicator size="large" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  seed: state.auth.seed,
  address: state.auth.address,
  privateKey: state.auth.privateKey,
});

const mapDispatchToProps = dispatch => ({
  setAccount: (address, privateKey) => {
    dispatch(setAccount(address, privateKey));
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

/* @flow */

import React, { Component } from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';

import { setSeed, setAccount } from '../actions';

class AuthHomeScreen extends Component {
  signInAsync = () => {
    // input seed
    const seed = 'my name is Edwin';

    // if success calculate address and privateKey
    const address = seed.split('').reverse().join('');
    const privateKey = address.substring(0, 4);

    // save to redux store
    this.props.setSeed(seed);
    this.props.setAccount(address, privateKey);

    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>I{'\''}m the AuthHomeScreen component</Text>
        <Button title="Sign In" onPress={this.signInAsync} />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSeed: (seed) => {
    dispatch(setSeed(seed));
  },
  setAccount: (address, privateKey) => {
    dispatch(setAccount(address, privateKey));
  },
});

export default connect(null, mapDispatchToProps)(AuthHomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

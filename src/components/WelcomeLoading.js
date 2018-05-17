/* @flow */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class WelcomeLoading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30, textAlign: 'center' }}>Welcome to the BH Labs{'\'\n'}Crypto Wallet</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

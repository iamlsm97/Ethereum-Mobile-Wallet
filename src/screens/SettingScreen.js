/* @flow */

import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import * as Actions from '../actions';

class SettingScreen extends Component {
  signOut = () => {
    this.props.clearAuth();
    this.props.clearEth();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign Out" onPress={this.signOut} />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  clearAuth: () => {
    dispatch(Actions.clearAuth());
  },
  clearEth: () => {
    dispatch(Actions.clearEth());
  },
});

export default connect(null, mapDispatchToProps)(SettingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

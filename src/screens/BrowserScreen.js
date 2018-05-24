/**
 * Created by jack on 23/05/2018.
 */
import React, { Component } from 'react';
import { WebView } from 'react-native';

import { connect } from 'react-redux';

class BrowserScreen extends Component {
  render() {
    return (
      <WebView
        source={{ uri: 'http://bcc-codewarriors.com/Ethereum/INF239/Som/play.html' }}
      />
    );
  }
}

const mapStateToProps = state => ({
  address: state.auth.wallet.getChecksumAddressString(),
});

export default connect(mapStateToProps, null)(BrowserScreen);

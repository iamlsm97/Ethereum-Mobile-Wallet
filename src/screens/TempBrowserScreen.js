/**
 * Created by jack on 23/05/2018.
 */
import React, { Component } from 'react';
import { WebView } from 'react-native';

import { connect } from 'react-redux';

class TempBrowserScreen extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'http://bcc-codewarriors.com/Ethereum/INF239/Som/play.html'}}
        style={{marginTop: 20}}
        
        />
    );
  }
}

const mapStateToProps = state => ({
  address: state.auth.wallet.getChecksumAddressString(),
});

const mapDispatchToProps = dispatch => ({
  test: () => {
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TempBrowserScreen);

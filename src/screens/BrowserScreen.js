/**
 * Created by jack on 23/05/2018.
 */
import React, { Component } from 'react';
import { Platform, WebView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';

import RNFS from 'react-native-fs';

import CONSTS from '../consts';

class BrowserScreen extends Component {
  constructor(props) {
    super(props);
    this.webview = React.createRef();
    this.web3File = '';
    this.jsToInject = '';
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    Platform.OS === 'ios' ? this.readWeb3FileIOS() : this.readWeb3FileAndroid();
  }

  readWeb3FileIOS = () => {
    RNFS.readFile(`${RNFS.MainBundlePath}/web3.min.js`, 'utf8')
      .then((result) => {
        this.web3File = result;
        this.jsToInject = `
console.log("inject web3 to the webview");
${this.web3File}
window.web3 = new window.Web3(new window.Web3.providers.HttpProvider("${CONSTS.ROPSTEN_RPC_URL}"));
      `;

        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        Toast.show('Failed to read web3.min.js', Toast.LONG);
        console.warn(error);
        this.setState({
          isLoading: false,
        });
      });
  }

  readWeb3FileAndroid = () => {
    RNFS.readFileAssets('web3.min.js', 'utf8')
      .then((result) => {
        this.web3File = result;
        this.jsToInject = `
console.log("inject web3 to the webview");
${this.web3File}
window.web3 = new window.Web3(new window.Web3.providers.HttpProvider("${CONSTS.ROPSTEN_RPC_URL}"));
        `;

        if (Platform.OS === 'android') {
          this.jsToInject = encodeURI(this.jsToInject);
        }

        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        Toast.show('Failed to read web3.min.js', Toast.LONG);
        console.warn(error);
        this.setState({
          isLoading: false,
        });
      });
  }

  onLoadStart = () => {
    this.webview.current.injectJavaScript(this.jsToInject);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner
          visible={this.state.isLoading}
          textContent="Loading Browser"
          textStyle={{ color: '#ffffff' }}
        />
      );
    }

    return (
      <WebView
        ref={this.webview}
        source={{ uri: 'http://bcc-codewarriors.com/Ethereum/INF239/Som/play.html' }}
        onLoadStart={this.onLoadStart}
      />
    );
  }
}

const mapStateToProps = state => ({
  address: state.auth.wallet.getChecksumAddressString(),
});

export default connect(mapStateToProps, null)(BrowserScreen);

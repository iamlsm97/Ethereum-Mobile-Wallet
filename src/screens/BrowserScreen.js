/**
 * Created by jack on 23/05/2018.
 */
import React, { Component } from 'react';
import { Platform, WebView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';

import RNFS from 'react-native-fs';

import CustomProvider from '../eth/CustomProvider';
import Web3RPCHandler from '../eth/Web3RPCHandler';

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
    const providerParam = {
      address: this.props.address,
      networkId: 3,
    };

    Platform.OS === 'ios' ? this.readWeb3FileIOS() : this.readWeb3FileAndroid()
      .then((result) => {
        this.web3File = result;
        this.jsToInject = `
${this.web3File}
(${CustomProvider.toString()}(${JSON.stringify(providerParam)}));`;

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

  readWeb3FileIOS = () => RNFS.readFile(`${RNFS.MainBundlePath}/web3.min.js`, 'utf8')

  readWeb3FileAndroid = () => RNFS.readFileAssets('web3.min.js', 'utf8')

  onLoadStart = () => {
    this.webview.current.injectJavaScript(this.jsToInject);
  }

  respond = (id, result) => {
    this.webview.current.injectJavaScript(`window.__internal__.respond(${JSON.stringify(id)}, ${JSON.stringify(result)})`);
  }

  fail = (id, error) => {
    this.webview.current.injectJavaScript(`window.__internal__.fail(${JSON.stringify(id)}, ${JSON.stringify(error)})`);
  }

  onMessage = (event) => {
    let payload = null;
    try {
      payload = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      return;
    }

    new Web3RPCHandler(this.props.web3, payload, this.props.address, this.props.navigation, this.respond, this.fail, this.props.dispatch).handle();
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
        onMessage={this.onMessage}
      />
    );
  }
}

const mapStateToProps = state => ({
  address: state.auth.wallet.getChecksumAddressString(),
  web3: state.eth.web3,
});

export default connect(mapStateToProps)(BrowserScreen);

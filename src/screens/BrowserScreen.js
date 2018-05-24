/**
 * Created by jack on 23/05/2018.
 */
import React, { Component } from 'react';

import { connect } from 'react-redux';

import WebViewBridge from 'react-native-webview-bridge-updated';

const injectedJavaScript = `
(function () {
  if (WebViewBridge) {
    WebViewBridge.onMessage = function (message) {
      if (message === "hello from react-native") {
        console.log("we have got a message from react-native! yeah");
        WebViewBridge.send("got the message inside webview");
      }
    };

    WebViewBridge.send("hello from webview");
  }
}());
`;

class BrowserScreen extends Component {
  constructor(props) {
    super(props);
    this.webViewBridge = React.createRef();
  }

  onBridgeMessage = (message) => {
    switch (message) {
      case 'hello from webview':
        this.webViewBridge.current.sendToBridge('hello from react-native');
        break;
      case 'got the message inside webview':
        console.log('we have got a message from webview! yeah');
        break;
      default:
        console.log('received an unhandled message!');
        break;
    }
  }

  render() {
    return (
      <WebViewBridge
        ref={this.webViewBridge}
        source={{ uri: 'http://bcc-codewarriors.com/Ethereum/INF239/Som/play.html' }}
        onBridgeMessage={this.onBridgeMessage}
        injectedJavaScript={injectedJavaScript}
      />
    );
  }
}

const mapStateToProps = state => ({
  address: state.auth.wallet.getChecksumAddressString(),
});

export default connect(mapStateToProps, null)(BrowserScreen);

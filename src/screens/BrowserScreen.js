/**
 * Created by jack on 23/05/2018.
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  WebView,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { connect } from 'react-redux';

import RNFS from 'react-native-fs';

import CONSTS from '../consts';
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
      urlInput: CONSTS.INITIAL_URL,
      currentUrl: CONSTS.INITIAL_URL,
      canGoBack: false,
      canGoForward: false,
    };
  }

  componentDidMount() {
    const providerParam = {
      address: this.props.address,
      networkId: 3,
    };

    const readWeb3File = Platform.OS === 'ios' ? this.readWeb3FileIOS() : this.readWeb3FileAndroid();
    readWeb3File
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
        this.setState({ isLoading: false });
        Toast.show('Failed to read web3.min.js', Toast.LONG);
        Toast.show(error.toString().split('\n', 1)[0], Toast.LONG);
        console.warn(error.toString());
      });
  }

  readWeb3FileIOS = () => RNFS.readFile(`${RNFS.MainBundlePath}/web3.min.js`, 'utf8')

  readWeb3FileAndroid = () => RNFS.readFileAssets('web3.min.js', 'utf8')

  goBack = () => {
    if (this.state.canGoBack) {
      this.webview.current.goBack();
    }
  }

  goForward = () => {
    if (this.state.canGoForward) {
      this.webview.current.goForward();
    }
  }

  handleSubmitUrl = () => {
    if (this.state.urlInput) {
      this.setState({ currentUrl: this.state.urlInput });
    } else {
      this.setState({ urlInput: this.state.currentUrl });
    }
  }

  reload = () => {
    this.webview.current.reload();
  }

  onLoadStart = () => {
    this.webview.current.injectJavaScript(this.jsToInject);
  }

  handleUrlChange = (webViewState) => {
    if (!webViewState.loading) {
      this.setState({
        urlInput: webViewState.url,
        currentUrl: webViewState.url,
        canGoBack: webViewState.canGoBack,
        canGoForward: webViewState.canGoForward,
      });
    }
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

    const networkId = 3;
    new Web3RPCHandler(this.props.web3, payload, this.props.address, networkId, this.props.navigation, this.respond, this.fail, this.props.dispatch).handle();
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
      <View style={{ flex: 1 }}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={this.goBack} disabled={!this.state.canGoBack}>
            <View style={styles.navBarButton}>
              <Icon name="chevron-left" size={30} color={this.state.canGoBack ? '#808080' : '#80808033'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goForward} disabled={!this.state.canGoForward}>
            <View style={styles.navBarButton}>
              <Icon name="chevron-right" size={30} color={this.state.canGoForward ? '#808080' : '#80808033'} />
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.navBarInput}
            underlineColorAndroid="transparent" // only android
            clearButtonMode="while-editing" // only ios
            keyboardType={Platform.OS === 'ios' ? 'url' : 'default'}
            returnKeyType="go"
            placeholder="Enter URL"
            selectTextOnFocus
            onChangeText={text => this.setState({ urlInput: text })}
            value={this.state.urlInput}
            onSubmitEditing={this.handleSubmitUrl}
          />
          <TouchableOpacity onPress={this.reload}>
            <View style={styles.navBarButton}>
              <Icon name="refresh" size={25} color="#808080" />
            </View>
          </TouchableOpacity>
        </View>

        <WebView
          ref={this.webview}
          source={{ uri: this.state.currentUrl }}
          startInLoadingState
          onLoadStart={this.onLoadStart}
          onNavigationStateChange={this.handleUrlChange}
          onMessage={this.onMessage}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  address: state.auth.wallet.getChecksumAddressString(),
  web3: state.eth.web3,
});

export default connect(mapStateToProps)(BrowserScreen);

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  navBarButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#bfbfbf',
  },
  navBarInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#bfbfbf',
  },
});

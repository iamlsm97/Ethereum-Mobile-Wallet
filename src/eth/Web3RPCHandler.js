import axios from 'axios';

import CONSTS from '../consts';
import Actions from '../actions/index';

export default class Web3RPCHandler {
  constructor(web3, payload, address, networkId, navigation, respondCallback, failCallback, dispatch) {
    this.web3 = web3;
    this.payload = payload;
    this.address = address;
    this.networkId = networkId;
    this.navigation = navigation;
    this.respondCallback = respondCallback;
    this.failCallback = failCallback;
    this.dispatch = dispatch;
  }

  handle() {
    switch (this.payload.method) {
      case 'net_version':
        this.netVersion();
        break;
      case 'eth_coinbase':
        this.ethCoinbase();
        break;
      case 'eth_accounts':
        this.ethAccounts();
        break;
      case 'eth_sign':
        this.ethSign();
        break;
      // case 'personal_sign':
      //     return void this.personal_sign();
      // case 'personal_ecRecover':
      //     return void this.personal_ecRecover();
      // case 'eth_signTypedData':
      //     return void this.eth_signTypedData();
      case 'eth_sendTransaction':
        this.ethSendTransaction();
        break;
      case 'eth_newFilter':
        this.ethNewFilter();
        break;
      case 'eth_newBlockFilter':
        this.ethNewBlockFilter();
        break;
      case 'eth_newPendingTransactionFilter':
        this.ethNewPendingTransactionFilter();
        break;
      case 'eth_uninstallFilter':
        this.ethUninstallFilter();
        break;
      case 'eth_getFilterChanges':
        this.ethGetFilterChanges();
        break;
      case 'eth_getFilterLogs':
        this.ethGetFilterLogs();
        break;
      default:
        this.defaultHandler();
        break;
    }
  }

  respond(result) {
    this.respondCallback(this.payload.id, {
      jsonrpc: '2.0',
      id: this.payload.id,
      result,
    });
  }

  fail(error) {
    this.failCallback(this.payload.id, error);
  }

  defaultHandler() {
    axios.post(CONSTS.ROPSTEN_RPC_URL, this.payload)
      .then((response) => {
        if (response.data.id !== this.payload.id) {
          this.fail('Response with an Invalid Id!');
        }
        this.respondCallback(response.data.id, response.data);
      })
      .catch((error) => {
        console.warn(error.toString());
        this.fail(error.toString());
      });
  }

  netVersion() {
    this.respond(this.networkId);
  }

  ethCoinbase() {
    this.respond(this.address);
  }

  ethAccounts() {
    this.respond(this.address ? [this.address] : []);
  }

  ethSign() {
    // TODO: 이 부분 ethereumjs-util을 사용하여 제대로 마무리하기
    // TODO: 모달이든 탭이든 별도의 장소로 빼서 싸인해야함
    console.warn('Unable to handle eth_sign method!');
    console.log(this.payload);
  }

  async ethSendTransaction() {
    const param = this.payload.params[0];
    if (param.from !== this.address) {
      this.fail(`Can't sign for Unknown Address ${param.from}`);
    }

    this.dispatch(Actions.tx.clearTx());
    if (param.to) {
      this.dispatch(Actions.tx.setTo(param.to));
    }
    if (param.value) {
      const value = this.web3.utils.fromWei(this.web3.utils.hexToNumberString(param.value), 'ether');
      this.dispatch(Actions.tx.setValue(value));
    }
    if (param.gas) {
      const gasLimit = this.web3.utils.hexToNumberString(param.gas);
      this.dispatch(Actions.tx.setGasLimit(gasLimit));
    } else if (param.data) {
      const gasLimit = await this.web3.eth.estimateGas({
        from: this.address,
        to: param.to,
        data: param.data,
      });
      this.dispatch(Actions.tx.setGasLimit(gasLimit.toString()));
      this.dispatch(Actions.tx.setData(param.data));
    }
    if (param.gasPrice) {
      const gasPrice = this.web3.utils.fromWei(this.web3.utils.hexToNumberString(param.gasPrice), 'gwei');
      this.dispatch(Actions.tx.setGasPrice(gasPrice));
    }
    this.dispatch(Actions.tx.setCallback({
      respond: this.respond.bind(this),
      fail: this.fail.bind(this),
    }));

    this.navigation.navigate('Tx');
  }

  ethNewFilter() {
    console.warn('Unable to handle eth_newFilter method!');
    console.log(this.payload);
  }

  ethNewBlockFilter() {
    console.warn('Unable to handle eth_newBlockFilter method!');
    console.log(this.payload);
  }

  ethNewPendingTransactionFilter() {
    console.warn('Unable to handle eth_newPendingTransactionFilter method!');
    console.log(this.payload);
  }

  ethUninstallFilter() {
    console.warn('Unable to handle eth_uninstallFilter method!');
    console.log(this.payload);
  }

  ethGetFilterChanges() {
    console.warn('Unable to handle eth_getFilterChanges method!');
    console.log(this.payload);
  }

  ethGetFilterLogs() {
    console.warn('Unable to handle eth_getFilterLogs method!');
    console.log(this.payload);
  }
}

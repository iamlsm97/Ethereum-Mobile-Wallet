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
      case 'eth_accounts':
        this.ethAccounts();
        break;
      case 'eth_coinbase':
        this.ethCoinbase();
        break;
      case 'net_version':
        this.netVersion();
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
      // case 'eth_newFilter':
      //     return void this.eth_newFilter();
      // case 'eth_newBlockFilter':
      //     return void this.eth_newBlockFilter();
      // case 'eth_newPendingTransactionFilter':
      //     return void this.eth_newPendingTransactionFilter();
      // case 'eth_uninstallFilter':
      //     return void this.eth_uninstallFilter();
      // case 'eth_getFilterChanges':
      //     return void this.eth_getFilterChanges();
      // case 'eth_getFilterLogs':
      //     return void this.eth_getFilterLogs();
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

  ethAccounts() {
    this.respond(this.address ? [this.address] : []);
  }

  ethCoinbase() {
    this.respond(this.address);
  }

  netVersion() {
    this.respond(this.networkId);
  }

  ethSign() {
    // TODO: 지금은 그냥 싸인해주지만 나중에는 모달이든 탭이든 별도의 장소로 빼서 싸인해야함
    // TODO: 이 부분 ethereumjs-util을 사용하여 제대로 마무리하기
    console.error('Unable to handle eth_sign method!');
    this.web3.sign(this.payload.params[1], this.payload.params[0]);
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
      this.dispatch(Actions.tx.setValue(param.value));
    }
    if (param.gas) {
      this.dispatch(Actions.tx.setGasLimit(param.gas));
    }
    if (param.gasPrice) {
      this.dispatch(Actions.tx.setGasPrice(param.gasPrice));
    }
    if (param.data) {
      this.dispatch(Actions.tx.setData(param.data));
      if (!param.gas) {
        const gasLimit = await this.web3.eth.estimateGas({
          from: this.address,
          to: param.to,
          data: param.data,
        });
        this.dispatch(Actions.tx.setGasLimit(gasLimit.toString()));
      }
    }
    this.dispatch(Actions.tx.setCallback({
      respond: this.respond.bind(this),
      fail: this.fail.bind(this),
    }));

    this.navigation.navigate('Tx');
  }
}

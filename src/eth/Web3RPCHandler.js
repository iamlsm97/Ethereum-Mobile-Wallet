import Actions from '../actions/index';

export default class Web3RPCHandler {
  constructor(web3, payload, address, navigation, respondCallback, failCallback, dispatch) {
    this.web3 = web3;
    this.payload = payload;
    this.address = address;
    this.navigation = navigation;
    this.respondCallback = respondCallback;
    this.failCallback = failCallback;
    this.dispatch = dispatch;
  }

  handle() {
    console.log(this.payload);

    switch (this.payload.method) {
      // case 'eth_accounts':
      //     return void this.eth_accounts();
      // case 'eth_coinbase':
      //     return void this.eth_coinbase();
      // case 'net_version':
      //     return void this.net_version();
      // case 'eth_sign':
      //     return void this.eth_sign();
      // case 'personal_sign':
      //     return void this.personal_sign();
      // case 'personal_ecRecover':
      //     return void this.personal_ecRecover();
      // case 'eth_signTypedData':
      //     return void this.eth_signTypedData();
      case 'eth_sendTransaction':
        this.sendTransaction();
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
        console.log('default');
        // this.rpc.callMethod(e.method, e.params).then(this.respond).catch(this.failWithError)
        this.fail(`Unable to handle ${this.payload.method} Method!`);
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

  async sendTransaction() {
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

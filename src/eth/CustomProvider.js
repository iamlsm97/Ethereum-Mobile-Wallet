export default (providerParam) => {
  let handlerMap = new Map();

  const CustomProvider = function () {};

  CustomProvider.prototype.handleSend = function (payload) {
    console.log("into the handleSend");
    const self = this;
    const address = providerParam.address;
    const networkId = providerParam.networkId;
    let result = null;

    switch (payload.method) {
      case 'eth_accounts':
      console.log("received eth_accounts");
      result = address ? [address] : [];
      break;

      case 'eth_coinbase':
      result = address || null;
      break;

      case 'eth_uninstallFilter':
      self.sendAsync(payload, function () {});
      result = true;
      break;

      case 'net_version':
      result = networkId || null;
      break;

      default:
      const message = 'CustomProvider does not support synchronous methods like ' + payload.method + ' without a callback parameter.';
      throw new Error(message);
    }

    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result: result,
    };
  };

  CustomProvider.prototype.handleSendAsync = function (payload) {
    return new Promise(function (resolve, reject) {
      console.log("handleSendAsync function promise");
      handlerMap.set(payload.id, function (error, result) {
        if (error) {
          reject(error);
          return;
        }
        if (result) {
          resolve(result);
        }
      });
      window.postMessage(JSON.stringify(payload));
    });
  };

  CustomProvider.prototype.send = function (payload) {
    console.log('CustomProvider send function');
    console.log(payload);
    return Array.isArray(payload) ? payload.map(this.handleSend) : this.handleSend(payload);
  };

  CustomProvider.prototype.sendAsync = function (payload, cb) {
    console.log('CustomProvider sendAsync function');
    console.log(payload);
    console.log(cb.toString());
    if (Array.isArray(payload)) {
      Promise.all(payload.map(this.handleSendAsync))
      .then(function (result) {
        return cb(null, result);
      })
      .catch(function (error) {
        return cb(error, null);
      });
    } else {
      this.handleSendAsync(payload)
      .then(function (result) {
        return cb(null, result);
      })
      .catch(function (error) {
        return cb(error, null);
      });
    }
  };

  CustomProvider.prototype.isConnected = function () {
    return true;
  };

  CustomProvider.prototype.isCustom = true;

  window.web3 = new window.Web3(new CustomProvider());

  Object.defineProperty(window, '__internal__', {
    value: {
      respond: function (id, result) {
        const handler = handlerMap.get(id);
        if (handler) {
          handlerMap.delete(id);
          handler(null, result);
        }
      },
      fail: function (id, error) {
        const handler = handlerMap.get(id);
        if (handler) {
          handlerMap.delete(id);
          handler(new Error(error), null);
        }
      }
    }
  });
};

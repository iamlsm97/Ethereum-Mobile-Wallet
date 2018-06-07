export const setTo = to => ({
  type: 'SET_TO',
  to,
});

export const setValue = value => ({
  type: 'SET_VALUE',
  value,
});

export const setGasPrice = gasPrice => ({
  type: 'SET_GAS_PRICE',
  gasPrice,
});

export const setGasLimit = gasLimit => ({
  type: 'SET_GAS_LIMIT',
  gasLimit,
});

export const setData = data => ({
  type: 'SET_DATA',
  data,
});

export const setCallback = callback => ({
  type: 'SET_CALLBACK',
  callback,
});

export const setTxHash = txHash => ({
  type: 'SET_TX_HASH',
  txHash,
});

export const clearTx = () => ({
  type: 'CLEAR_TX',
});

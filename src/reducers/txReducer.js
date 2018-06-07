const initialState = {
  to: '',
  value: '', // in ether
  gasPrice: '', // in gwei
  gasLimit: '',
  data: '',
  callback: null,
  txHash: '',
};

const txReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TO':
      return Object.assign({}, state, {
        to: action.to,
      });
    case 'SET_VALUE':
      return Object.assign({}, state, {
        value: action.value,
      });
    case 'SET_GAS_PRICE':
      return Object.assign({}, state, {
        gasPrice: action.gasPrice,
      });
    case 'SET_GAS_LIMIT':
      return Object.assign({}, state, {
        gasLimit: action.gasLimit,
      });
    case 'SET_DATA':
      return Object.assign({}, state, {
        data: action.data,
      });
    case 'SET_CALLBACK':
      return Object.assign({}, state, {
        callback: action.callback,
      });
    case 'SET_TX_HASH':
      return Object.assign({}, state, {
        txHash: action.txHash,
      });
    case 'CLEAR_TX':
      return initialState;
    default:
      return state;
  }
};

export default txReducer;

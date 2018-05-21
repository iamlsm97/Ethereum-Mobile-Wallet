const initialState = {
  web3: null,
  balance: 0,
};

const ethRudecer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WEB3':
      return Object.assign({}, state, {
        web3: action.web3,
      });
    case 'SET_BALANCE':
      return Object.assign({}, state, {
        balance: action.amount,
      });
    case 'CLEAR_ETH':
      return initialState;
    default:
      return state;
  }
};

export default ethRudecer;

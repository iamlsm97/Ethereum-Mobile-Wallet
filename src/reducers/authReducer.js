const initialState = {
  mnemonic: '',
  wallet: null,
};

const authRudecer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MNEMONIC':
      return Object.assign({}, state, {
        mnemonic: action.mnemonic,
      });
    case 'SET_WALLET':
      return Object.assign({}, state, {
        wallet: action.wallet,
      });
    case 'CLEAR_AUTH':
      return initialState;
    default:
      return state;
  }
};

export default authRudecer;

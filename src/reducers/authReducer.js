const initialState = {
  mnemonic: '',
  address: '',
  privateKey: '',
};

const authRudecer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MNEMONIC':
      return Object.assign({}, state, {
        mnemonic: action.mnemonic,
      });
    case 'SET_ACCOUNT':
      return Object.assign({}, state, {
        address: action.address,
        privateKey: action.privateKey,
      });
    case 'CLEAR_AUTH':
      return initialState;
    default:
      return state;
  }
};

export default authRudecer;

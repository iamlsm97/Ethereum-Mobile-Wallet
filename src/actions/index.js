export const setMnemonic = mnemonic => ({
  type: 'SET_MNEMONIC',
  mnemonic,
});

export const setAccount = (address, privateKey) => ({
  type: 'SET_ACCOUNT',
  address,
  privateKey,
});

export const clearAuth = () => ({
  type: 'CLEAR_AUTH',
});

export const setEth = amount => ({
  type: 'SET_ETH',
  amount,
});

export const deriveWalletFromMnemonic = mnemonic => dispatch => new Promise((resolve) => {
  // calculate address and privateKey
  const address = mnemonic.split('').reverse().join('');
  const privateKey = address.substring(0, 10);

  // save to redux store
  dispatch(setAccount(address, privateKey));
  resolve();
});

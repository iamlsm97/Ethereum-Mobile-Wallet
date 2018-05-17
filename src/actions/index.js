import bip39 from 'react-native-bip39';
import hdkey from 'ethereumjs-wallet/hdkey';

export const setMnemonic = mnemonic => ({
  type: 'SET_MNEMONIC',
  mnemonic,
});

const setWallet = wallet => ({
  type: 'SET_WALLET',
  wallet,
});

export const clearAuth = () => ({
  type: 'CLEAR_AUTH',
});

export const setEth = amount => ({
  type: 'SET_ETH',
  amount,
});

export const deriveWalletFromMnemonic = mnemonic => dispatch => new Promise((resolve) => {
  const rootSeed = bip39.mnemonicToSeed(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(rootSeed);
  const path = "m/44'/60'/0'/0/0";
  const wallet = hdwallet.derivePath(path).getWallet();
  dispatch(setWallet(wallet));
  resolve();
});

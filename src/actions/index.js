import unorm from 'unorm';
import { pbkdf2 } from 'react-native-fast-crypto';
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

// functions from bip39 package
const salt = password => `mnemonic${password || ''}`;
const mnemonicToSeed = (mnemonic, password) => {
  const mnemonicBuffer = Buffer.from(unorm.nfkd(mnemonic), 'utf8');
  const saltBuffer = Buffer.from(salt(unorm.nfkd(password)), 'utf8');
  return pbkdf2.deriveAsync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
};

export const deriveWalletFromMnemonic = mnemonic => dispatch => new Promise((resolve) => {
  const rootSeed = mnemonicToSeed(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(rootSeed);
  const path = "m/44'/60'/0'/0/0";
  const wallet = hdwallet.derivePath(path).getWallet();
  dispatch(setWallet(wallet));
  resolve();
});

import unorm from 'unorm';
import { pbkdf2 } from 'react-native-fast-crypto';
import hdkey from 'ethereumjs-wallet/hdkey';

import CONSTS from '../consts';

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

// functions from bip39 package
const salt = password => `mnemonic${password || ''}`;
const mnemonicToSeed = (mnemonic, password) => {
  const mnemonicBuffer = Buffer.from(unorm.nfkd(mnemonic), 'utf8');
  const saltBuffer = Buffer.from(salt(unorm.nfkd(password)), 'utf8');
  return pbkdf2.deriveAsync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
};

export const deriveWalletFromMnemonic = mnemonic => dispatch => new Promise(async (resolve) => {
  const rootSeed = await mnemonicToSeed(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(rootSeed);
  const wallet = hdwallet.derivePath(CONSTS.PATH).getWallet();
  dispatch(setWallet(wallet));
  resolve();
});

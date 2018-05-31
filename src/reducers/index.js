import { AsyncStorage } from 'react-native';

import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import authReducer from './authReducer';
import ethReducer from './ethReducer';
import txReducer from './txReducer';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['mnemonic'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  eth: ethReducer,
  tx: txReducer,
});

export default rootReducer;

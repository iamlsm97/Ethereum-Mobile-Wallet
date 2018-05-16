import { AsyncStorage } from 'react-native';

import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import authReducer from './authReducer';
import ethReducer from './ethReducer';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['seed'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  eth: ethReducer,
});

export default rootReducer;

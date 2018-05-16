export const setSeed = seed => ({
  type: 'SET_SEED',
  seed,
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

export const setWeb3 = web3 => ({
  type: 'SET_WEB3',
  web3,
});

export const setBalance = amount => ({
  type: 'SET_BALANCE',
  amount,
});

export const clearEth = () => ({
  type: 'CLEAR_ETH',
});

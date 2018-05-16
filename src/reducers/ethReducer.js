const ethRudecer = (state = 0, action) => {
  switch (action.type) {
    case 'SET_ETH':
      return action.amount;
    default:
      return state;
  }
};

export default ethRudecer;

const appState = [];

function useState(initialState) {
  const pointer = window.budgetReact.statePointer++;
  appState[pointer] = appState[pointer] || initialState;
  const setState = (newState) => {
    appState[pointer] = newState;
    window.budgetReact.reRender();
  };
  return [appState[pointer], setState];
}

export default useState;

Node;

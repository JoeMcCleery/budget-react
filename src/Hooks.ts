export let stateIndex = 0;
export const appState: any[] = [];

export function useState<T>(initalValue: T) {
  const index = stateIndex++;
  let state = appState[index] || initalValue;
  function setState(newState: T) {
    appState[index] = newState;
    console.log("new state:", appState[index]);
  }
  return [state, setState] as const;
}

export let stateIndex = 0;
export const appState: any[] = [];

export function useState<T>(initalValue: T) {
  const index = stateIndex++;
  appState[index] = appState[index] || initalValue;
  function setState(newState: T) {
    appState[index] = newState;
    console.log("new state:", appState[index]);
  }
  return [appState[index], setState] as const;
}

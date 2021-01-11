export class Store {
  private subscribers: Function[];
  private reducers: { [key: string]: Function };
  private state: { [key: string]: any };

  constructor(reducers = {}, initialState = {}) {
    this.subscribers = [];
    this.reducers = reducers;
    this.state = this.reduce(initialState, {});
  }

  get value() {
    return this.state;
  }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn]; //Add the new subscriber to list of subscribers
    this.notify();
    return () => {
      //unsubscribe functionality
      this.subscribers = this.subscribers.filter((sub) => sub !== fn);
    };
  }

  dispatch(action) {
    // We are telling the store to update the particular state
    this.state = this.reduce(this.state, action);
    this.notify();
  }

  private notify() {
    this.subscribers.forEach((fn) => fn(this.value)); //Pass the new state value
  }

  private reduce(state, action) {
    const newState = {};
    for (const prop in this.reducers) {
      newState[prop] = this.reducers[prop](state[prop], action); //Each reducer manages its own piece/slice of state
    }
    return newState;
  }
}

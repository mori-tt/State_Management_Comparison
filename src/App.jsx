import React, { useState, useReducer } from "react";
import { createStore, combineReducers } from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";
import { create } from "zustand";
import { useAtom, atom } from "jotai";

// ReduxのReducerとStoreの設定
const counterReducer = (state = { counter: 0 }, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, counter: state.counter + 1 }; // カウンターを増加
    case "DECREMENT":
      return { ...state, counter: state.counter - 1 }; // カウンターを減少
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  counter: counterReducer,
});

// Reduxのアクションタイプ定義
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// Reduxのアクションクリエーター定義
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// Jotaiのatom定義
const countAtom = atom(0);

// Zustandのstore定義
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default function App() {
  // useStateを使用した状態管理
  const [state, setState] = useState(0);

  // useReducerを使用した状態管理
  const [rstate, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "+":
        return state + action.step; // ステップ分だけ増加
      case "-":
        return state - action.step; // ステップ分だけ減少
      default:
        throw new Error("Unknown action");
    }
  }, 0);

  // Reduxを使用した状態管理
  const reduxState = useSelector((state) => state.counter.counter);
  const reduxDispatch = useDispatch();

  // Jotaiを使用した状態管理
  const [jotaiState, setJotaiState] = useAtom(countAtom);

  // Zustandを使用した状態管理
  const zustandState = useCounterStore((state) => state.count);
  const { increment: zustandIncrement, decrement: zustandDecrement } =
    useCounterStore();

  return (
    <div>
      <h2>useState</h2>
      <h4>{state}</h4>
      <button onClick={() => setState(state + 1)}>+</button>
      <button onClick={() => setState(state - 1)}>-</button>

      <h2>useReducer</h2>
      <h4>{rstate}</h4>
      <button onClick={() => dispatch({ type: "+", step: 1 })}>+</button>
      <button onClick={() => dispatch({ type: "-", step: 1 })}>-</button>

      <h2>Redux</h2>
      <h4>{reduxState}</h4>
      <button onClick={() => reduxDispatch(increment())}>+</button>
      <button onClick={() => reduxDispatch(decrement())}>-</button>

      <h2>Jotai</h2>
      <h4>{jotaiState}</h4>
      <button onClick={() => setJotaiState(jotaiState + 1)}>+</button>
      <button onClick={() => setJotaiState(jotaiState - 1)}>-</button>

      <h2>Zustand</h2>
      <h4>{zustandState}</h4>
      <button onClick={zustandIncrement}>+</button>
      <button onClick={zustandDecrement}>-</button>
    </div>
  );
}

export const store = createStore(rootReducer);

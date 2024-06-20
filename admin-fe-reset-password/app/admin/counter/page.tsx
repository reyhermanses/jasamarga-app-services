"use client";

import React from "react";

import type { RootState } from "@/app/redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
} from "../../redux/features/counterSlice";

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <button onClick={() => dispatch(increment())}> increment</button>
      <span>{count}</span>
      <button onClick={() => dispatch(decrement())}> decrement</button>
      <button onClick={() => dispatch(incrementByAmount(2))}>
        incrementByAmount
      </button>
    </div>
  );
}

export default Counter;

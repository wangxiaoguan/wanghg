

export const INCREMENT = "INCREMENT"
export function  increment(){  return { type:INCREMENT  }}

export const DECREMENT = "DECREMENT"
export const decrement = count=>{ return { type:DECREMENT,  count }}
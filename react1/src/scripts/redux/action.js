


export const ADD = "ADD";
export function add(city){return {type:ADD,city}}


export const NUMBER = 'NUMBER';
export  function number(num){return {type:NUMBER,num}}


export const CHANGEMSG = 'changemsg';
export  const changemsg = msg =>{return {type:CHANGEMSG,msg}}
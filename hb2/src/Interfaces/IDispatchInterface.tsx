export default interface IDispatchInterface {
  dispatch: (arg: { type: string, payLoad?: any, callBack?: (res) => void }) => void;
  [propsName: string]: any,
}
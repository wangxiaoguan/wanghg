import { FormComponentProps } from 'antd/lib/form';
import IDispatchInterface from './IDispatchInterface';

interface IFormAndDvaInterface extends FormComponentProps, IDispatchInterface {
  [propsName: string]: any;
}

export default IFormAndDvaInterface;
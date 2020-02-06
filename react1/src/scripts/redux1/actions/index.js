

// action 就是一个对象   
//  {type:"xxxx"}
// action creator  function(){return {} }


export {INCREMENT} from "./count"
export {increment} from "./count"

export {DECREMENT} from "./count"
export {decrement} from "./count"

export {CHANGECITY} from "./city"
export {changeCity} from "./city"

export {CHANGEMSG} from "./msg"
export {changeMsg} from "./msg"

export {CHANGEMSGBYINP} from "./msg"
export {ChangeMsgByInp} from "./msg"


export const CHANGENUMBER = "CHANGENUMBER"

export const changeNumber = (number)=>{
    return {
        type:CHANGENUMBER,
        number
    }
}

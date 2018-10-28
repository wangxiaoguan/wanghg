

export const CHANGEMSG = "CHANGEMSG"
export function changeMsg(msg){
    return {
        type:CHANGEMSG,
        msg
    }
}

export const CHANGEMSGBYINP = "CHANGEMSGBYINP";
export function ChangeMsgByInp(msg){
    return {
        type:CHANGEMSGBYINP,
        msg
    }
}
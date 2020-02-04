
import React,{Component} from "react";
import './array.scss'
export default class Array20 extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return(
            <div id='array20'>
                <h3>获取光标的坐标</h3>
<pre>{`
    getSelectionCoords=()=>{
        let win =  window;
        let doc = win.document;
        let sel = doc.selection, range, rects, rect;
        let x = 0, y = 0;
        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        } else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    // 光标在行首时，rect为undefined
                    if(rect){
                        x = rect.left;
                        y = rect.top;
                    }
                }
                if ((x == 0 && y == 0) || rect === undefined) {
                    let span = doc.createElement("span");
                    if (span.getClientRects) {
                        span.appendChild( doc.createTextNode("\u200b") );
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        x = rect.left;
                        y = rect.top;
                        let spanParent = span.parentNode;
                        spanParent.removeChild(span);
                        spanParent.normalize();
                    }
                }
            }
        }
        console.log(Math.ceil(x),Math.ceil(y)) //获取光标的坐标
        return { x: Math.ceil(x), y: Math.ceil(y) };
    }
`}</pre>
            </div>
        )
    }
}



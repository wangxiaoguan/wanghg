

import React, {Component} from "react";

const styles = {
    border:"2px dotted yellow",
    height:40,
}

export default React.createClass({
    render(){
        const {className,disabled,text,onClick} = this.props;
        return (
            <button style={styles} className={className} disabled={disabled} onClick={onClick}  >{text}</button>
        )
    }
})


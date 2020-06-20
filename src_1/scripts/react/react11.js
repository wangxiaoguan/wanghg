
import React,{Component} from "react";
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import './react.scss'
export default class React11 extends Component{
    constructor(props){
        super(props);
        this.state={
            editorState:null
        }
    }

    componentDidMount () {
        this.setState({
            editorState: BraftEditor.createEditorState(null)
        })
    }
    handleChange = (content) => {
        this.setState({ editorState:content })
    }
    
    render(){
        const { editorState } = this.state
        return(
            <div id='react11'>
                <div className='demo'>
                    <BraftEditor
                        value={editorState}
                        onChange={this.handleChange}
                    />
                </div> 
<pre>{`
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
<BraftEditor value={editorState} onChange={this.handleChange} />
componentDidMount () {
    this.setState({
        editorState: BraftEditor.createEditorState(null)
    })
}
handleChange = (content) => {
    this.setState({ editorState:content })
}
`}</pre>
            </div>
    
        )
    }
}




import React,{Component} from "react";
import './array.scss'
export default class Array12 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array2'>
            <h2>accept属性规定上传文件类型</h2>
<pre>{`
    accept属性仅适用于<input type="file">。
    <input type="file"accept="image/gif,image/jpeg"/>

    audio/* 接受所有的声音文件。
    video/* 接受所有的视频文件。
    image/* 接受所有的图像文件。

    *.3gpp      audio/3gpp, video/3gpp 3GPP Audio/Video
    *.ac3       audio/ac3 AC3 Audio
    *.asf       allpication/vnd.ms-asf Advanced Streaming Format
    *.au        audio/basic AU Audio
    *.css       text/css Cascading Style Sheets
    *.csv       text/csv Comma Separated Values
    *.doc       application/msword MS Word Document
    *.dot       application/msword MS Word Template
    *.dtd       application/xml-dtd Document Type Definition
    *.dwg       image/vnd.dwg AutoCAD Drawing Database
    *.dxf       image/vnd.dxf AutoCAD Drawing Interchange Format
    *.gif       image/gif Graphic Interchange Format
    *.htm       text/html HyperText Markup Language
    *.html      text/html HyperText Markup Language
    *.jp2       image/jp2 JPEG-2000
    *.jpe       image/jpeg JPEG
    *.jpeg      image/jpeg JPEG
    *.jpg       image/jpeg JPEG
    *.js        text/javascript, application/javascript JavaScript
    *.json      application/json JavaScript Object Notation
    *.mp2       audio/mpeg, video/mpeg MPEG Audio/Video Stream, Layer II
    *.mp3       audio/mpeg MPEG Audio Stream, Layer III
    *.mp4       audio/mp4, video/mp4 MPEG-4 Audio/Video
    *.mpeg      video/mpeg MPEG Video Stream, Layer II
    *.mpg       video/mpeg MPEG Video Stream, Layer II
    *.mpp       application/vnd.ms-project MS Project Project
    *.ogg       application/ogg, audio/ogg Ogg Vorbis
    *.pdf       application/pdf Portable Document Format
    *.png       image/png Portable Network Graphics
    *.pot       application/vnd.ms-powerpoint MS PowerPoint Template
    *.pps       application/vnd.ms-powerpoint MS PowerPoint Slideshow
    *.ppt       application/vnd.ms-powerpoint MS PowerPoint Presentation
    *.rtf       application/rtf, text/rtf Rich Text Format
    *.svf       image/vnd.svf Simple Vector Format
    *.tif       image/tiff Tagged Image Format File
    *.tiff      image/tiff Tagged Image Format File
    *.txt       text/plain Plain Text
    *.wdb       application/vnd.ms-works MS Works Database
    *.wps       application/vnd.ms-works Works Text Document
    *.xhtml     application/xhtml+xml Extensible HyperText Markup Language
    *.xlc       application/vnd.ms-excel MS Excel Chart
    *.xlm       application/vnd.ms-excel MS Excel Macro
    *.xls       application/vnd.ms-excel MS Excel Spreadsheet
    *.xlt       application/vnd.ms-excel MS Excel Template
    *.xlw       application/vnd.ms-excel MS Excel Workspace
    *.xml       text/xml, application/xml Extensible Markup Language
    *.zip       aplication/zip Compressed Archive
     
    实例:
    accept="image/gif,image/jpeg"
    accept="application/msword"
    accept="application/pdf"
    accept="application/poscript"
    accept="application/rtf"
    accept="application/x-zip-compressed"
    accept="audio/basic"
    accept="audio/x-aiff"
    accept="audio/x-mpeg"
    accept="audio/x-pn/realaudio"
    accept="audio/x-waw"
    accept="image/gif"
    accept="image/jpeg"
    accept="image/tiff"
    accept="image/x-ms-bmp"
    accept="image/x-photo-cd"
    accept="image/x-png"
    accept="image/x-portablebitmap"
    accept="image/x-portable-greymap"
    accept="image/x-portable-pixmap"
    accept="image/x-rgb"
    accept="text/html"
    accept="text/plain"
    accept="video/quicktime"
    accept="video/x-mpeg2"
    accept="video/x-msvideo"
`}</pre>
            </div>
        )
    }
}



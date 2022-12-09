import React from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageResize', ImageResize);

export default function TextEditor(props) {
    /* 
    * Quill modules to attach to editor
    * See https://quilljs.com/docs/modules/ for complete options
    */
    const modules = {
        syntax: true,
        toolbar: [
            [{ size: [] }],
            [{ 'header': [1, 2, 3, 4, 5, false] }, 'bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{
                'color': ['#111111', '#FF0000', '#001F3F', '#0074D9', '#7FDBFF',
                    '#39CCCC', '#3D9970', '#2ECC40', '#01FF70',
                    '#FFDC00', '#FF851B', '#FF4136', '#85144B',
                    '#F012BE', '#B10DC9', '#AAAAAA'
                ]
            }, {
                'background': [
                    'yellow', 'orange',
                ]
            }],
            ['link', 'image', 'code-block'],
            ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
        imageResize: {
            displaySize: true,
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
    }

    /* 
     * Quill editor formats
     */
    const formats = [
        'header', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'color', 'background',
        'link', 'image', 'code-block'
    ]
    
    return (
        <ReactQuill
            theme={"snow"}
            style={{
                height: "60vh",
                marginBottom: 20,
                paddingBottom: 40,
                border: "1px solid gray", 
                borderRadius: "6px",
            }}
            onChange={(html) => {
                props.setEditorHtml(html)
            }}
            value={props.editorHtml}
            modules={modules}
            formats={formats}
            placeholder={props.placeholder}
        />
    )
}
import React from "react";
import { makeStyles } from "@material-ui/core";

import ReactQuill, { Quill } from "react-quill";
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageResize', ImageResize);

const useStyles = makeStyles({
    'ql-snow': {
        bgcolor: "#23241f",
        color: "#f8f8f2",
    },
    'editor': {
        bgcolor: "#23241f",
        color: "black",
    },
    'pre.ql-syntax': {
        bgcolor: "#23241f",
        color: "#f8f8f2",
    }
})

export default function TextEditor(props) {
    /* 
    * Quill modules to attach to editor
    * See https://quilljs.com/docs/modules/ for complete options
    */
    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ size: [] }],
            [{ 'header': [1, 2, false] }, 'bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
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
        }
    }

    /* 
     * Quill editor formats
     */
    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'code-block'
    ]
    const classes = useStyles();
    return (
        <div>
            <ReactQuill
                theme={"snow"}
                onChange={(html) => {
                    console.log(html);
                    // const compressed = LZString.compress(html);
                    // console.log(compressed);
                    // console.log(html === LZString.decompress(compressed))
                    //console.log(html);
                    //console.log(Base64String.compress(html))
                    props.setEditorHtml(html)
                }}
                value={props.editorHtml}
                modules={modules}
                formats={formats}
                placeholder={props.placeholder}
                className={classes["editor"]}
            />
        </div>
    )
}
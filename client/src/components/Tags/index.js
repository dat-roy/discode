import React, { Fragment } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function Tags(props) {
    const { tags, setTags } = props;
    const { maxSelections } = props;
    const { placeholder } = props;
    return (
        <Fragment>
            <Autocomplete
                id="tags-standard"
                multiple
                autoHighlight
                options={technologies.sort()}
                getOptionLabel={(option) => `# ${option}`}
                getOptionDisabled={(option) => (
                    tags.length === maxSelections || tags.includes(option) ? true : false
                )}
                value={tags}
                onChange={(e, value) => {
                    setTags(value);
                }}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            variant="standard"
                            placeholder={placeholder}
                            helperText={
                                tags.length === maxSelections && `Only ${maxSelections} selections allowed`
                            }
                        />
                    )
                }}
                // onChange={(e, newVal) => {
                //     if (newVal > 3) {
                //         newVal.pop();
                //     }
                //     setAdded([...newVal]);
                // }}
                ChipProps={{
                    style: {
                        borderRadius: 30,
                        height: 28,
                        backgroundColor: "#ffe0b2"
                    }
                }}
            />
        </Fragment>
    );
}

const technologies = [
    "Javascript", "Java", "NodeJS", "ReactJS", "DevOps", "C++", "Blockchain",
    "MySQL", "MongoDB", "Express", "NuxtJs", "Machine Learning", 
]

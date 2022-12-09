import React, { Fragment } from 'react';
import MuiAutocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material/styles";

const Autocomplete = styled(MuiAutocomplete)({
    "& .MuiAutocomplete-inputRoot": {
        color: "lightyellow",
        "&:before": {
            borderBottomColor: "inherit"
        },
        "&:hover:not(.Mui-focused):before": {
            borderBottomColor: "lightyellow"
        },
        "&:after": {
            // focused
            borderBottomColor: "lightyellow"
        },
    },
})

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
                                <span style={{ color: "darkgray" }}>
                                    {
                                        tags.length === maxSelections && `Only ${maxSelections} selections allowed`
                                    }
                                </span>
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
                        backgroundColor: "#286b32",
                        color: "#fff391"
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

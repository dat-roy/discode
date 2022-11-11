import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

/*
 * See: MUI Chip Arrays.
 */
export default function TagsList({tagData, setTagData}) {
    const handleDelete = (tagToDelete) => () => {
        setTagData((tags) => tags.filter((tag) => tag.key !== tagToDelete.key));
    };

    return (
        <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
            }}
            component="ul"
        >
            {tagData.map((data) => {
                return (
                    <ListItem key={data.key}>
                        <Chip
                            label={data.label}
                            onDelete={handleDelete(data)}
                        />
                    </ListItem>
                );
            })}
        </Paper>
    );
}
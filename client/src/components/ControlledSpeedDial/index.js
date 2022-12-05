import * as React from 'react';
import { styled } from '@mui/material/styles';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
    },
}));

export default function ControlledSpeedDial({ direction, hidden, actions, icon }) {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <StyledSpeedDial
            ariaLabel="SpeedDial playground example"
            hidden={hidden}
            icon={(icon) ? icon : <SpeedDialIcon />}
            direction={direction}
            open={open}
            onClick={handleClick}
            onClose={handleClose}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action?.name}
                    icon={action?.icon}
                    tooltipTitle={action?.name}
                    onClick={action?.onClick}
                />
            ))}
        </StyledSpeedDial>
    );
}
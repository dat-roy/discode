export default ({ palette, spacing }) => {
    //console.log(palette)
    const radius = spacing(2.5);
    const size = spacing(4);
    return {
        avatar: {
            width: size,
            height: size,
        },
        leftRow: {
            textAlign: 'left',
        },
        rightRow: {
            textAlign: 'right',
        },
        msg: {
            padding: spacing(1, 2),
            borderRadius: 4,
            marginBottom: 4,
            display: 'inline-block',
            wordBreak: 'break-word',
            fontFamily:
                // eslint-disable-next-line max-len
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            fontSize: '14px',
        },
        left: {
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
            backgroundColor: palette.info.light,
            color: palette.info.contrastText,
        },
        right: {
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
        },
        leftFirst: {
            borderTopLeftRadius: radius,
        },
        leftLast: {
            borderBottomLeftRadius: radius,
        },
        rightFirst: {
            borderTopRightRadius: radius,
        },
        rightLast: {
            borderBottomRightRadius: radius,
        },
        center: {
            fontStyle: "italic", 
        }
    };
};
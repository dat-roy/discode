import React, { Fragment, useState } from 'react';
import moment from "moment";

import GlobalStyles from '@mui/material/GlobalStyles';

import PropTypes from 'prop-types';
import cx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@mui/material/Dialog';
import Typography from '@material-ui/core/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { MessageTypes } from '../../types/db.type';

const inputGlobalStyles = <GlobalStyles
    styles={(theme) => {
        //console.log("Theme: ", theme);
        const {
            palette,
            spacing
        } = theme;
        const radius = spacing(2.2);
        const size = spacing(4);
        return ({
            ".avatar": {
                width: size,
                height: size,
                cursor: "pointer",
            },
            ".leftRow": {
                textAlign: 'left',
            },
            ".rightRow": {
                textAlign: 'right',
            },
            ".msg": {
                padding: spacing(0.8, 2.1),
                borderRadius: 4,
                display: 'inline-block',
                maxWidth: "250px",
                wordWrap: "break-word",
                whiteSpace: 'pre-line',
            },
            ".left": {
                borderRadius: radius,
                //backgroundColor: palette.info.light,
                backgroundColor: "#004940",
                color: palette.info.contrastText,
            },
            ".right": {
                borderRadius: radius,
                //backgroundColor: palette.primary.main,
                backgroundColor: "#015384",
                color: palette.primary.contrastText,
            },
            ".center": {
                fontStyle: "italic",
            },
            ".leftCard": {
                float: "left",
            },
            ".rightCard": {
                float: "right",
            }
        })
    }}
/>;


const ChatMsg = (props) => {
    const {
        GridContainerProps,
        GridItemProps,
        AvatarProps,
        getTypographyProps,
    } = props;

    const {
        canClickAvatar,
        side,
        messageObj,
    } = props;

    const {
        id,
        //sender_id, 
        avatar_url,
        content,
        message_type,
        //parent_message_id, 
        created_at,
        message_attachments,
    } = messageObj;

    moment.locale("vi")
    const convertedTime = moment(created_at).calendar();
    const [openProfile, setOpenProfile] = useState(false);
    const [openLargerImage, setOpenLargerImage] = useState(false);

    return (
        <Fragment>
            {inputGlobalStyles}
            <Grid
                container
                spacing={2}
                justifyContent={side === 'right' ? 'flex-end' : 'flex-start'}
                {...GridContainerProps}
            >
                {side === 'left' && (
                    <Grid item {...GridItemProps}>
                        <Avatar
                            src={avatar_url}
                            className={"avatar"}
                            {...AvatarProps}
                            {...(canClickAvatar && { onClick: () => setOpenProfile(true) })}
                        />

                        <Dialog
                            open={openProfile}
                            onClose={() => setOpenProfile(false)}
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                        >
                            {/*TODO: Add profile preview */}
                            <img src={avatar_url} alt="profile-dialog" />
                        </Dialog>
                    </Grid>
                )}
                <Grid item xs={8}>
                    {(() => {
                        const TypographyProps = getTypographyProps(content, id, props);
                        if (message_type === MessageTypes.IMAGE) {
                            if (content === '') {
                                return <div key={id} className={`${side}Row`}>
                                    <Card
                                        style={{
                                            borderRadius: 20,
                                            maxWidth: 400,
                                        }}
                                        className={cx(`${side}Card`)}
                                    >
                                        <Tooltip placement="left" title={convertedTime}>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    src={message_attachments}
                                                    alt="green iguana"
                                                    onClick={() => setOpenLargerImage(true)}
                                                />
                                            </CardActionArea>
                                        </Tooltip>

                                        <Dialog
                                            open={openLargerImage}
                                            onClose={() => setOpenLargerImage(false)}
                                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        >
                                            <img
                                                style={{ width: 'auto', height: '80%' }}
                                                src={message_attachments}
                                                alt="dialog"
                                            />
                                        </Dialog>
                                    </Card>
                                </div>
                            }
                            return (
                                <div key={id} className={`${side}Row`}>
                                    <Card
                                        style={{
                                            borderRadius: 20,
                                            maxWidth: 400,
                                        }}
                                        className={cx(`${side}Card`)}
                                    >
                                        <Tooltip placement="left" title={convertedTime}>
                                            <CardActionArea>
                                                <CardContent
                                                    className={cx(`${side}`)}
                                                    sx={{
                                                        borderRadius: 0,
                                                        padding: 0,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        className={cx("msg",
                                                            TypographyProps.className
                                                        )}
                                                        style={{
                                                            // fontFamily: "cursive",
                                                        }}
                                                    >
                                                        {content}
                                                    </Typography>
                                                </CardContent>
                                                <CardMedia
                                                    component="img"
                                                    src={message_attachments}
                                                    alt="green iguana"
                                                    onClick={() => setOpenLargerImage(true)}
                                                />
                                            </CardActionArea>
                                        </Tooltip>
                                        <Dialog
                                            open={openLargerImage}
                                            onClose={() => setOpenLargerImage(false)}
                                            //hasCloseButton
                                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        >
                                            <img
                                                style={{ width: 'auto', height: '80%', background: "transparent" }}
                                                src={message_attachments}
                                                alt="dialog"
                                            />
                                        </Dialog>
                                    </Card>
                                </div>
                            )
                        }
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={id} className={`${side}Row`}>
                                <Tooltip placement="left" title={convertedTime}>
                                    <Typography
                                        align={'left'}
                                        {...TypographyProps}
                                        className={cx("msg", `${side}`,
                                            TypographyProps.className
                                        )}
                                        style={{
                                            // fontFamily: "cursive",
                                        }}
                                    >
                                        {content}
                                    </Typography>
                                </Tooltip>
                            </div>
                        );
                    })()}
                </Grid>
            </Grid>
        </Fragment>
    );
};

ChatMsg.propTypes = {
    canClickAvatar: PropTypes.bool,
    messageType: PropTypes.string,
    side: PropTypes.oneOf(['left', 'right', 'center']),
    GridContainerProps: PropTypes.shape({}),
    GridItemProps: PropTypes.shape({}),
    AvatarProps: PropTypes.shape({}),
    getTypographyProps: PropTypes.func,
};
ChatMsg.defaultProps = {
    side: 'left',
    GridContainerProps: {},
    GridItemProps: {},
    AvatarProps: {},
    getTypographyProps: () => ({}),
};

export default ChatMsg;
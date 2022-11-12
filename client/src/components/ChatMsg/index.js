import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

import withStyles from '@material-ui/core/styles/withStyles';
import defaultChatMsgStyles from './defaultChatMsgStyles';
import { MessageTypes } from '../../types/db.type';

const ChatMsg = withStyles(defaultChatMsgStyles, { name: 'ChatMsg' })(props => {
    const {
        classes,
        avatar,
        messageObj,
        side,
        GridContainerProps,
        GridItemProps,
        AvatarProps,
        getTypographyProps,
    } = props;


    const {
        id,
        //sender_id, 
        content,
        message_type,
        //parent_message_id, 
        //created_at, 
        message_attachments,
    } = messageObj;

    return (
        <Grid
            container
            spacing={2}
            justifyContent={side === 'right' ? 'flex-end' : 'flex-start'}
            {...GridContainerProps}
        >
            {side === 'left' && (
                <Grid item {...GridItemProps}>
                    <Avatar
                        src={avatar}
                        {...AvatarProps}
                        className={cx(classes.avatar, AvatarProps.className)}
                    />
                </Grid>
            )}
            <Grid item xs={8}>
                {(() => {
                    const TypographyProps = getTypographyProps(content, id, props);
                    if (message_type === MessageTypes.IMAGE) {
                        if (content === '') {
                            return <div key={id} className={classes[`${side}Row`]}>
                                <Card
                                    style={{
                                        borderRadius: 20,
                                        maxWidth: 400,
                                    }}
                                    className={cx(
                                        classes[`${side}Card`]
                                    )}
                                >
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            src={message_attachments}
                                            alt="green iguana"
                                        />
                                    </CardActionArea>
                                </Card>
                            </div>
                        }
                        return (
                            <div key={id} className={classes[`${side}Row`]}>
                                <Card
                                    style={{
                                        borderRadius: 20,
                                        maxWidth: 400,
                                    }}
                                    className={cx(
                                        classes[`${side}Card`]
                                    )}
                                >
                                    <CardActionArea>
                                        <CardContent
                                            className={cx(
                                                classes[side],
                                                classes[`${side}Caption`]
                                            )}
                                        >
                                            <Typography
                                                variant="body2"
                                                className={cx(
                                                    classes.msg,
                                                    TypographyProps.className
                                                )}
                                            >
                                                <pre style={{ fontFamily: 'inherit', margin: 0 }}>
                                                    {content}
                                                </pre>
                                            </Typography>
                                        </CardContent>
                                        <CardMedia
                                            component="img"
                                            src={message_attachments}
                                            alt="green iguana"
                                        />
                                    </CardActionArea>
                                </Card>
                            </div>
                        )
                    }
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={id} className={classes[`${side}Row`]}>
                            <Typography
                                align={'left'}
                                {...TypographyProps}
                                className={cx(
                                    classes.msg,
                                    classes[side],
                                    TypographyProps.className
                                )}
                            >
                                <pre style={{ fontFamily: 'inherit', margin: 0 }}>
                                    {content}
                                </pre>
                            </Typography>
                        </div>
                    );
                })()}
            </Grid>
        </Grid>
    );
});

ChatMsg.propTypes = {
    avatar: PropTypes.string,
    messageType: PropTypes.string,
    side: PropTypes.oneOf(['left', 'right', 'center']),
    GridContainerProps: PropTypes.shape({}),
    GridItemProps: PropTypes.shape({}),
    AvatarProps: PropTypes.shape({}),
    getTypographyProps: PropTypes.func,
};
ChatMsg.defaultProps = {
    avatar: '',
    side: 'left',
    GridContainerProps: {},
    GridItemProps: {},
    AvatarProps: {},
    getTypographyProps: () => ({}),
};

export default ChatMsg;
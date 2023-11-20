/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-max-props-per-line */
import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import Microphone01 from '@untitled-ui/icons-react/build/esm/Microphone01';
import Send01Icon from '@untitled-ui/icons-react/build/esm/Send01';
import {
    Avatar,
    Box,
    IconButton,
    OutlinedInput,
    Stack,
    SvgIcon,
    Tooltip,
} from '@mui/material';

export const ChatMessageAdd = (props) => {
    const { disabled, onSend, ...other } = props;
    const fileInputRef = useRef(null);
    const [body, setBody] = useState('');

    const streamRef = useRef(null);

    const [isRecording, setIsRecording] = useState(false);
    const mrRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [audioBlob, setAudioBlob] = useState(null);

    const handleAttach = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const startRecording = async () => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mrRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.start();
        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
    };

    const stopRecording = () => {
        if (!mrRef.current) return;
        mrRef.current.stop();
        mrRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, {
                type: 'audio/mpeg',
            });
            setAudioBlob(audioBlob);
            sendAudioToBackend(audioBlob);
        };
        setIsRecording(false);
    };

    const sendAudioToBackend = useCallback((audioBlob) => {
        if (audioBlob) {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.mp3');

            // Replace with your backend API endpoint
            fetch('http://192.168.1.2:3001/v1/chats/audioToText', {
                method: 'POST',
                body: formData,
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log('Audio sent successfully', data);
                })
                .catch((error) => {
                    console.error('Error sending audio', error);
                });
        }
    }, []);

    const handleChange = useCallback((event) => {
        setBody(event.target.value);
    }, []);

    const handleSend = useCallback(() => {
        if (!body) {
            return;
        }

        onSend?.(body);
        setBody('');
    }, [body, onSend]);

    const handleKeyUp = useCallback(
        (event) => {
            if (event.code === 'Enter') {
                handleSend();
            }
        },
        [handleSend],
    );

    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{
                px: 3,
                py: 1,
            }}
            {...other}
        >
            <OutlinedInput
                disabled={disabled}
                fullWidth
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                placeholder="Leave a message"
                size="small"
                value={body}
                multiline={isRecording}
                rows={4}
            />
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    m: -2,
                    ml: 2,
                }}
            >
                <Tooltip title="Send">
                    <Box>
                        <IconButton
                            color="primary"
                            disabled={!body || disabled}
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            }}
                            onClick={handleSend}
                        >
                            <SvgIcon>
                                <Send01Icon />
                            </SvgIcon>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Send audio">
                    <Box
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'inline-flex',
                            },
                            m: 1,
                        }}
                    >
                        <IconButton
                            disabled={disabled}
                            edge="end"
                            onClick={
                                isRecording ? stopRecording : startRecording
                            }
                            sx={{ color: isRecording ? 'red' : 'inherit' }}
                        >
                            <SvgIcon>
                                <Microphone01 />
                            </SvgIcon>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Attach file">
                    <Box
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'inline-flex',
                            },
                            m: 1,
                        }}
                    >
                        <IconButton
                            disabled={disabled}
                            edge="end"
                            onClick={handleAttach}
                        >
                            <SvgIcon>
                                <Attachment01Icon />
                            </SvgIcon>
                        </IconButton>
                    </Box>
                </Tooltip>
            </Box>
            <input hidden ref={fileInputRef} type="file" />
        </Stack>
    );
};

ChatMessageAdd.propTypes = {
    disabled: PropTypes.bool,
    onSend: PropTypes.func,
};

ChatMessageAdd.defaultProps = {
    disabled: false,
};

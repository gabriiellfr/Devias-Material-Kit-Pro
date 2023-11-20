import { createSlice } from '@reduxjs/toolkit';
import { objFromArray } from '../utils/obj-from-array';

const initialState = {
    contacts: [],
    agents: [],
};

const reducers = {
    addContact(state, action) {
        const contacts = action.payload;

        state.contacts.byId = objFromArray(contacts);
        state.contacts = Object.keys(state.contacts.byId);
    },
    getContacts(state, action) {
        const contacts = action.payload;

        state.contacts.byId = objFromArray(contacts);
        state.contacts = Object.keys(state.contacts.byId);
    },
    getThreads(state, action) {
        const threads = action.payload;

        state.threads.byId = objFromArray(threads);
        state.threads.allIds = Object.keys(state.threads.byId);
    },
    getThread(state, action) {
        const thread = action.payload;

        if (thread) {
            state.threads.byId[thread.id] = thread;

            if (!state.threads.allIds.includes(thread.id))
                state.threads.allIds.unshift(thread.id);
        }
    },
    markThreadAsSeen(state, action) {
        const threadId = action.payload;
        const thread = state.threads.byId[threadId];

        if (thread) thread.unreadCount = 0;
    },
    setCurrentThread(state, action) {
        state.currentThreadId = action.payload;
    },
    addMessage(state, action) {
        const { threadId, message } = action.payload;
        const thread = state.threads.byId[threadId];

        if (thread) thread.messages.push(message);
    },
};

export const slice = createSlice({
    name: 'chat',
    initialState,
    reducers,
});

export const { reducer } = slice;

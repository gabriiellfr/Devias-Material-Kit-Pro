import { createResourceId } from '../../utils/create-resource-id';
import { httpService } from '../http';
import { agentsApi } from '../agents';

const expandChat = async (user, chat) => {
    const participants = [mapUserToParticipant(user)];
    const otherParticipants = await Promise.all(
        chat.participantIds
            .filter((member) => member !== user.id)
            .map((member) => fetchParticipant(user, member)),
    );
    return {
        ...chat,
        participants: [...participants, ...otherParticipants],
    };
};

const expandData = async (user, data) => {
    if (Array.isArray(data)) {
        return Promise.all(data.map((chat) => expandChat(user, chat)));
    } else if (data) {
        return expandChat(user, data);
    }
};

const mapUserToParticipant = (user) => ({
    id: user.id,
    avatar: user.avatar,
    name: user.name,
});

const fetchParticipant = async (user, memberId) => {
    const chatMember = await agentsApi.getAgentById({
        user,
        agentId: memberId,
    });
    return mapUserToParticipant(chatMember);
};

const createHttpOptions = (path, userId, data = {}) => ({
    path,
    method: 'POST',
    useToken: true,
    data: { userId, ...data },
});

class ChatApi {
    async getThreads({ user }) {
        try {
            const httpOptions = createHttpOptions('chats/getAllChats', user.id);
            const chatsData = await httpService(httpOptions);

            return expandData(user, chatsData);
        } catch (error) {
            throw new Error(`Error fetching chats: ${error}`);
        }
    }

    async getThread({ user, threadKey }) {
        try {
            const httpOptions = createHttpOptions(
                'chats/getChatById',
                user.id,
                { chatId: threadKey },
            );
            const chatData = await httpService(httpOptions);
            return expandData(user, chatData);
        } catch (error) {
            throw new Error(`Error fetching chat: ${error}`);
        }
    }

    async getParticipants({ user, threadKey }) {
        try {
            console.log('participants user', user, 'threadKey', threadKey);

            let thread = await this.getThread({ user, threadKey });
            console.log('participants thread', thread);

            let participants = [mapUserToParticipant(user)];

            console.log('participants participants', participants);

            const otherParticipants = await Promise.all(
                thread.participantIds
                    .filter((member) => member !== user.id)
                    .map((member) => fetchParticipant(user, member)),
            );

            participants = [...participants, ...otherParticipants];
            return participants;
        } catch (err) {
            throw new Error(`Error getting participants: ${err}`);
        }
    }

    async addMessage({ user, threadId, recipientIds, body }) {
        try {
            let thread;

            if (threadId) {
                const httpOptions = createHttpOptions(
                    'chats/getChatById',
                    user.id,
                    { chatId: threadId },
                );
                thread = await httpService(httpOptions);
            }

            if (!thread) {
                const participantIds = [user.id, ...(recipientIds || [])];
                thread = {
                    messages: [],
                    participantIds,
                    type: participantIds.length === 2 ? 'ONE_TO_ONE' : 'GROUP',
                    createdBy: user.id,
                };

                const createChatOptions = createHttpOptions(
                    'chats/createChat',
                    user.id,
                    { chatData: thread },
                );
                thread = await httpService(createChatOptions);
            }

            const message = {
                id: createResourceId(),
                attachments: [],
                body,
                contentType: 'text',
                createdAt: new Date().toISOString(),
                authorId: user.id,
            };

            const saveMessageOptions = createHttpOptions(
                'chats/saveMessage',
                user.id,
                { chatId: thread.id, messageData: message },
            );
            await httpService(saveMessageOptions);

            return { threadId: thread.id, message };
        } catch (err) {
            throw new Error(`Error adding message: ${err}`);
        }
    }

    async markThreadAsSeen({ threadId }) {
        try {
            // Assuming an HTTP request is needed to mark the thread as seen
            /* const httpOptions = createHttpOptions('chats/markAsSeen', user.id, {
                threadId,
            });
            await httpService(httpOptions); */
            return true;
        } catch (err) {
            throw new Error(`Error marking thread as seen: ${err}`);
        }
    }
}

export const chatApi = new ChatApi();

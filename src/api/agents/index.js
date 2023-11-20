import { httpService } from '../http';

const createHttpOptions = (path, userId, data = {}) => {
    return {
        path,
        method: 'POST',
        useToken: true,
        data: { userId, ...data },
    };
};

class AgentsApi {
    async createAgent({ user, agentData }) {
        if (!user || !agentData)
            throw new Error('User or agent data is missing');

        try {
            const httpOptions = createHttpOptions(
                'agents/createAgent',
                user.id,
                {
                    agentData,
                },
            );
            return await httpService(httpOptions);
        } catch (error) {
            throw new Error(`Error creating agent: ${error}`);
        }
    }

    async getMyAgents({ user }) {
        if (!user) throw new Error('User not found');

        try {
            const httpOptions = createHttpOptions(
                'agents/getMyAgents',
                user.id,
            );
            const agentsData = await httpService(httpOptions);
            return { agentsData, count: agentsData.length };
        } catch (error) {
            throw new Error(`Error fetching my agents: ${error}`);
        }
    }

    async getAgentById({ user, agentId }) {
        if (!user || !agentId) throw new Error('User or agent ID not found');

        try {
            const httpOptions = createHttpOptions(
                'agents/getAgentById',
                user.id,
                {
                    agentId,
                },
            );
            return await httpService(httpOptions);
        } catch (error) {
            throw new Error(`Error fetching agent by ID: ${error}`);
        }
    }

    async updateAgentById({ user, agentData }) {
        if (!user || !agentData)
            throw new Error('User or agent data not found');

        try {
            const httpOptions = this.createHttpOptions(
                'agents/updateAgentById',
                user.id,
                { agentData },
            );
            return await httpService(httpOptions);
        } catch (error) {
            throw new Error(`Error updating agent: ${error}`);
        }
    }

    async getAgentsCopyAllowed({ user }) {
        if (!user) throw new Error('User not found');

        try {
            const httpOptions = this.createHttpOptions(
                'agents/getAgentsCopyAllowed',
                user.id,
            );
            const agentsData = await httpService(httpOptions);
            return { agentsData, count: agentsData.length };
        } catch (error) {
            throw new Error(
                `Error fetching agents with copy allowed: ${error}`,
            );
        }
    }

    async getAgentsByName({ user, name }) {
        if (!user) throw new Error('User not found');

        try {
            const httpOptions = this.createHttpOptions(
                'agents/getAgentsByName',
                user.id,
                { name },
            );
            return await httpService(httpOptions);
        } catch (error) {
            throw new Error(`Error fetching agents by name: ${error}`);
        }
    }
}

export const agentsApi = new AgentsApi();

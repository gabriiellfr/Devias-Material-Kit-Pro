import { useAuth } from '../../hooks/use-auth';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { deepCopy } from '../../utils/deep-copy';
import { customer, customers, emails, invoices, logs } from './data';

const STORAGE_KEY = 'accessToken';

class CustomersApi {
    async getCustomers(userId) {
        return new Promise(async (resolve, reject) => {
            const storageItem = globalThis.localStorage.getItem(STORAGE_KEY);
            if (!storageItem) {
                reject('No token found');
                return;
            }

            if (!userId) return;

            const { tokens } = JSON.parse(storageItem);

            try {
                const response = await fetch(
                    `http://192.168.1.2:3001/v1/agents/getAllAgents/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokens.access.token}`,
                        },
                    },
                );

                const customersData = await response.json();
                let count = customersData.length;

                // Resolve the promise with the data
                resolve({ customersData, count });
            } catch (error) {
                console.error('Error fetching customers:', error);
                // Reject the promise on error
                reject(error);
            }
        });
    }

    async getAgentsCopy(userId) {
        return new Promise(async (resolve, reject) => {
            const storageItem = globalThis.localStorage.getItem(STORAGE_KEY);
            if (!storageItem) {
                reject('No token found');
                return;
            }

            if (!userId) return;

            const { tokens } = JSON.parse(storageItem);

            try {
                const response = await fetch(
                    `http://192.168.1.2:3001/v1/agents/getAgentsCopy/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokens.access.token}`,
                        },
                    },
                );

                const customersData = await response.json();
                let count = customersData.length;

                // Resolve the promise with the data
                resolve({ customersData, count });
            } catch (error) {
                console.error('Error fetching customers:', error);
                // Reject the promise on error
                reject(error);
            }
        });
    }

    getCustomer(agentId, token) {
        return new Promise(async (resolve, reject) => {
            const storageItem = globalThis.localStorage.getItem(STORAGE_KEY);
            if (!storageItem && !token) {
                reject('No token found');
                return;
            }

            if (!agentId) return;

            const { tokens } = JSON.parse(storageItem || token);

            try {
                const response = await fetch(
                    `http://192.168.1.2:3001/v1/agents/getAgentById/${agentId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokens.access.token}`,
                        },
                    },
                ).catch((err) => {
                    console.log(err, 'err');
                });

                const customerData = await response.json();

                // Resolve the promise with the data
                resolve(customerData);
            } catch (error) {
                console.error('Error fetching customers:', error);
                // Reject the promise on error
                reject(error);
            }
        });
    }

    updateCustomer(agent) {
        return new Promise(async (resolve, reject) => {
            const storageItem = globalThis.localStorage.getItem(STORAGE_KEY);
            if (!storageItem) {
                reject('No token found');
                return;
            }

            if (!agent) return;

            const { tokens } = JSON.parse(storageItem);

            try {
                const response = await fetch(
                    `http://192.168.1.2:3001/v1/agents/updateAgentById/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokens.access.token}`,
                        },
                        body: JSON.stringify(agent),
                    },
                ).catch((err) => {
                    console.log(err, 'err');
                });

                // Resolve the promise with the data
                resolve(response);
            } catch (error) {
                console.error('Error updating customers:', error);
                // Reject the promise on error
                reject(error);
            }
        });
    }

    createCostumer(agent) {
        return new Promise(async (resolve, reject) => {
            const storageItem = globalThis.localStorage.getItem(STORAGE_KEY);
            if (!storageItem) {
                reject('No token found');
                return;
            }

            if (!agent) return;

            const { tokens } = JSON.parse(storageItem);

            try {
                const response = await fetch(
                    `http://192.168.1.2:3001/v1/agents/createAgent/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${tokens.access.token}`,
                        },
                        body: JSON.stringify(agent),
                    },
                ).catch((err) => {
                    console.log(err, 'err');
                });

                // Resolve the promise with the data
                resolve(response);
            } catch (error) {
                console.error('Error updating customers:', error);
                // Reject the promise on error
                reject(error);
            }
        });
    }

    getEmails(request) {
        return Promise.resolve(deepCopy(emails));
    }

    getInvoices(request) {
        return Promise.resolve(deepCopy(invoices));
    }

    getLogs(request) {
        return Promise.resolve(deepCopy(logs));
    }
}

export const customersApi = new CustomersApi();

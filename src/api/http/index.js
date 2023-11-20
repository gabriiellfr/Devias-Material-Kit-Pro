const STORAGE_KEY = 'accessToken';

const setSessionToken = async (newData) => {
    const sessionToken = await JSON.parse(
        globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)),
    );

    return sessionToken || {};
};

const getSessionToken = async () => {
    const sessionToken = await JSON.parse(
        globalThis.localStorage.getItem(STORAGE_KEY),
    );

    return sessionToken || {};
};

export const httpService = ({ path, method, useToken = true, data = {} }) => {
    console.log('%c@@@@@CALLING httpService@@@@@@@', 'color:green');
    console.log({ path, method, useToken, data });

    return new Promise(async (resolve, reject) => {
        if (!path || !method) return;

        const { tokens } = await getSessionToken();

        if (useToken && !tokens) return;

        const fetchPath = `http://192.168.1.2:3001/v1/${path}`;
        const fetchBody = method === 'POST' ? JSON.stringify(data) : '';
        const fetchOptions = useToken
            ? {
                  method: method,
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${tokens.access.token}`,
                  },
                  body: fetchBody,
              }
            : {
                  method: method,
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: fetchBody,
              };

        try {
            await fetch(fetchPath, fetchOptions)
                .then(async (response) => {
                    if (!response.ok) {
                        response = await response.json();
                        throw new Error(response.message);
                    } else if (response.status !== 204) {
                        response = await response.json();

                        return resolve(response);
                    }
                })
                .then((data) => {
                    return resolve(data);
                })
                .catch((err) => {
                    return reject(err);
                });
        } catch (error) {
            console.error(`Error fetching ${path}: `, error);
            return reject(error);
        }
    });
};

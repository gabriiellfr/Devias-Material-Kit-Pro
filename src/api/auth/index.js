import { httpService } from '../http';

class AuthApi {
    async signIn(request) {
        const { email, password } = request;

        const httpOptions = {
            path: 'auth/login',
            method: 'POST',
            useToken: false,
            data: { email, password },
        };

        try {
            return await httpService(httpOptions);
        } catch (err) {
            throw new Error(`Error signing in: ${err.message}`);
        }
    }

    async signUp(request) {
        const { email, name, password } = request;

        const httpOptions = {
            path: 'auth/register',
            method: 'POST',
            useToken: false,
            data: { email, name, password },
        };

        try {
            return await httpService(httpOptions);
        } catch (err) {
            throw new Error(`Error signing up: ${err.message}`);
        }
    }
}

export const authApi = new AuthApi();

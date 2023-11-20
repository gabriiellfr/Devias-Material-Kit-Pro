/* eslint-disable no-bitwise */
export const JWT_SECRET = 'NOUaVdSqVim1RwZYFVSST3BlbkFJpTqkolg8a8zPjbImrSQ4';

export const verify = (token, privateKey) => {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    const payload = JSON.parse(atob(encodedPayload));
    const now = Math.floor(Date.now() / 1000); // Current time in seconds

    // Check for token expiration
    if (payload.exp && now >= payload.exp) {
        throw new Error('Expired token');
    }

    // Simulated signature verification (not secure)
    const verifiedSignature = btoa(
        Array.from(encodedPayload)
            .map((char, index) =>
                String.fromCharCode(
                    char.charCodeAt(0) ^
                        privateKey.charCodeAt(index % privateKey.length),
                ),
            )
            .join(''),
    );

    if (verifiedSignature !== encodedSignature) {
        throw new Error('Invalid signature');
    }

    return payload;
};

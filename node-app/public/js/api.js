import { showMessage } from './ui.js';

export async function apiCall(url, options = {}) {
    try {
        const defaultHeaders = { 'Content-Type': 'application/json' };
        const config = {
            method: options.method || 'GET',
            headers: { ...defaultHeaders, ...options.headers },
            body: options.body ? JSON.stringify(options.body) : null
        };

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Erreur inattendue');
        return data;
    } catch (error) {
        showMessage(error.message, 'error');
        throw error;
    }
}
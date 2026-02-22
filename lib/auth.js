/**
 * Módulo de Autenticação Ninsaúde
 * Gerencia login automático e renovação de tokens
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.NINSAUDE_API_URL || 'https://api.ninsaude.com/v1';
const ACCOUNT = process.env.NINSAUDE_ACCOUNT;
const USERNAME = process.env.NINSAUDE_USERNAME;
const PASSWORD = process.env.NINSAUDE_PASSWORD;

let currentToken = null;
let tokenExpiration = null;

/**
 * Faz login e obtém um novo token de acesso
 */
async function login() {
    try {
        console.log('🔐 Fazendo login no Ninsaúde...');

        if (!ACCOUNT || !USERNAME || !PASSWORD) {
            throw new Error('Credenciais não configuradas no .env');
        }

        const response = await axios.post(`${API_URL}/auth/login`, {
            conta: ACCOUNT,
            username: USERNAME,
            password: PASSWORD
        });

        if (response.data && response.data.access_token) {
            currentToken = response.data.access_token;
            // Token expira em 900 segundos (15 minutos)
            tokenExpiration = Date.now() + (response.data.expires_in || 900) * 1000;

            console.log('✅ Login realizado com sucesso');
            console.log(`⏰ Token válido por ${Math.floor((response.data.expires_in || 900) / 60)} minutos\n`);

            return currentToken;
        } else {
            throw new Error('Resposta de login inválida');
        }
    } catch (error) {
        console.error('❌ Erro no login:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Obtém um token válido, fazendo login se necessário
 */
async function getToken() {
    // Se não tem token ou expirou, faz login
    if (!currentToken || !tokenExpiration || Date.now() >= tokenExpiration - 60000) {
        return await login();
    }

    return currentToken;
}

/**
 * Cria um client axios autenticado
 */
async function createAuthenticatedClient() {
    const token = await getToken();

    return axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

/**
 * Executa uma requisição autenticada
 */
async function authRequest(method, endpoint, data = null, params = null) {
    try {
        const token = await getToken();

        const config = {
            method,
            url: `${API_URL}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        if (data) config.data = data;
        if (params) config.params = params;

        const response = await axios(config);
        return response.data;
    } catch (error) {
        // Se erro 401, tenta renovar token e repetir
        if (error.response?.status === 401) {
            console.log('⚠️  Token expirado, renovando...');
            currentToken = null;
            const newToken = await getToken();

            const config = {
                method,
                url: `${API_URL}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${newToken}`,
                    'Content-Type': 'application/json'
                }
            };

            if (data) config.data = data;
            if (params) config.params = params;

            const response = await axios(config);
            return response.data;
        }
        throw error;
    }
}

module.exports = {
    login,
    getToken,
    createAuthenticatedClient,
    authRequest
};

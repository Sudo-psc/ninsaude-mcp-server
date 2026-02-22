#!/usr/bin/env node

/**
 * Script para capturar e testar token de acesso Ninsaúde
 * Uso: node capture-token.js
 */

const readline = require('readline');
const axios = require('axios');
const fs = require('fs');

const API_URL = 'https://api.ninsaude.com/v1';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function testarToken(token) {
    try {
        console.log('\n🔍 Testando token...');
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Token válido!');
        console.log('\n👤 Informações do usuário:');
        console.log(`   Nome: ${response.data.data?.nome || 'N/A'}`);
        console.log(`   Email: ${response.data.data?.email || 'N/A'}`);
        console.log(`   ID: ${response.data.data?.id || 'N/A'}\n`);
        return true;
    } catch (error) {
        console.log('❌ Token inválido ou expirado');
        console.log(`   Erro: ${error.response?.data?.error?.[0]?.message || error.message}\n`);
        return false;
    }
}

async function salvarToken(refreshToken) {
    const envContent = `NINSAUDE_API_URL=https://api.ninsaude.com/v1
NINSAUDE_REFRESH_TOKEN=${refreshToken}
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Token salvo no arquivo .env\n');
}

async function main() {
    console.log('\n🔐 CAPTURADOR DE TOKEN NINSAÚDE\n');
    console.log('═'.repeat(60) + '\n');

    console.log('📋 INSTRUÇÕES:');
    console.log('1. Acesse o Ninsaúde Clinic (https://clinic.ninsaude.com)');
    console.log('2. Faça login na sua conta');
    console.log('3. Vá em Configurações → API ou Integrações');
    console.log('4. Gere um novo token (ou copie o existente)');
    console.log('5. Cole o token aqui\n');
    console.log('═'.repeat(60) + '\n');

    const accessToken = await question('Cole o ACCESS TOKEN aqui: ');

    if (!accessToken || accessToken.trim().length < 10) {
        console.log('\n❌ Token inválido. Tente novamente.\n');
        rl.close();
        return;
    }

    const tokenValido = await testarToken(accessToken.trim());

    if (tokenValido) {
        const salvar = await question('Deseja salvar como REFRESH_TOKEN no .env? (s/n): ');

        if (salvar.toLowerCase() === 's' || salvar.toLowerCase() === 'sim') {
            await salvarToken(accessToken.trim());
            console.log('🎉 Pronto! Você pode agora executar:');
            console.log('   - node generate-billing-report.js');
            console.log('   - node create-britens-prescription-template.js');
            console.log('   - Qualquer outro script que precise de autenticação\n');
        }
    } else {
        console.log('💡 Dicas:');
        console.log('   - Verifique se copiou o token completo');
        console.log('   - Tokens expiram em 15 minutos');
        console.log('   - Gere um novo token se necessário\n');
    }

    rl.close();
}

main().catch(console.error);

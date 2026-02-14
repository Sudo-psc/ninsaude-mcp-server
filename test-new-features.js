#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

// Iniciar o servidor MCP
const server = spawn('node', ['dist/index.js'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
});

let jsonRpcId = 1;

// Função para enviar mensagens JSON-RPC
function sendRequest(method, params = {}) {
    const request = {
        jsonrpc: '2.0',
        id: jsonRpcId++,
        method,
        params
    };
    console.log('\n📤 Enviando:', JSON.stringify(request, null, 2));
    server.stdin.write(JSON.stringify(request) + '\n');
}

// Ler respostas do servidor
const rl = readline.createInterface({
    input: server.stdout,
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    try {
        const response = JSON.parse(line);
        console.log('\n📥 Recebido:', JSON.stringify(response, null, 2));
    } catch (e) {
        console.log('\n📄 Saída:', line);
    }
});

// Capturar erros
server.stderr.on('data', (data) => {
    console.log('\n⚠️  stderr:', data.toString());
});

server.on('error', (error) => {
    console.error('\n❌ Erro ao iniciar servidor:', error);
    process.exit(1);
});

server.on('close', (code) => {
    console.log(`\n🛑 Servidor encerrado com código: ${code}`);
    process.exit(code);
});

// Aguardar um pouco para o servidor iniciar
setTimeout(() => {
    console.log('\n🚀 Testando novas funcionalidades...\n');

    // 1. Inicializar
    sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
            name: 'test-client',
            version: '1.0.0'
        }
    });

    // 2. Listar modelos de documentos
    setTimeout(() => {
        console.log('\n📋 Listando modelos de documentos (língua pt-BR)...');
        sendRequest('tools/call', {
            name: 'list_document_modelos',
            arguments: {
                limit: 5,
                lingua: 'pt-BR'
            }
        });
    }, 1500);

    // 3. Relatório de fluxo de caixa
    setTimeout(() => {
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const dataInicial = primeiroDia.toISOString().split('T')[0];
        const dataFinal = hoje.toISOString().split('T')[0];

        console.log(`\n💰 Relatório de fluxo de caixa (${dataInicial} a ${dataFinal})...`);
        sendRequest('tools/call', {
            name: 'get_fluxo_caixa_report',
            arguments: {
                dataInicial,
                dataFinal,
                accountUnidade: 1
            }
        });
    }, 3000);

    // 4. Relatório de categorias de receitas
    setTimeout(() => {
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const dataInicial = primeiroDia.toISOString().split('T')[0];
        const dataFinal = hoje.toISOString().split('T')[0];

        console.log(`\n📊 Relatório de receitas por categoria (${dataInicial} a ${dataFinal})...`);
        sendRequest('tools/call', {
            name: 'get_categoria_receita_report',
            arguments: {
                dataInicial,
                dataFinal,
                accountUnidade: 1
            }
        });
    }, 4500);

    // 5. Relatório de categorias de despesas
    setTimeout(() => {
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const dataInicial = primeiroDia.toISOString().split('T')[0];
        const dataFinal = hoje.toISOString().split('T')[0];

        console.log(`\n📉 Relatório de despesas por categoria (${dataInicial} a ${dataFinal})...`);
        sendRequest('tools/call', {
            name: 'get_categoria_despesa_report',
            arguments: {
                dataInicial,
                dataFinal,
                accountUnidade: 1
            }
        });
    }, 6000);

    // Encerrar após os testes
    setTimeout(() => {
        console.log('\n✅ Testes concluídos!');
        console.log('\n📝 Funcionalidades testadas:');
        console.log('   1. Listagem de modelos de documentos');
        console.log('   2. Relatório de fluxo de caixa');
        console.log('   3. Relatório de receitas por categoria');
        console.log('   4. Relatório de despesas por categoria');
        server.stdin.end();
    }, 7500);
}, 500);

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
    console.log('\n🚀 Testando servidor MCP do Ninsaúde...\n');
    
    // 1. Inicializar
    sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
            name: 'test-client',
            version: '1.0.0'
        }
    });

    // 2. Listar ferramentas disponíveis
    setTimeout(() => {
        sendRequest('tools/list');
    }, 1000);

    // 3. Testar list_patients
    setTimeout(() => {
        sendRequest('tools/call', {
            name: 'list_patients',
            arguments: {
                limit: 5
            }
        });
    }, 2000);

    // 4. Testar list_appointments
    setTimeout(() => {
        const hoje = new Date().toISOString().split('T')[0];
        sendRequest('tools/call', {
            name: 'list_appointments',
            arguments: {
                dataInicial: hoje,
                dataFinal: hoje,
                limit: 5
            }
        });
    }, 4000);

    // Encerrar após os testes
    setTimeout(() => {
        console.log('\n✅ Testes concluídos!');
        server.stdin.end();
    }, 6000);
}, 500);

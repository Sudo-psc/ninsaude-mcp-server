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
    console.log('\n🚀 Testando operações com formulário ID 4...\n');

    // 1. Inicializar
    sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
            name: 'test-client',
            version: '1.0.0'
        }
    });

    // 2. Obter detalhes do formulário ID 4
    setTimeout(() => {
        console.log('\n🔍 Obtendo detalhes do formulário ID 4...');
        sendRequest('tools/call', {
            name: 'get_survey',
            arguments: {
                id: '4'
            }
        });
    }, 1500);

    // 3. Atualizar o formulário ID 4
    setTimeout(() => {
        console.log('\n✏️ Atualizando formulário ID 4...');
        sendRequest('tools/call', {
            name: 'update_survey',
            arguments: {
                id: '4',
                descricao: 'Teste MCP - Formulário ATUALIZADO com Sucesso!',
                ativo: 1
            }
        });
    }, 3000);

    // 4. Obter novamente para verificar atualização
    setTimeout(() => {
        console.log('\n🔍 Verificando atualização...');
        sendRequest('tools/call', {
            name: 'get_survey',
            arguments: {
                id: '4'
            }
        });
    }, 4500);

    // 5. Excluir o formulário
    setTimeout(() => {
        console.log('\n🗑️  Excluindo formulário ID 4...');
        sendRequest('tools/call', {
            name: 'delete_survey',
            arguments: {
                id: '4'
            }
        });
    }, 6000);

    // 6. Listar para confirmar exclusão
    setTimeout(() => {
        console.log('\n📄 Listando formulários para confirmar exclusão...');
        sendRequest('tools/call', {
            name: 'list_surveys',
            arguments: {
                limit: 5,
                ativo: 1
            }
        });
    }, 7500);

    // Encerrar após os testes
    setTimeout(() => {
        console.log('\n✅ Testes concluídos!');
        server.stdin.end();
    }, 9000);
}, 500);

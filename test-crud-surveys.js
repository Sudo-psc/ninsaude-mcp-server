#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

// Iniciar o servidor MCP
const server = spawn('node', ['dist/index.js'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
});

let jsonRpcId = 1;
let createdSurveyId = null;

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

        // Extrair ID do survey criado para usar nos próximos testes
        if (response.result && response.result.content && response.result.content[0]) {
            try {
                const content = JSON.parse(response.result.content[0].text);
                if (content.result && content.result.id && !createdSurveyId) {
                    createdSurveyId = content.result.id;
                    console.log(`\n✅ Survey criado com ID: ${createdSurveyId}`);
                }
            } catch (e) {
                // Não é um JSON válido, ignorar
            }
        }
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
    console.log('\n🚀 Testando CRUD completo de Formulários de Pesquisa...\n');

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
        console.log('\n📋 Listando ferramentas disponíveis...');
        sendRequest('tools/list');
    }, 1000);

    // 3. Listar formulários existentes
    setTimeout(() => {
        console.log('\n📄 Listando formulários existentes...');
        sendRequest('tools/call', {
            name: 'list_surveys',
            arguments: {
                limit: 5,
                ativo: 1
            }
        });
    }, 2000);

    // 4. Criar um novo formulário de teste
    setTimeout(() => {
        console.log('\n➕ Criando novo formulário de teste...');
        sendRequest('tools/call', {
            name: 'create_survey',
            arguments: {
                descricao: 'Teste MCP - Formulário de Teste Automatizado',
                ativo: 1
            }
        });
    }, 3500);

    // 5. Aguardar e atualizar o formulário criado
    setTimeout(() => {
        console.log('\n✏️ Atualizando formulário criado...');
        sendRequest('tools/call', {
            name: 'update_survey',
            arguments: {
                id: String(createdSurveyId || '999'),
                descricao: 'Teste MCP - Formulário Atualizado',
                ativo: 1
            }
        });
    }, 5500);

    // 6. Obter detalhes do formulário
    setTimeout(() => {
        console.log('\n🔍 Obtendo detalhes do formulário...');
        sendRequest('tools/call', {
            name: 'get_survey',
            arguments: {
                id: String(createdSurveyId || '999')
            }
        });
    }, 7000);

    // 7. Excluir o formulário de teste
    setTimeout(() => {
        console.log('\n🗑️  Excluindo formulário de teste...');
        sendRequest('tools/call', {
            name: 'delete_survey',
            arguments: {
                id: String(createdSurveyId || '999')
            }
        });
    }, 8500);

    // 8. Listar novamente para confirmar exclusão
    setTimeout(() => {
        console.log('\n📄 Listando formulários para confirmar exclusão...');
        sendRequest('tools/call', {
            name: 'list_surveys',
            arguments: {
                limit: 5,
                ativo: 1
            }
        });
    }, 10000);

    // Encerrar após os testes
    setTimeout(() => {
        console.log('\n✅ Testes CRUD concluídos!');
        server.stdin.end();
    }, 11500);
}, 500);

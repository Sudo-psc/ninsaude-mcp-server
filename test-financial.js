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
    console.log('\n🚀 Testando ferramentas financeiras...\n');

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
    }, 1500);

    // 3. Listar receitas (últimos 30 dias)
    setTimeout(() => {
        const hoje = new Date();
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(hoje.getDate() - 30);

        console.log('\n💰 Listando receitas dos últimos 30 dias...');
        sendRequest('tools/call', {
            name: 'list_receitas',
            arguments: {
                limit: 5,
                dataVencimentoInicial: trintaDiasAtras.toISOString().split('T')[0],
                dataVencimentoFinal: hoje.toISOString().split('T')[0]
            }
        });
    }, 3000);

    // 4. Listar despesas (últimos 30 dias)
    setTimeout(() => {
        const hoje = new Date();
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(hoje.getDate() - 30);

        console.log('\n💸 Listando despesas dos últimos 30 dias...');
        sendRequest('tools/call', {
            name: 'list_despesas',
            arguments: {
                limit: 5,
                dataVencimentoInicial: trintaDiasAtras.toISOString().split('T')[0],
                dataVencimentoFinal: hoje.toISOString().split('T')[0]
            }
        });
    }, 4500);

    // 5. Listar receitas sem filtros (usar padrão da API)
    setTimeout(() => {
        console.log('\n💵 Listando receitas recentes (padrão API)...');
        sendRequest('tools/call', {
            name: 'list_receitas',
            arguments: {
                limit: 3
            }
        });
    }, 6000);

    // 6. Listar despesas sem filtros (usar padrão da API)
    setTimeout(() => {
        console.log('\n💳 Listando despesas recentes (padrão API)...');
        sendRequest('tools/call', {
            name: 'list_despesas',
            arguments: {
                limit: 3
            }
        });
    }, 7500);

    // Encerrar após os testes
    setTimeout(() => {
        console.log('\n✅ Testes de listagem concluídos!');
        console.log('\n📝 Nota: Para testar criação de receitas/despesas, você precisará:');
        console.log('   - accountUnidade: ID da unidade de atendimento');
        console.log('   - conta: ID da conta bancária');
        console.log('   - categoria: ID da categoria financeira');
        console.log('   - tipoPagto: ID do tipo de pagamento');
        console.log('   Use a API do Ninsaúde ou interface web para obter esses IDs.');
        server.stdin.end();
    }, 9000);
}, 500);

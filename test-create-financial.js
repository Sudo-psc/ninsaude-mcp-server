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
    console.log('\n🚀 Testando criação de receitas e despesas...\n');
    console.log('📊 IDs usados (obtidos da listagem anterior):');
    console.log('  - accountUnidade: 1 (Clínica Saraiva Vision Oftalmologia)');
    console.log('  - conta: 1 (Caixinha) ou 3 (Inter)');
    console.log('  - categoria (receita): 4 (Recebimentos)');
    console.log('  - categoria (despesa): 3 (Outras despesas)');
    console.log('  - tipoPagto: 5 (Dinheiro), 7 (Pix)\n');

    // 1. Inicializar
    sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
            name: 'test-client',
            version: '1.0.0'
        }
    });

    // 2. Criar uma receita de teste (Recebimento)
    setTimeout(() => {
        const hoje = new Date().toISOString().split('T')[0];
        console.log('\n💰 Criando uma receita de teste (R$ 50,00)...');
        sendRequest('tools/call', {
            name: 'create_receita',
            arguments: {
                accountUnidade: 1,
                conta: 1, // Caixinha
                categoria: 4, // Recebimentos
                tipoPagto: 5, // Dinheiro
                dataVencto: hoje,
                dataEmissao: hoje,
                dataPagamento: hoje,
                valor: 50.00,
                valorTotal: 50.00,
                recibo: 2, // Imprimir em nome da clínica
                pago: 1, // Já pago
                observacao: 'Teste MCP - Receita teste automatizada'
            }
        });
    }, 1500);

    // 3. Listar receitas para confirmar criação
    setTimeout(() => {
        console.log('\n📋 Listando últimas 3 receitas para confirmar...');
        sendRequest('tools/call', {
            name: 'list_receitas',
            arguments: {
                limit: 3
            }
        });
    }, 3500);

    // 4. Criar uma despesa de teste (Pagamento)
    setTimeout(() => {
        const hoje = new Date().toISOString().split('T')[0];
        console.log('\n💸 Criando uma despesa de teste (R$ 30,00)...');
        sendRequest('tools/call', {
            name: 'create_despesa',
            arguments: {
                accountUnidade: 1,
                conta: 3, // Inter
                categoria: 3, // Outras despesas
                tipoPagto: 7, // Pix
                dataVencto: hoje,
                dataEmissao: hoje,
                dataPagamento: hoje,
                valor: 30.00,
                valorTotal: 30.00,
                pago: 1, // Já pago
                observacao: 'Teste MCP - Despesa teste automatizada'
            }
        });
    }, 5000);

    // 5. Listar despesas para confirmar criação
    setTimeout(() => {
        console.log('\n📋 Listando últimas 3 despesas para confirmar...');
        sendRequest('tools/call', {
            name: 'list_despesas',
            arguments: {
                limit: 3
            }
        });
    }, 6500);

    // Encerrar após os testes
    setTimeout(() => {
        console.log('\n✅ Testes de criação concluídos!');
        console.log('\n📝 Próximos passos:');
        console.log('   - Verificar no Ninsaúde se os registros foram criados');
        console.log('   - Se desejar, excluir as entradas de teste');
        console.log('   - Adaptar os IDs para seu ambiente de produção');
        server.stdin.end();
    }, 8000);
}, 500);

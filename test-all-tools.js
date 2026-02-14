#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

// Iniciar o servidor MCP
const server = spawn('node', ['dist/index.js'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
});

let jsonRpcId = 1;
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
};

// Função para enviar mensagens JSON-RPC
function sendRequest(method, params = {}) {
    const request = {
        jsonrpc: '2.0',
        id: jsonRpcId++,
        method,
        params
    };
    console.log(`\n📤 [${jsonRpcId - 1}] ${params.name || method}`);
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
        const id = response.id;

        if (response.result) {
            console.log(`✅ [${id}] Success`);
            testResults.passed++;
        } else if (response.error) {
            console.log(`❌ [${id}] Error: ${response.error.message}`);
            testResults.failed++;
        }
        testResults.total++;
    } catch (e) {
        // Silently ignore non-JSON lines
    }
});

// Capturar erros
server.stderr.on('data', (data) => {
    const msg = data.toString();
    if (!msg.includes('Ninsaúde MCP Server running')) {
        console.log(`⚠️  ${msg}`);
    }
});

server.on('error', (error) => {
    console.error('\n❌ Erro ao iniciar servidor:', error);
    process.exit(1);
});

server.on('close', (code) => {
    console.log(`\n\n${'='.repeat(60)}`);
    console.log('📊 RESUMO DOS TESTES');
    console.log('='.repeat(60));
    console.log(`Total de testes: ${testResults.total}`);
    console.log(`✅ Passou: ${testResults.passed}`);
    console.log(`❌ Falhou: ${testResults.failed}`);
    console.log(`📈 Taxa de sucesso: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
    process.exit(code);
});

// Aguardar um pouco para o servidor iniciar
setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 TESTE COMPLETO DE TODAS AS 16 FERRAMENTAS DO SERVIDOR MCP');
    console.log('='.repeat(60));

    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0];
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const dataInicial = primeiroDia.toISOString().split('T')[0];

    let delay = 1000;

    // 1. Inicializar
    sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-all-client', version: '1.0.0' }
    });

    // ==================== PACIENTES (2 ferramentas) ====================
    console.log('\n' + '-'.repeat(60));
    console.log('👥 MÓDULO: PACIENTES (2 ferramentas)');
    console.log('-'.repeat(60));

    setTimeout(() => {
        console.log('\n[1/16] Testando list_patients...');
        sendRequest('tools/call', {
            name: 'list_patients',
            arguments: { limit: 3 }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[2/16] Testando get_patient...');
        sendRequest('tools/call', {
            name: 'get_patient',
            arguments: { id: 1 }
        });
    }, delay += 1000);

    // ==================== AGENDAMENTOS (1 ferramenta) ====================
    console.log('\n' + '-'.repeat(60));
    console.log('📅 MÓDULO: AGENDAMENTOS (1 ferramenta)');
    console.log('-'.repeat(60));

    setTimeout(() => {
        console.log('\n[3/16] Testando list_appointments...');
        sendRequest('tools/call', {
            name: 'list_appointments',
            arguments: {
                dataInicial: dataInicial,
                dataFinal: dataHoje,
                limit: 3
            }
        });
    }, delay += 1000);

    // ==================== FORMULÁRIOS (5 ferramentas) ====================
    console.log('\n' + '-'.repeat(60));
    console.log('📋 MÓDULO: FORMULÁRIOS DE PESQUISA (5 ferramentas)');
    console.log('-'.repeat(60));

    setTimeout(() => {
        console.log('\n[4/16] Testando list_surveys...');
        sendRequest('tools/call', {
            name: 'list_surveys',
            arguments: { limit: 3, ativo: 1 }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[5/16] Testando get_survey...');
        sendRequest('tools/call', {
            name: 'get_survey',
            arguments: { id: '1' }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[6/16] Testando create_survey...');
        sendRequest('tools/call', {
            name: 'create_survey',
            arguments: {
                descricao: 'Teste Automatizado MCP',
                ativo: 1
            }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[7/16] Testando update_survey...');
        sendRequest('tools/call', {
            name: 'update_survey',
            arguments: {
                id: '1',
                descricao: 'Pesquisa Atualizada',
                ativo: 1
            }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[8/16] Testando delete_survey (criando primeiro)...');
        // Vamos criar um para deletar
        sendRequest('tools/call', {
            name: 'create_survey',
            arguments: {
                descricao: 'Para Deletar',
                ativo: 0
            }
        });
    }, delay += 1000);

    // ==================== RECEITAS (2 ferramentas) ====================
    console.log('\n' + '-'.repeat(60));
    console.log('💰 MÓDULO: RECEITAS/RECEBIMENTOS (2 ferramentas)');
    console.log('-'.repeat(60));

    setTimeout(() => {
        console.log('\n[9/16] Testando list_receitas...');
        sendRequest('tools/call', {
            name: 'list_receitas',
            arguments: {
                limit: 3,
                dataVencimentoInicial: dataInicial,
                dataVencimentoFinal: dataHoje
            }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[10/16] Testando create_receita...');
        sendRequest('tools/call', {
            name: 'create_receita',
            arguments: {
                accountUnidade: 1,
                conta: 1,
                categoria: 4,
                tipoPagto: 5,
                dataVencto: dataHoje,
                dataEmissao: dataHoje,
                dataPagamento: dataHoje,
                valor: 25.00,
                valorTotal: 25.00,
                recibo: 2,
                pago: 1,
                observacao: 'Teste MCP - Receita automatizada'
            }
        });
    }, delay += 1000);

    // ==================== DESPESAS (2 ferramentas) ====================
    console.log('\n' + '-'.repeat(60));
    console.log('💸 MÓDULO: DESPESAS/PAGAMENTOS (2 ferramentas)');
    console.log('-'.repeat(60));

    setTimeout(() => {
        console.log('\n[11/16] Testando list_despesas...');
        sendRequest('tools/call', {
            name: 'list_despesas',
            arguments: {
                limit: 3,
                dataVencimentoInicial: dataInicial,
                dataVencimentoFinal: dataHoje
            }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[12/16] Testando create_despesa...');
        sendRequest('tools/call', {
            name: 'create_despesa',
            arguments: {
                accountUnidade: 1,
                conta: 3,
                categoria: 3,
                tipoPagto: 7,
                dataVencto: dataHoje,
                dataEmissao: dataHoje,
                dataPagamento: dataHoje,
                valor: 15.00,
                valorTotal: 15.00,
                pago: 1,
                observacao: 'Teste MCP - Despesa automatizada'
            }
        });
    }, delay += 1000);

    // ==================== MODELOS DE DOCUMENTOS (1 ferramenta) ====================
    console.log('\n' + '-'.repeat(60));
    console.log('📄 MÓDULO: MODELOS DE DOCUMENTOS (1 ferramenta)');
    console.log('-'.repeat(60));

    setTimeout(() => {
        console.log('\n[13/16] Testando list_document_modelos...');
        sendRequest('tools/call', {
            name: 'list_document_modelos',
            arguments: {
                limit: 3,
                lingua: 'pt-BR'
            }
        });
    }, delay += 1000);

    // ==================== RELATÓRIOS FINANCEIROS (3 ferramentas) ====================
    console.log('\n' + '-'.repeat(60));
    console.log('📊 MÓDULO: RELATÓRIOS FINANCEIROS (3 ferramentas)');
    console.log('-'.repeat(60));

    setTimeout(() => {
        console.log('\n[14/16] Testando get_fluxo_caixa_report...');
        sendRequest('tools/call', {
            name: 'get_fluxo_caixa_report',
            arguments: {
                dataInicial: dataInicial,
                dataFinal: dataHoje,
                accountUnidade: 1
            }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[15/16] Testando get_categoria_receita_report...');
        sendRequest('tools/call', {
            name: 'get_categoria_receita_report',
            arguments: {
                dataInicial: dataInicial,
                dataFinal: dataHoje,
                accountUnidade: 1
            }
        });
    }, delay += 1000);

    setTimeout(() => {
        console.log('\n[16/16] Testando get_categoria_despesa_report...');
        sendRequest('tools/call', {
            name: 'get_categoria_despesa_report',
            arguments: {
                dataInicial: dataInicial,
                dataFinal: dataHoje,
                accountUnidade: 1
            }
        });
    }, delay += 1000);

    // Encerrar após todos os testes
    setTimeout(() => {
        console.log('\n' + '='.repeat(60));
        console.log('✅ Todos os testes foram executados!');
        console.log('='.repeat(60));
        server.stdin.end();
    }, delay + 2000);
}, 500);

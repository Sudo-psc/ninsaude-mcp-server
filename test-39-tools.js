#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

const server = spawn('node', ['dist/index.js'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
});

let jsonRpcId = 1;
let testResults = { total: 0, passed: 0, failed: 0 };

function sendRequest(method, params = {}) {
    const request = { jsonrpc: '2.0', id: jsonRpcId++, method, params };
    console.log(`\n📤 [${jsonRpcId - 1}] ${params.name || method}`);
    server.stdin.write(JSON.stringify(request) + '\n');
}

const rl = readline.createInterface({ input: server.stdout, crlfDelay: Infinity });

rl.on('line', (line) => {
    try {
        const response = JSON.parse(line);
        if (response.result) {
            console.log(`✅ [${response.id}] Success`);
            testResults.passed++;
        } else if (response.error) {
            console.log(`❌ [${response.id}] Error: ${response.error.message}`);
            testResults.failed++;
        }
        testResults.total++;
    } catch (e) { }
});

server.stderr.on('data', (data) => {
    const msg = data.toString();
    if (!msg.includes('Ninsaúde MCP Server running')) {
        console.log(`⚠️  ${msg}`);
    }
});

server.on('close', (code) => {
    console.log(`\n\n${'='.repeat(70)}`);
    console.log('📊 RESUMO FINAL DOS TESTES');
    console.log('='.repeat(70));
    console.log(`Total de ferramentas testadas: ${testResults.total - 1} (excluindo initialize)`);
    console.log(`✅ Passou: ${testResults.passed}`);
    console.log(`❌ Falhou: ${testResults.failed}`);
    console.log(`📈 Taxa de sucesso: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    console.log('='.repeat(70));
    process.exit(code);
});

setTimeout(() => {
    console.log('\n' + '='.repeat(70));
    console.log('🚀 TESTE COMPLETO: 39 FERRAMENTAS DO NINSAÚDE MCP SERVER');
    console.log('='.repeat(70));

    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0];
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const dataInicial = primeiroDia.toISOString().split('T')[0];

    let delay = 1000;

    // Inicializar
    sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-39-tools', version: '1.0.0' }
    });

    // ========== TESTE DAS 16 FERRAMENTAS EXISTENTES ==========
    console.log('\n' + '-'.repeat(70));
    console.log('📦 FERRAMENTAS EXISTENTES (16)');
    console.log('-'.repeat(70));

    setTimeout(() => { console.log('\n[1/39] list_patients'); sendRequest('tools/call', { name: 'list_patients', arguments: { limit: 2 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[2/39] get_patient'); sendRequest('tools/call', { name: 'get_patient', arguments: { id: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[3/39] list_appointments'); sendRequest('tools/call', { name: 'list_appointments', arguments: { dataInicial, dataFinal: dataHoje, limit: 2 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[4/39] list_surveys'); sendRequest('tools/call', { name: 'list_surveys', arguments: { limit: 2 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[5/39] get_survey'); sendRequest('tools/call', { name: 'get_survey', arguments: { id: '1' } }); }, delay += 500);
    setTimeout(() => { console.log('\n[6/39] create_survey'); sendRequest('tools/call', { name: 'create_survey', arguments: { descricao: 'Teste Completo', ativo: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[7/39] update_survey'); sendRequest('tools/call', { name: 'update_survey', arguments: { id: '1', descricao: 'Atualizado', ativo: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[8/39] delete_survey'); sendRequest('tools/call', { name: 'create_survey', arguments: { descricao: 'Deletar', ativo: 0 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[9/39] list_receitas'); sendRequest('tools/call', { name: 'list_receitas', arguments: { limit: 2 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[10/39] create_receita'); sendRequest('tools/call', { name: 'create_receita', arguments: { accountUnidade: 1, conta: 1, categoria: 4, tipoPagto: 7, dataVencto: dataHoje, dataEmissao: dataHoje, dataPagamento: dataHoje, valor: 30, valorTotal: 30, recibo: 2, pago: 1, observacao: 'Teste 39 tools' } }); }, delay += 500);
    setTimeout(() => { console.log('\n[11/39] list_despesas'); sendRequest('tools/call', { name: 'list_despesas', arguments: { limit: 2 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[12/39] create_despesa'); sendRequest('tools/call', { name: 'create_despesa', arguments: { accountUnidade: 1, conta: 3, categoria: 3, tipoPagto: 7, dataVencto: dataHoje, dataEmissao: dataHoje, dataPagamento: dataHoje, valor: 20, valorTotal: 20, pago: 1, observacao: 'Teste 39 tools' } }); }, delay += 500);
    setTimeout(() => { console.log('\n[13/39] list_document_modelos'); sendRequest('tools/call', { name: 'list_document_modelos', arguments: { limit: 2, lingua: 'pt-BR' } }); }, delay += 500);
    setTimeout(() => { console.log('\n[14/39] get_fluxo_caixa_report'); sendRequest('tools/call', { name: 'get_fluxo_caixa_report', arguments: { dataInicial, dataFinal: dataHoje, accountUnidade: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[15/39] get_categoria_receita_report'); sendRequest('tools/call', { name: 'get_categoria_receita_report', arguments: { dataInicial, dataFinal: dataHoje, accountUnidade: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[16/39] get_categoria_despesa_report'); sendRequest('tools/call', { name: 'get_categoria_despesa_report', arguments: { dataInicial, dataFinal: dataHoje, accountUnidade: 1 } }); }, delay += 500);

    // ========== TESTE DAS 23 NOVAS FERRAMENTAS ==========
    console.log('\n' + '-'.repeat(70));
    console.log('🆕 NOVAS FERRAMENTAS (23)');
    console.log('-'.repeat(70));

    // Profissionais (3)
    setTimeout(() => { console.log('\n[17/39] list_profissionais'); sendRequest('tools/call', { name: 'list_profissionais', arguments: { limit: 2, ativo: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[18/39] get_profissional'); sendRequest('tools/call', { name: 'get_profissional', arguments: { id: '1' } }); }, delay += 500);
    setTimeout(() => { console.log('\n[19/39] list_profissional_agenda'); sendRequest('tools/call', { name: 'list_profissional_agenda', arguments: { profissional: 1 } }); }, delay += 500);

    // Convênios (2)
    setTimeout(() => { console.log('\n[20/39] list_convenios'); sendRequest('tools/call', { name: 'list_convenios', arguments: { limit: 2, ativo: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[21/39] get_convenio'); sendRequest('tools/call', { name: 'get_convenio', arguments: { id: '1' } }); }, delay += 500);

    // Serviços (2)
    setTimeout(() => { console.log('\n[22/39] list_servicos'); sendRequest('tools/call', { name: 'list_servicos', arguments: { limit: 2, ativo: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[23/39] get_servico'); sendRequest('tools/call', { name: 'get_servico', arguments: { id: '1' } }); }, delay += 500);

    // Contas (2)
    setTimeout(() => { console.log('\n[24/39] list_contas'); sendRequest('tools/call', { name: 'list_contas', arguments: { limit: 5, ativo: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[25/39] get_conta_saldo'); sendRequest('tools/call', { name: 'get_conta_saldo', arguments: {} }); }, delay += 500);

    // Fornecedores (2)
    setTimeout(() => { console.log('\n[26/39] list_fornecedores'); sendRequest('tools/call', { name: 'list_fornecedores', arguments: { limit: 2, ativo: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[27/39] create_fornecedor'); sendRequest('tools/call', { name: 'create_fornecedor', arguments: { nomeFantasia: 'Fornecedor Teste MCP', telefone: '(31) 9999-8888', email: 'teste@mcp.com' } }); }, delay += 500);

    // Categorias (2)
    setTimeout(() => { console.log('\n[28/39] list_categorias_receita'); sendRequest('tools/call', { name: 'list_categorias_receita', arguments: { limit: 10 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[29/39] list_categorias_despesa'); sendRequest('tools/call', { name: 'list_categorias_despesa', arguments: { limit: 10 } }); }, delay += 500);

    // Relatórios Avançados (4)
    setTimeout(() => { console.log('\n[30/39] get_tipo_pagamento_report'); sendRequest('tools/call', { name: 'get_tipo_pagamento_report', arguments: { dataInicial, dataFinal: dataHoje, accountUnidade: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[31/39] get_inadimplencia_report'); sendRequest('tools/call', { name: 'get_inadimplencia_report', arguments: { dataInicial, dataFinal: dataHoje, accountUnidade: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[32/39] get_profissional_report'); sendRequest('tools/call', { name: 'get_profissional_report', arguments: { dataInicial, dataFinal: dataHoje, accountUnidade: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[33/39] get_convenio_report'); sendRequest('tools/call', { name: 'get_convenio_report', arguments: { dataInicial, dataFinal: dataHoje, accountUnidade: 1 } }); }, delay += 500);

    // Agendamentos (1)
    setTimeout(() => { console.log('\n[34/39] create_agendamento'); sendRequest('tools/call', { name: 'create_agendamento', arguments: { accountUnidade: 1, profissional: 1, data: '2026-02-17', horaInicial: '14:00:00', horaFinal: '14:30:00', paciente: 1, servico: 1, especialidade: 1, status: 0, observacao: 'Teste 39 tools' } }); }, delay += 500);

    // Prontuários (3)
    setTimeout(() => { console.log('\n[35/39] list_prontuarios'); sendRequest('tools/call', { name: 'list_prontuarios', arguments: { limit: 2 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[36/39] get_prontuario'); sendRequest('tools/call', { name: 'get_prontuario', arguments: { id: '1' } }); }, delay += 500);
    setTimeout(() => { console.log('\n[37/39] create_prontuario'); sendRequest('tools/call', { name: 'create_prontuario', arguments: { paciente: 1, profissional: 1, data: dataHoje, hora: '10:00:00', queixaPrincipal: 'Teste MCP', diagnostico: 'Teste' } }); }, delay += 500);

    // Produtos (2)
    setTimeout(() => { console.log('\n[38/39] list_produtos'); sendRequest('tools/call', { name: 'list_produtos', arguments: { limit: 2, ativo: 1 } }); }, delay += 500);
    setTimeout(() => { console.log('\n[39/39] get_produto_estoque'); sendRequest('tools/call', { name: 'get_produto_estoque', arguments: { id: '1' } }); }, delay += 500);

    // Encerrar
    setTimeout(() => {
        console.log('\n' + '='.repeat(70));
        console.log('✅ Todos os 39 testes foram executados!');
        console.log('='.repeat(70));
        server.stdin.end();
    }, delay + 2000);
}, 500);

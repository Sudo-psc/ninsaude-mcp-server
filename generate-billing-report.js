#!/usr/bin/env node

/**
 * Gerador de Relatório de Faturamento - Janeiro e Fevereiro 2026
 * Uso: node generate-billing-report.js
 */

const auth = require('./lib/auth');
const axios = require('axios');
const fs = require('fs');

const API_URL = process.env.NINSAUDE_API_URL || 'https://api.ninsaude.com/v1';

// Função para buscar receitas (faturamento) por período
async function buscarReceitas(dataInicial, dataFinal) {
    try {
        console.log(`📊 Buscando receitas de ${dataInicial} até ${dataFinal}...`);

        const response = await auth.authRequest('GET', '/cadastro_receita/listar', null, {
            dataInicial,
            dataFinal,
            limit: 1000
        });

        const receitas = response.data || [];
        console.log(`✅ Encontradas ${receitas.length} receitas\n`);
        return receitas;
    } catch (error) {
        console.error('❌ Erro ao buscar receitas:', error.response?.data || error.message);
        return [];
    }
}

// Função para buscar despesas por período
async function buscarDespesas(dataInicial, dataFinal) {
    try {
        console.log(`📊 Buscando despesas de ${dataInicial} até ${dataFinal}...`);

        const response = await auth.authRequest('GET', '/cadastro_despesa/listar', null, {
            dataInicial,
            dataFinal,
            limit: 1000
        });

        const despesas = response.data || [];
        console.log(`✅ Encontradas ${despesas.length} despesas\n`);
        return despesas;
    } catch (error) {
        console.error('❌ Erro ao buscar despesas:', error.response?.data || error.message);
        return [];
    }
}

// Função para formatar valor em BRL
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor || 0);
}

// Função para gerar estatísticas do período
function gerarEstatisticas(receitas, despesas, periodo) {
    const totalReceitas = receitas.reduce((sum, r) => sum + (parseFloat(r.valorTotal) || 0), 0);
    const totalDespesas = despesas.reduce((sum, d) => sum + (parseFloat(d.valorTotal) || 0), 0);
    const saldo = totalReceitas - totalDespesas;

    // Receitas por tipo de pagamento
    const receitasPorTipo = {};
    receitas.forEach(r => {
        const tipo = r.tipoPagamento?.descricao || 'Outros';
        receitasPorTipo[tipo] = (receitasPorTipo[tipo] || 0) + (parseFloat(r.valorTotal) || 0);
    });

    // Receitas pagas vs pendentes
    const receitasPagas = receitas.filter(r => r.pago === 1);
    const receitasPendentes = receitas.filter(r => r.pago === 0);
    const totalPago = receitasPagas.reduce((sum, r) => sum + (parseFloat(r.valorTotal) || 0), 0);
    const totalPendente = receitasPendentes.reduce((sum, r) => sum + (parseFloat(r.valorTotal) || 0), 0);

    return {
        periodo,
        totalReceitas,
        totalDespesas,
        saldo,
        receitasPorTipo,
        receitasPagas: receitasPagas.length,
        receitasPendentes: receitasPendentes.length,
        totalPago,
        totalPendente,
        quantidadeReceitas: receitas.length,
        quantidadeDespesas: despesas.length
    };
}

// Função para gerar relatório em texto
function gerarRelatorioTexto(stats) {
    let relatorio = '\n';
    relatorio += '═'.repeat(80) + '\n';
    relatorio += '              RELATÓRIO DE FATURAMENTO - JANEIRO E FEVEREIRO 2026\n';
    relatorio += '═'.repeat(80) + '\n\n';

    for (const stat of stats) {
        relatorio += `\n${'─'.repeat(80)}\n`;
        relatorio += `  ${stat.periodo.toUpperCase()}\n`;
        relatorio += `${'─'.repeat(80)}\n\n`;

        relatorio += '📊 RESUMO GERAL:\n';
        relatorio += `   Total de Receitas: ${formatarMoeda(stat.totalReceitas)}\n`;
        relatorio += `   Total de Despesas: ${formatarMoeda(stat.totalDespesas)}\n`;
        relatorio += `   Saldo do Período:  ${formatarMoeda(stat.saldo)}\n`;

        if (stat.totalReceitas > 0) {
            relatorio += `   Margem:            ${((stat.saldo / stat.totalReceitas) * 100).toFixed(2)}%\n\n`;
        } else {
            relatorio += `   Margem:            N/A\n\n`;
        }

        relatorio += '💰 RECEITAS:\n';
        relatorio += `   Quantidade:        ${stat.quantidadeReceitas} lançamentos\n`;
        relatorio += `   Pagas:             ${stat.receitasPagas} (${formatarMoeda(stat.totalPago)})\n`;
        relatorio += `   Pendentes:         ${stat.receitasPendentes} (${formatarMoeda(stat.totalPendente)})\n\n`;

        if (Object.keys(stat.receitasPorTipo).length > 0) {
            relatorio += '📈 RECEITAS POR TIPO DE PAGAMENTO:\n';
            Object.entries(stat.receitasPorTipo)
                .sort((a, b) => b[1] - a[1])
                .forEach(([tipo, valor]) => {
                    const percentual = ((valor / stat.totalReceitas) * 100).toFixed(1);
                    relatorio += `   ${tipo.padEnd(30)} ${formatarMoeda(valor).padStart(15)} (${percentual}%)\n`;
                });
            relatorio += '\n';
        }

        relatorio += '💸 DESPESAS:\n';
        relatorio += `   Quantidade:        ${stat.quantidadeDespesas} lançamentos\n`;
        relatorio += `   Total:             ${formatarMoeda(stat.totalDespesas)}\n\n`;
    }

    // Resumo consolidado
    const totalGeralReceitas = stats.reduce((sum, s) => sum + s.totalReceitas, 0);
    const totalGeralDespesas = stats.reduce((sum, s) => sum + s.totalDespesas, 0);
    const saldoGeral = totalGeralReceitas - totalGeralDespesas;

    relatorio += '\n' + '═'.repeat(80) + '\n';
    relatorio += '                        CONSOLIDADO JANEIRO + FEVEREIRO\n';
    relatorio += '═'.repeat(80) + '\n\n';
    relatorio += `   Total de Receitas: ${formatarMoeda(totalGeralReceitas)}\n`;
    relatorio += `   Total de Despesas: ${formatarMoeda(totalGeralDespesas)}\n`;
    relatorio += `   Saldo do Período:  ${formatarMoeda(saldoGeral)}\n`;

    if (totalGeralReceitas > 0) {
        relatorio += `   Margem:            ${((saldoGeral / totalGeralReceitas) * 100).toFixed(2)}%\n\n`;
    } else {
        relatorio += `   Margem:            N/A\n\n`;
    }

    relatorio += '═'.repeat(80) + '\n\n';

    return relatorio;
}

// Função para gerar relatório em JSON
function gerarRelatorioJSON(stats) {
    const totalGeralReceitas = stats.reduce((sum, s) => sum + s.totalReceitas, 0);
    const totalGeralDespesas = stats.reduce((sum, s) => sum + s.totalDespesas, 0);
    const saldoGeral = totalGeralReceitas - totalGeralDespesas;

    return {
        periodo: 'Janeiro e Fevereiro 2026',
        dataGeracao: new Date().toISOString(),
        periodos: stats,
        consolidado: {
            totalReceitas: totalGeralReceitas,
            totalDespesas: totalGeralDespesas,
            saldo: saldoGeral,
            margem: totalGeralReceitas > 0 ? ((saldoGeral / totalGeralReceitas) * 100).toFixed(2) + '%' : 'N/A'
        }
    };
}

// Função principal
async function main() {
    console.log('📊 GERADOR DE RELATÓRIO DE FATURAMENTO\n');
    console.log('Período: Janeiro e Fevereiro de 2026\n');
    console.log('═'.repeat(80) + '\n');

    try {
        const periodos = [
            {
                nome: 'Janeiro 2026',
                dataInicial: '2026-01-01',
                dataFinal: '2026-01-31'
            },
            {
                nome: 'Fevereiro 2026',
                dataInicial: '2026-02-01',
                dataFinal: '2026-02-28'
            }
        ];

        const estatisticas = [];

        for (const periodo of periodos) {
            console.log(`\n${'─'.repeat(80)}`);
            console.log(`  PROCESSANDO: ${periodo.nome}`);
            console.log('─'.repeat(80) + '\n');

            const receitas = await buscarReceitas(periodo.dataInicial, periodo.dataFinal);
            const despesas = await buscarDespesas(periodo.dataInicial, periodo.dataFinal);

            const stats = gerarEstatisticas(receitas, despesas, periodo.nome);
            estatisticas.push(stats);
        }

        // Gerar relatórios
        const relatorioTexto = gerarRelatorioTexto(estatisticas);
        const relatorioJSON = gerarRelatorioJSON(estatisticas);

        // Salvar em arquivos
        const timestamp = new Date().toISOString().split('T')[0];
        const arquivoTexto = `relatorio-faturamento-jan-fev-2026-${timestamp}.txt`;
        const arquivoJSON = `relatorio-faturamento-jan-fev-2026-${timestamp}.json`;

        fs.writeFileSync(arquivoTexto, relatorioTexto);
        fs.writeFileSync(arquivoJSON, JSON.stringify(relatorioJSON, null, 2));

        // Exibir no console
        console.log(relatorioTexto);

        console.log('✅ RELATÓRIOS GERADOS COM SUCESSO!\n');
        console.log(`📄 Relatório TXT: ${arquivoTexto}`);
        console.log(`📄 Relatório JSON: ${arquivoJSON}\n`);

    } catch (error) {
        console.error('\n❌ Erro ao gerar relatório:', error.message);
        process.exit(1);
    }
}

// Executar
main().catch(console.error);

#!/usr/bin/env node

/**
 * Script para criar modelo de prescrição para BRITENS LC
 * Uso: node create-britens-prescription-template.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.NINSAUDE_API_URL || 'https://api.ninsaude.com/v1';

// Use o access token diretamente (válido por 15 minutos)
const ACCESS_TOKEN = 'e4189461888113462a67072579fd3f0cc7cd31e38bcd42255abc474a284af6a8d0316641cff08023d9000f2b6fb73b0ffa51122ff21c93d0a8702b78032084f6';

// Função para buscar medicamento BRITENS LC
async function buscarMedicamento() {
    try {
        console.log('\n🔍 Buscando medicamento BRITENS LC...');

        const response = await axios.get(`${API_URL}/medicamento/listar`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            params: {
                nome: 'BRITENS',
                limit: 10
            }
        });

        console.log(`✅ Encontrados ${response.data.data?.length || 0} medicamentos`);

        if (response.data.data && response.data.data.length > 0) {
            const britens = response.data.data.find(med =>
                med.nome?.toUpperCase().includes('BRITENS') &&
                med.nome?.toUpperCase().includes('LC')
            );

            if (britens) {
                console.log('\n📋 Medicamento encontrado:');
                console.log(`   ID: ${britens.id}`);
                console.log(`   Nome: ${britens.nome}`);
                console.log(`   Laboratório: ${britens.laboratorio || 'N/A'}`);
                console.log(`   Princípio Ativo: ${britens.principioAtivo || 'N/A'}`);
                return britens;
            } else {
                console.log('\n⚠️  BRITENS LC não encontrado na lista');
                console.log('📋 Medicamentos disponíveis:');
                response.data.data.forEach(med => {
                    console.log(`   - ${med.nome} (ID: ${med.id})`);
                });
            }
        }

        return null;
    } catch (error) {
        console.error('❌ Erro ao buscar medicamento:', error.response?.data || error.message);
        return null;
    }
}

// Função para criar modelo de prescrição
async function criarModeloPrescricao(medicamentoId) {
    try {
        console.log('\n📝 Criando modelo de prescrição...');

        // Dados do modelo de prescrição
        const modeloData = {
            titulo: 'Modelo BRITENS LC - Uso Contínuo Noturno',
            tipo: 3, // Tipo 3 = Prescrição
            ativo: 1,
            note: `BRITENS LC - SOLUÇÃO OFTÁLMICA ESTÉRIL

POSOLOGIA:
Instilar 1 (uma) gota no(s) olho(s) afetado(s), 1 vez ao dia, à noite (ao deitar).

DURAÇÃO DO TRATAMENTO:
Uso contínuo conforme necessidade

VIA DE ADMINISTRAÇÃO:
Tópica ocular (Colírio)

INDICAÇÃO:
Tratamento de Síndrome do Olho Seco
Lubrificação e umectação da superfície ocular

ORIENTAÇÕES AO PACIENTE:
- Lavar as mãos antes de aplicar
- Não encostar a ponta do frasco no olho
- Aguardar pelo menos 15 minutos entre aplicações de diferentes colírios
- Aplicar preferencialmente à noite antes de dormir
- Fechar bem o frasco após o uso
- Manter em temperatura ambiente

OBSERVAÇÕES:
Em caso de irritação persistente ou reações adversas, suspender o uso e contatar o médico oftalmologista.`
        };

        console.log('📤 Enviando dados do modelo...');
        console.log(JSON.stringify(modeloData, null, 2));

        const response = await axios.post(
            `${API_URL}/configuracao_documentomodelo`,
            modeloData,
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('\n✅ Modelo de prescrição criado com sucesso!');
        console.log('📋 Detalhes do modelo:');
        console.log(JSON.stringify(response.data, null, 2));

        return response.data;
    } catch (error) {
        console.error('\n❌ Erro ao criar modelo de prescrição:');
        console.error('Status:', error.response?.status);
        console.error('Dados:', JSON.stringify(error.response?.data, null, 2));
        return null;
    }
}

// Função para listar modelos existentes
async function listarModelos() {
    try {
        console.log('\n📋 Listando modelos de prescrição existentes...');

        const response = await axios.get(`${API_URL}/configuracao_documentomodelo/listar`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            params: {
                tipo: 3, // Prescrição
                limit: 50
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            console.log(`\n✅ Encontrados ${response.data.data.length} modelos:`);
            response.data.data.forEach((modelo, index) => {
                console.log(`\n${index + 1}. ${modelo.titulo || 'Sem título'}`);
                console.log(`   ID: ${modelo.id}`);
                console.log(`   Tipo: ${modelo.tipo}`);
                console.log(`   Ativo: ${modelo.ativo ? 'Sim' : 'Não'}`);
            });
        } else {
            console.log('⚠️  Nenhum modelo encontrado');
        }

        return response.data;
    } catch (error) {
        console.error('❌ Erro ao listar modelos:', error.response?.data || error.message);
        return null;
    }
}

// Função principal
async function main() {
    console.log('🏥 CRIADOR DE MODELO DE PRESCRIÇÃO - BRITENS LC');
    console.log('='.repeat(60));

    try {
        // 1. Listar modelos existentes
        await listarModelos();

        // 2. Buscar medicamento BRITENS LC
        const medicamento = await buscarMedicamento();

        // 3. Criar modelo de prescrição
        const modelo = await criarModeloPrescricao(medicamento?.id);

        if (modelo) {
            console.log('\n' + '='.repeat(60));
            console.log('✅ MODELO CRIADO COM SUCESSO!');
            console.log('='.repeat(60));
            console.log('\n📝 Informações da prescrição:');
            console.log('   Medicamento: BRITENS LC (Lubrificante Ocular)');
            console.log('   Posologia: 1 gota à noite');
            console.log('   Duração: Uso contínuo');
            console.log('   Via: Tópica ocular');
            console.log('   Indicação: Tratamento de olho seco');
            console.log('\n📋 Próximos passos:');
            console.log('   1. O modelo está disponível no sistema');
            console.log('   2. Associe-o aos profissionais desejados');
            console.log('   3. Use-o para criar prescrições rápidas em prontuários');
        } else {
            console.log('\n⚠️  Modelo não foi criado. Verifique os logs acima.');
        }

    } catch (error) {
        console.error('\n❌ Erro geral:', error.message);
        process.exit(1);
    }
}

// Executar
main().catch(console.error);

#!/usr/bin/env node

/**
 * Script para adicionar o colírio BRITENSLC ao banco de dados Ninsaúde
 */

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Dados do colírio BRITENSLC
const britenslc = {
    nome: "BRITENSLC",
    laboratorio: "Adaptados",
    principioAtivo: "Cloreto de sódio 5%",
    apresentacao: "Colírio 5ml",
    codigoPais: "BR",
    ativo: 1
};

console.log('\n🏥 Adicionando Colírio BRITENSLC ao Ninsaúde\n');
console.log('Dados do medicamento:');
console.log(JSON.stringify(britenslc, null, 2));
console.log('\n');

// Executar o servidor MCP
const server = spawn('node', ['dist/index.js'], {
    stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';
let initialized = false;

server.stdout.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    lines.forEach(line => {
        if (!line.trim()) return;

        try {
            const message = JSON.parse(line);

            // Aguardar inicialização
            if (message.method === 'notifications/initialized' ||
                (message.result && !initialized)) {
                initialized = true;
                console.log('✅ Servidor inicializado\n');

                // Criar medicamento
                const createRequest = {
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'tools/call',
                    params: {
                        name: 'create_medicamento',
                        arguments: britenslc
                    }
                };

                console.log('📤 Enviando solicitação de criação...\n');
                server.stdin.write(JSON.stringify(createRequest) + '\n');
            }

            // Resposta da criação
            if (message.id === 2 && message.result) {
                console.log('✅ Colírio BRITENSLC adicionado com sucesso!\n');
                console.log('Resposta:');
                console.log(JSON.stringify(message.result, null, 2));
                console.log('\n');

                // Verificar se foi criado
                setTimeout(() => {
                    const listRequest = {
                        jsonrpc: '2.0',
                        id: 3,
                        method: 'tools/call',
                        params: {
                            name: 'list_medicamentos',
                            arguments: {
                                nome: 'BRITENSLC',
                                limit: 5
                            }
                        }
                    };

                    console.log('🔍 Verificando cadastro...\n');
                    server.stdin.write(JSON.stringify(listRequest) + '\n');
                }, 1000);
            }

            // Resposta da listagem
            if (message.id === 3 && message.result) {
                console.log('✅ Verificação concluída!\n');
                console.log('Medicamentos encontrados:');
                console.log(JSON.stringify(message.result, null, 2));
                console.log('\n');

                setTimeout(() => {
                    console.log('🎉 Processo concluído com sucesso!');
                    server.kill();
                    rl.close();
                    process.exit(0);
                }, 1000);
            }

            // Erros
            if (message.error) {
                console.error('❌ Erro:', message.error);
                server.kill();
                rl.close();
                process.exit(1);
            }

        } catch (e) {
            // Ignora linhas que não são JSON
        }
    });
});

server.on('error', (error) => {
    console.error('❌ Erro ao iniciar servidor:', error);
    rl.close();
    process.exit(1);
});

server.on('close', (code) => {
    if (code !== 0 && code !== null) {
        console.error(`❌ Servidor encerrado com código ${code}`);
    }
    rl.close();
});

// Inicializar servidor
const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
            name: 'britenslc-setup',
            version: '1.0.0'
        }
    }
};

console.log('🚀 Iniciando servidor MCP...\n');
server.stdin.write(JSON.stringify(initRequest) + '\n');

// Timeout de segurança
setTimeout(() => {
    console.error('\n❌ Timeout - processo excedeu 30 segundos');
    server.kill();
    rl.close();
    process.exit(1);
}, 30000);

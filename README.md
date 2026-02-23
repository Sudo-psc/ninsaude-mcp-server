# 🏥 Ninsaúde MCP Server

> Servidor MCP completo para integração com a API do **Ninsaúde Clinic** — gestão inteligente de clínicas médicas via IA.

[![GitHub](https://img.shields.io/badge/GitHub-Sudo--psc%2Fninsaude--mcp--server-blue?logo=github)](https://github.com/Sudo-psc/ninsaude-mcp-server)
![Ferramentas](https://img.shields.io/badge/Ferramentas-74-brightgreen)
![Status](https://img.shields.io/badge/Status-Produção-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

---

## 🎉 **74 FERRAMENTAS DISPONÍVEIS** ✅

### 📊 Resumo por Módulo

| Módulo | Ferramentas | Operações |
|--------|:-----------:|-----------|
| 👥 **Pacientes** | 4 | Listar, buscar, criar, atualizar |
| 📅 **Agendamentos** | 3 | Listar, criar, reagendar, cancelar |
| 📋 **Formulários de Pesquisa** | 5 | CRUD completo |
| 💰 **Receitas/Recebimentos** | 2 | Listar, criar |
| 💸 **Despesas/Pagamentos** | 2 | Listar, criar |
| 📄 **Modelos de Documentos** | 1 | Listar |
| 📊 **Relatórios Financeiros Básicos** | 3 | Fluxo de caixa, categorias |
| 👨‍⚕️ **Profissionais de Saúde** | 3 | Listar, buscar, agenda |
| 🏥 **Convênios/Planos** | 2 | Listar, buscar |
| 🔬 **Serviços Médicos** | 2 | Listar, buscar |
| 🏦 **Contas Bancárias** | 2 | Listar, saldo |
| 📦 **Fornecedores** | 2 | Listar, criar |
| 🏷️ **Categorias Financeiras** | 2 | Listar receita/despesa |
| 📈 **Relatórios Avançados** | 4 | Tipo de pagamento, inadimplência, profissional, convênio |
| 📝 **Prontuários Médicos** | 4 | Listar, buscar, criar, atualizar |
| 📦 **Produtos/Estoque Básico** | 2 | Listar produtos, nível de estoque |
| 🔄 **Títulos de Transferência** | 3 | Listar, buscar, adicionar lote |
| 💊 **Medicamentos** | 2 | Listar, buscar (base central) |
| 💊 **Prescrições do Prontuário** | 4 | CRUD completo |
| 🧪 **Medicamentos da Prescrição** | 3 | Listar, adicionar, remover |
| 📓 **Notas do Prontuário** | 4 | CRUD completo |
| 🤧 **Alergias** | 4 | CRUD completo |
| 🗂️ **Documentos do Prontuário** | 2 | Listar, buscar |
| 🔀 **Encaminhadores** | 3 | Listar, buscar, criar |
| 🚪 **Salas da Clínica** | 2 | Listar, buscar |
| 💳 **Tipos de Pagamento** | 2 | Listar, buscar |
| 🩺 **Especialidades Médicas** | 1 | Listar |
| 🏷️ **CID-10** | 2 | Buscar por código/descrição |
| 🗺️ **Cidades / CEP** | 2 | Buscar CEP, listar cidades |
| 💱 **Transferências Financeiras** | 3 | Listar, criar, buscar |
| 🏗️ **Depósitos de Estoque** | 2 | Listar, buscar |
| 📦 **Movimentações de Estoque** | 2 | Listar, criar |
| 📊 **Relatórios de Atendimento** | 8 | Sobrecarga, sazonalidade, sexo, pico, serviços, convênios, quantidades, totais |
| 🧾 **Notas Fiscais (NFS-e)** | 4 | Listar, cancelar, enviar e-mail, estatísticas |
| 💰 **Cobranças Ninsaúde Pay** | 3 | Listar, buscar, link de pagamento |
| **TOTAL** | **74** | |

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Conta ativa no Ninsaúde Clinic com acesso à API

### Instalação
```bash
git clone https://github.com/Sudo-psc/ninsaude-mcp-server.git
cd ninsaude-mcp-server
npm install
```

### Configuração
Crie um arquivo `.env` (use o `.env.example` como base):
```env
NINSAUDE_API_URL=https://api.ninsaude.com/v1
NINSAUDE_REFRESH_TOKEN=seu_refresh_token_aqui
```

> ⚠️ **Apenas o `REFRESH_TOKEN` é necessário.** O servidor autentica automaticamente via OAuth2 usando somente esse token — não é preciso `CLIENT_ID` nem `CLIENT_SECRET`.

#### 🔑 Como obter o REFRESH_TOKEN

1. Acesse o painel do Ninsaúde Clinic
2. Vá em **Configurações → Integrações → API**
3. Gere um **Refresh Token** para sua aplicação
4. Cole o valor no `.env` como `NINSAUDE_REFRESH_TOKEN`

Ou use o script auxiliar já incluído:
```bash
node capture-token.js
```

### Build
```bash
npm run build
```

### Executar
```bash
node dist/index.js
```

### Configurar no Claude Desktop / Cursor
Adicione ao `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "ninsaude": {
      "command": "node",
      "args": ["/caminho/para/ninsaude-mcp-server/dist/index.js"]
    }
  }
}
```

---

## 📚 Ferramentas Disponíveis

### 1. 👥 Pacientes (4 ferramentas)

| Ferramenta | Descrição |
|---|---|
| `list_patients` | Listar pacientes com filtros |
| `get_patient` | Buscar paciente por ID |
| `create_patient` | Criar novo paciente |
| `update_patient` | Atualizar dados do paciente |

```javascript
// Exemplo: listar pacientes
{ limit: 10, nomeExato: "Maria Silva", cpf: "12345678900" }

// Exemplo: criar paciente
{
  nome: "João da Silva",
  cpf: "12345678900",
  dataNascimento: "1990-01-15",
  sexo: "M",
  email: "joao@email.com",
  foneCelular: "(31) 99999-1234"
}
```

---

### 2. 📅 Agendamentos (3 ferramentas)

| Ferramenta | Descrição |
|---|---|
| `list_appointments` | Listar agendamentos |
| `create_agendamento` | Criar novo agendamento |
| `update_agendamento` | Reagendar consulta |
| `cancel_agendamento` | Cancelar agendamento |

```javascript
// Listar agendamentos do dia
{
  dataInicial: "2026-02-23",
  dataFinal: "2026-02-23",
  status: 4 // 0=Agendado,1=Espera,2=Conf,3=Atend,4=Atendido,5=Cancel
}
```

---

### 3. 📋 Formulários de Pesquisa (5 ferramentas)

- `list_surveys` — Listar formulários
- `get_survey` — Buscar por ID
- `create_survey` — Criar formulário
- `update_survey` — Atualizar formulário
- `delete_survey` — Excluir formulário

---

### 4. 💰 Receitas/Recebimentos (2 ferramentas)

| Ferramenta | Descrição |
|---|---|
| `list_receitas` | Listar com filtros de data |
| `create_receita` | Registrar recebimento |

```javascript
// Receitas de hoje
{
  dataPagamentoInicial: "2026-02-23",
  dataPagamentoFinal: "2026-02-23"
}
```

---

### 5. 💸 Despesas/Pagamentos (2 ferramentas)

- `list_despesas` — Listar despesas
- `create_despesa` — Registrar despesa

---

### 6. 📊 Relatórios Financeiros (7 ferramentas)

| Ferramenta | Descrição |
|---|---|
| `get_fluxo_caixa_report` | Fluxo de caixa por período |
| `get_categoria_receita_report` | Receitas por categoria |
| `get_categoria_despesa_report` | Despesas por categoria |
| `get_tipo_pagamento_report` | Por forma de pagamento (PIX, cartão, dinheiro...) |
| `get_inadimplencia_report` | Pagamentos em atraso |
| `get_profissional_report` | Faturamento por médico |
| `get_convenio_report` | Faturamento por convênio |

```javascript
// Todos usam:
{ dataInicial: "2026-02-01", dataFinal: "2026-02-28", accountUnidade: 1 }
```

---

### 7. 👨‍⚕️ Profissionais de Saúde (3 ferramentas)

- `list_profissionais` — Listar com filtros
- `get_profissional` — Buscar por ID
- `list_profissional_agenda` — Grade de horários

---

### 8. 🏥 Convênios/Planos de Saúde (2 ferramentas)

- `list_convenios` — Listar convênios
- `get_convenio` — Buscar por ID

---

### 9. 🔬 Serviços Médicos (2 ferramentas)

- `list_servicos` — Listar serviços/procedimentos
- `get_servico` — Buscar por ID

---

### 10. 🏦 Contas Bancárias (2 ferramentas)

- `list_contas` — Listar contas cadastradas
- `get_conta_saldo` — Saldo atual de todas as contas

---

### 11. 📦 Fornecedores (2 ferramentas)

- `list_fornecedores` — Listar fornecedores
- `create_fornecedor` — Cadastrar fornecedor

---

### 12. 🏷️ Categorias Financeiras (2 ferramentas)

- `list_categorias_receita` — Categorias de receita
- `list_categorias_despesa` — Categorias de despesa

---

### 13. 📝 Prontuários Médicos (4 ferramentas)

- `list_prontuarios` — Listar prontuários
- `get_prontuario` — Buscar por ID
- `create_prontuario` — Criar prontuário com queixa, diagnóstico, conduta
- `update_prontuario` — Atualizar prontuário

---

### 14. 💊 Prescrições do Prontuário (4 ferramentas)

| Ferramenta | Descrição |
|---|---|
| `list_prontuario_prescricoes` | Listar prescrições |
| `get_prontuario_prescricao` | Buscar por ID |
| `create_prontuario_prescricao` | Criar prescrição |
| `update_prontuario_prescricao` | Atualizar prescrição |

```javascript
// Criar prescrição vinculada ao prontuário
{
  prontuario: 456,
  descricao: "Receituário do dia",
  tipo: 0 // 0=Simples, 1=Controle especial
}
```

---

### 15. 🧪 Medicamentos da Prescrição (3 ferramentas)

- `list_prescricao_medicamentos` — Listar itens
- `create_prescricao_medicamento` — Adicionar medicamento
- `delete_prescricao_medicamento` — Remover medicamento

```javascript
// Adicionar medicamento à prescrição
{
  prescricao: 789,
  medicamento: 1234, // ID da base central
  posologia: "1 gota 3x ao dia",
  quantidade: 1,
  unidade: "frasco"
}
```

---

### 16. 📓 Notas do Prontuário (4 ferramentas)

- `list_prontuario_notas` — Listar notas clínicas
- `create_prontuario_nota` — Criar nota
- `update_prontuario_nota` — Editar nota
- `delete_prontuario_nota` — Excluir nota

---

### 17. 🤧 Alergias do Paciente (4 ferramentas)

- `list_alergias` — Listar alergias
- `create_alergia` — Registrar alergia
- `update_alergia` — Atualizar alergia
- `delete_alergia` — Remover alergia

```javascript
{
  paciente: 123,
  descricao: "Dipirona",
  tipo: 0,     // 0=Medicamento,1=Alimento,2=Ambiente,3=Outro
  gravidade: 2 // 0=Leve,1=Moderada,2=Grave
}
```

---

### 18. 🗂️ Documentos do Prontuário (2 ferramentas)

- `list_prontuario_documentos` — Listar documentos (exames, atestados)
- `get_prontuario_documento` — Buscar por ID

---

### 19. 🔀 Encaminhadores (3 ferramentas)

- `list_encaminhadores` — Listar médicos encaminhadores
- `get_encaminhador` — Buscar por ID
- `create_encaminhador` — Cadastrar encaminhador

---

### 20. 🚪 Salas da Clínica (2 ferramentas)

- `list_salas` — Listar salas de atendimento
- `get_sala` — Buscar sala por ID

---

### 21. 💳 Tipos de Pagamento (2 ferramentas)

- `list_tipos_pagamento` — PIX, cartão, dinheiro, cheque, etc.
- `get_tipo_pagamento` — Buscar por ID

---

### 22. 🩺 Especialidades Médicas (1 ferramenta)

- `list_especialidades` — Listar especialidades (Oftalmologia, Cardiologia, etc.)

---

### 23. 🏷️ CID-10 (2 ferramentas)

- `list_cid` — Buscar doenças por código ou descrição
- `get_cid` — Detalhes de um CID específico

```javascript
// Buscar diagnósticos
{ descricao: "diabetes" }    // por nome
{ codigo: "E11" }            // por código CID
```

---

### 24. 🗺️ Cidades / CEP (2 ferramentas)

- `buscar_endereco_por_cep` — Retorna logradouro, bairro, cidade pelo CEP
- `list_cidades` — Listar cidades por estado/país

```javascript
{ cep: "01310100" } // Sem traços
```

---

### 25. 💱 Transferências Financeiras (3 ferramentas)

- `list_transferencias` — Listar transferências entre contas
- `create_transferencia` — Realizar transferência
- `get_transferencia` — Buscar por ID

```javascript
{
  contaOrigem: 1,
  contaDestino: 3,
  valor: 500.00,
  data: "2026-02-23",
  observacao: "Sangria do caixa"
}
```

---

### 26. 🏗️ Depósitos de Estoque (2 ferramentas)

- `list_depositos` — Listar almoxarifados/depósitos
- `get_deposito` — Buscar por ID

---

### 27. 📦 Movimentações de Estoque (2 ferramentas)

- `list_movimentacoes_estoque` — Listar entradas/saídas/transferências
- `create_movimentacao_estoque` — Registrar movimentação

```javascript
{
  produto: 10,
  quantidade: 5,
  tipo: 0,          // 0=Entrada, 1=Saída, 2=Transferência
  data: "2026-02-23",
  depositoDestino: 1
}
```

---

### 28. 📊 Relatórios de Atendimento (8 ferramentas)

| Ferramenta | Descrição |
|---|---|
| `get_atendimento_sobrecarga_report` | Carga de trabalho por profissional |
| `get_atendimento_sazonalidade` | Tendências mensais/semanais |
| `get_atendimento_sexo_pacientes` | Distribuição de gênero |
| `get_atendimento_horarios_pico` | Horários com maior demanda |
| `get_atendimento_servicos_mais_vendidos` | Serviços mais realizados |
| `get_atendimento_convenios_mais_vendidos` | Convênios mais utilizados |
| `get_atendimento_quantidades` | Atendidos, faltas, cancelamentos |
| `get_total_pacientes` | Totais gerais de pacientes |

```javascript
// Todos usam (exceto get_total_pacientes):
{ dataInicial: "2026-02-01", dataFinal: "2026-02-28", profissional: 1 }
```

---

### 29. 🧾 Notas Fiscais NFS-e (4 ferramentas)

- `list_notas_fiscais` — Listar NFS-e (por data ou status)
- `get_nota_fiscal_estatisticas` — Totais e valores emitidos
- `cancelar_nota_fiscal` — Cancelar NFS-e por ID
- `enviar_nota_fiscal_email` — Enviar NFS-e por e-mail

---

### 30. 💰 Cobranças Ninsaúde Pay (3 ferramentas)

- `list_cobrancas` — Listar cobranças/boletos
- `get_cobranca` — Buscar cobrança por ID
- `get_link_cobranca` — Obter link de pagamento para compartilhar

---

### 31. 💊 Medicamentos Base Central (2 ferramentas)

- `list_medicamentos` — Buscar na base de medicamentos (somente leitura)
- `get_medicamento` — Detalhes de um medicamento

---

### 32. 🔄 Títulos de Transferência (3 ferramentas)

- `list_titulos_transferencias` — Listar títulos de conciliação
- `get_titulo_transferencia` — Buscar por ID
- `add_titulos_lote` — Adicionar títulos em lote

---

## 💡 Exemplos de Uso

### 🩺 Fluxo Clínico Completo
```javascript
// 1. Buscar paciente
const paciente = await list_patients({ nomeExato: "Maria Silva" });

// 2. Verificar alergias
const alergias = await list_alergias({ paciente: paciente.result[0].id });

// 3. Criar prontuário
const prontuario = await create_prontuario({
  paciente: paciente.result[0].id,
  profissional: 1,
  data: "2026-02-23",
  hora: "14:30:00",
  queixaPrincipal: "Olho seco e ardência",
  diagnostico: "Ceratoconjuntivite seca",
  conduta: "Lubrificante ocular 4x/dia"
});

// 4. Criar prescrição
const prescricao = await create_prontuario_prescricao({
  prontuario: prontuario.result.id,
  descricao: "Receituário Simples"
});

// 5. Adicionar medicamento
await create_prescricao_medicamento({
  prescricao: prescricao.result.id,
  descricao: "Colírio Lacrifilm",
  posologia: "1 gota em cada olho, 4x ao dia",
  quantidade: 1,
  unidade: "frasco"
});
```

### 📊 Dashboard Financeiro do Dia
```javascript
const hoje = "2026-02-23";

const dashboard = {
  receitas: await list_receitas({
    dataPagamentoInicial: hoje,
    dataPagamentoFinal: hoje
  }),
  despesas: await list_despesas({
    dataPagamentoInicial: hoje,
    dataPagamentoFinal: hoje
  }),
  fluxo: await get_fluxo_caixa_report({
    dataInicial: hoje,
    dataFinal: hoje
  }),
  tipoPagamento: await get_tipo_pagamento_report({
    dataInicial: hoje,
    dataFinal: hoje
  }),
  saldos: await get_conta_saldo({})
};
```

### 📅 Sistema de Agendamento
```javascript
// Verificar agenda do dia e horários de pico
const agendamentos = await list_appointments({
  dataInicial: "2026-02-23",
  dataFinal: "2026-02-23"
});

const pico = await get_atendimento_horarios_pico({
  dataInicial: "2026-01-01",
  dataFinal: "2026-02-23"
});
```

---

## 🧪 Testes

```bash
# Teste completo das ferramentas
node test-39-tools.js

# Módulo financeiro
node test-financial.js

# Criar receita/despesa de teste
node test-create-financial.js

# Formulários de pesquisa
node test-surveys.js
node test-crud-surveys.js
```

---

## 📁 Estrutura do Projeto

```
ninsaude-mcp-server/
├── src/
│   ├── index.ts          # Servidor MCP (74 ferramentas)
│   └── api.ts            # Cliente da API Ninsaúde
├── lib/
│   └── auth.js           # Módulo de autenticação
├── dist/                 # Build TypeScript compilado
├── .env                  # Credenciais (não versionado)
├── .env.example          # Template de credenciais
├── generate-billing-report.js  # Script de relatório de faturamento
├── capture-token.js      # Capturar token OAuth2
└── README.md
```

---

## 🔐 Autenticação

O servidor gerencia **automaticamente** toda a autenticação OAuth2. Você só precisa fornecer o `REFRESH_TOKEN` no `.env`.

| Variável | Obrigatório | Descrição |
|---|:---:|---|
| `NINSAUDE_API_URL` | ✅ | URL base da API (padrão: `https://api.ninsaude.com/v1`) |
| `NINSAUDE_REFRESH_TOKEN` | ✅ | Token de refresh OAuth2 gerado no painel Ninsaúde |

**Como funciona internamente:**
1. Na primeira requisição, o servidor troca o `refresh_token` por um `access_token`
2. O `access_token` é renovado automaticamente a cada **14 minutos** (antes dos 15 min de expiração)
3. Todas as chamadas à API são autenticadas transparentemente — sem intervenção manual

---


## 📈 Cobertura da API Ninsaúde

| Métrica | Valor |
|---|---|
| Ferramentas implementadas | **74** |
| Módulos cobertos | **35** |
| Endpoints utilizados | ~90 |
| Recursos da API explorados | 292 disponíveis na coleção |

---

## 📞 Documentação Adicional

| Arquivo | Conteúdo |
|---|---|
| `FUNCIONALIDADES.md` | Detalhes dos formulários de pesquisa |
| `FINANCEIRO.md` | Guia do módulo financeiro |
| `MODELOS_E_RELATORIOS.md` | Modelos de documentos e relatórios |
| `MEDICAMENTOS.md` | Integração com base de medicamentos |
| `MODO_PRESCRICAO_BRITENS.md` | Modelo de prescrição Britens |
| `RESUMO_COMPLETO.md` | Resumo executivo |

---

## 🏆 Histórico de Versões

| Versão | Ferramentas | Novidades |
|---|---|---|
| v1.0 | 16 | Pacientes, Agendamentos, Financeiro básico |
| v1.5 | 23 | Prontuários, Estoque, Relatórios básicos |
| v2.0 | 39 | Profissionais, Convênios, Fornecedores, Relatórios avançados |
| v2.5 | 43 | Medicamentos, Títulos de transferência |
| **v3.0** | **74** | **Prescrições, Alergias, NFS-e, Pay, Analytics de Atendimento, CID, CEP** |

---

**Versão**: 3.0.0  
**Atualizado**: Fevereiro 2026  
**Status**: ✅ Produção — 74 Ferramentas Ativas

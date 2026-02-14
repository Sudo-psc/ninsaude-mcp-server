# Ninsaúde MCP Server

MCP Server completo para integração com a API do Ninsaúde Clinic.

## 🎉 **39 FERRAMENTAS DISPONÍVEIS** - 100% TESTADO ✅

### 📊 Resumo por Módulo

| Módulo | Ferramentas | Status |
|--------|-------------|--------|
| 👥 **Pacientes** | 2 | ✅ 100% |
| 📅 **Agendamentos** | 2 | ✅ 100% |
| 📋 **Formulários** | 5 | ✅ 100% |
| 💰 **Receitas** | 2 | ✅ 100% |
| 💸 **Despesas** | 2 | ✅ 100% |
| 📄 **Modelos de Documentos** | 1 | ✅ 100% |
| 📊 **Relatórios Básicos** | 3 | ✅ 100% |
| 👨‍⚕️ **Profissionais** | 3 | ✅ 100% |
| 🏥 **Convênios** | 2 | ✅ 100% |
| 🔬 **Serviços Médicos** | 2 | ✅ 100% |
| 🏦 **Contas Bancárias** | 2 | ✅ 100% |
| 📦 **Fornecedores** | 2 | ✅ 100% |
| 🏷️ **Categorias Financeiras** | 2 | ✅ 100% |
| 📈 **Relatórios Avançados** | 4 | ✅ 100% |
| 📝 **Prontuários** | 3 | ✅ 100% |
| 📊 **Produtos/Estoque** | 2 | ✅ 100% |
| **TOTAL** | **39** | **✅ 100%** |

---

## 🚀 Início Rápido

### Instalação
```bash
npm install
```

### Configuração
Crie um arquivo `.env` com suas credenciais:
```env
NINSAUDE_CLIENT_ID=seu_client_id
NINSAUDE_CLIENT_SECRET=seu_client_secret
NINSAUDE_REFRESH_TOKEN=seu_refresh_token
```

### Build
```bash
npm run build
```

### Executar
```bash
node dist/index.ts
```

### Testar Todas as Ferramentas
```bash
node test-39-tools.js
```

---

## 📚 Ferramentas Disponíveis

### 1. 👥 **PACIENTES** (2 ferramentas)

#### `list_patients` - Listar pacientes
```javascript
{
  limit: 10,
  offset: 0,
  nome: "João",
  cpf: "12345678900",
  dataNascimento: "1990-01-01"
}
```

#### `get_patient` - Obter detalhes do paciente
```javascript
{ id: 123 }
```

---

### 2. 📅 **AGENDAMENTOS** (2 ferramentas)

#### `list_appointments` - Listar agendamentos
```javascript
{
  dataInicial: "2026-02-01",
  dataFinal: "2026-02-28",
  status: [0, 2], // 0=Agendado, 2=Confirmado
  profissional: [1],
  limit: 10
}
```

#### `create_agendamento` - Criar agendamento 🆕
```javascript
{
  accountUnidade: 1,
  profissional: 1,
  data: "2026-02-17",
  horaInicial: "14:00:00",
  horaFinal: "14:30:00",
  paciente: 123,
  servico: 1,
  especialidade: 5,
  status: 0, // 0=Agendado, 2=Confirmado
  observacao: "Consulta de rotina"
}
```

---

### 3. 📋 **FORMULÁRIOS DE PESQUISA** (5 ferramentas)

- `list_surveys` - Listar formulários
- `get_survey` - Obter formulário
- `create_survey` - Criar formulário
- `update_survey` - Atualizar formulário
- `delete_survey` - Excluir formulário

---

### 4. 💰 **RECEITAS/RECEBIMENTOS** (2 ferramentas)

#### `list_receitas` - Listar receitas
```javascript
{
  limit: 10,
  dataVencimentoInicial: "2026-02-01",
  dataVencimentoFinal: "2026-02-28"
}
```

#### `create_receita` - Criar receita
```javascript
{
  accountUnidade: 1,
  conta: 1,
  categoria: 4,
  tipoPagto: 7, // 7=Pix
  dataVencto: "2026-02-14",
  dataEmissao: "2026-02-14",
  dataPagamento: "2026-02-14",
  valor: 150.00,
  valorTotal: 150.00,
  recibo: 2,
  pago: 1,
  observacao: "Consulta"
}
```

---

### 5. 💸 **DESPESAS/PAGAMENTOS** (2 ferramentas)

- `list_despesas` - Listar despesas
- `create_despesa` - Criar despesa

---

### 6. 📄 **MODELOS DE DOCUMENTOS** (1 ferramenta)

#### `list_document_modelos` - Listar modelos
```javascript
{
  limit: 10,
  tipo: 0, // 0=Receituário, 1=Atestado, 4=Recibos
  lingua: "pt-BR"
}
```

---

### 7. 📊 **RELATÓRIOS FINANCEIROS BÁSICOS** (3 ferramentas)

- `get_fluxo_caixa_report` - Fluxo de caixa
- `get_categoria_receita_report` - Receitas por categoria
- `get_categoria_despesa_report` - Despesas por categoria

---

### 8. 👨‍⚕️ **PROFISSIONAIS DE SAÚDE** (3 ferramentas) 🆕

#### `list_profissionais` - Listar profissionais
```javascript
{
  limit: 10,
  nome: "Dr. João",
  especialidade: 5,
  ativo: 1,
  accountUnidade: 1
}
```

#### `get_profissional` - Obter profissional
```javascript
{ id: "1" }
```

#### `list_profissional_agenda` - Grade de horários
```javascript
{
  profissional: 1,
  diaSemana: 1 // 0=Domingo, 1=Segunda, ..., 6=Sábado
}
```

---

### 9. 🏥 **CONVÊNIOS/PLANOS DE SAÚDE** (2 ferramentas) 🆕

#### `list_convenios` - Listar convênios
```javascript
{
  limit: 10,
  descricao: "Unimed",
  ativo: 1
}
```

#### `get_convenio` - Obter convênio
```javascript
{ id: "1" }
```

---

### 10. 🔬 **SERVIÇOS MÉDICOS** (2 ferramentas) 🆕

#### `list_servicos` - Listar serviços
```javascript
{
  limit: 10,
  descricao: "Consulta",
  especialidade: 5,
  ativo: 1
}
```

#### `get_servico` - Obter serviço
```javascript
{ id: "1" }
```

---

### 11. 🏦 **CONTAS BANCÁRIAS** (2 ferramentas) 🆕

#### `list_contas` - Listar contas
```javascript
{
  limit: 10,
  ativo: 1
}
```

#### `get_conta_saldo` - Saldo das contas
```javascript
{} // Sem parâmetros
```

---

### 12. 📦 **FORNECEDORES** (2 ferramentas) 🆕

#### `list_fornecedores` - Listar fornecedores
```javascript
{
  limit: 10,
  nomeFantasia: "Farmácia ABC",
  ativo: 1
}
```

#### `create_fornecedor` - Criar fornecedor
```javascript
{
  nomeFantasia: "Farmácia Nova",
  telefone: "(31) 3333-4444",
  email: "contato@farmacia.com",
  cnpj: "12.345.678/0001-99"
}
```

---

### 13. 🏷️ **CATEGORIAS FINANCEIRAS** (2 ferramentas) 🆕

- `list_categorias_receita` - Categorias de receita
- `list_categorias_despesa` - Categorias de despesa

---

### 14. 📈 **RELATÓRIOS AVANÇADOS** (4 ferramentas) 🆕

#### `get_tipo_pagamento_report` - Por tipo de pagamento
Ver distribuição de receitas por forma de pagamento (Pix, cartão, dinheiro, etc.)

#### `get_inadimplencia_report` - Inadimplência
Identificar pagamentos atrasados e em aberto.

#### `get_profissional_report` - Por profissional
Receitas geradas por cada médico/dentista.

#### `get_convenio_report` - Por convênio
Receitas por plano de saúde.

```javascript
// Todos os relatórios usam:
{
  dataInicial: "2026-02-01",
  dataFinal: "2026-02-28",
  accountUnidade: 1 // opcional
}
```

---

### 15. 📝 **PRONTUÁRIOS MÉDICOS** (3 ferramentas) 🆕

- `list_prontuarios` - Listar prontuários
- `get_prontuario` - Obter prontuário
- `create_prontuario` - Criar prontuário

---

### 16. 📊 **PRODUTOS/ESTOQUE** (2 ferramentas) 🆕

- `list_produtos` - Listar produtos
- `get_produto_estoque` - Nível de estoque

---

## 💡 Exemplos de Uso

### Dashboard Financeiro Completo
```javascript
const periodo = {
  dataInicial: "2026-02-01",
  dataFinal: "2026-02-28",
  accountUnidade: 1
};

// Obter todos os dados
const dashboard = {
  // Saldos
  saldos: await get_conta_saldo({}),
  
  // Fluxo de caixa
  fluxoCaixa: await get_fluxo_caixa_report(periodo),
  
  // Análises
  receitasPorCategoria: await get_categoria_receita_report(periodo),
  despesasPorCategoria: await get_categoria_despesa_report(periodo),
  receitasPorTipoPagamento: await get_tipo_pagamento_report(periodo),
  receitasPorProfissional: await get_profissional_report(periodo),
  receitasPorConvenio: await get_convenio_report(periodo),
  inadimplencia: await get_inadimplencia_report(periodo)
};
```

### Sistema de Agendamento
```javascript
// 1. Listar profissionais disponíveis
const profissionais = await list_profissionais({
  especialidade: 5,
  ativo: 1
});

// 2. Ver agenda do profissional
const agenda = await list_profissional_agenda({
  profissional: profissionais.result[0].id,
  diaSemana: 1 // Segunda-feira
});

// 3. Criar agendamento
const agendamento = await create_agendamento({
  accountUnidade: 1,
  profissional: profissionais.result[0].id,
  data: "2026-02-17",
  horaInicial: "14:00:00",
  horaFinal: "14:30:00",
  paciente: 123,
  servico: 1,
  especialidade: 5,
  status: 2 // Confirmado
});
```

---

## 🧪 Testes

### Teste Completo (39 ferramentas)
```bash
node test-39-tools.js
```

### Testes Individuais
```bash
node test-financial.js        # Módulo financeiro
node test-new-features.js     # Modelos e relatórios
node test-all-tools.js        # Teste das 16 primeiras ferramentas
```

---

## 📁 Documentação Adicional

- `FUNCIONALIDADES.md` - Detalhes dos formulários
- `FINANCEIRO.md` - Guia completo do módulo financeiro
- `MODELOS_E_RELATORIOS.md` - Documentação de modelos e relatórios
- `SUGESTOES_NOVAS_FERRAMENTAS.md` - Análise das 23 novas ferramentas
- `RESUMO_COMPLETO.md` - Resumo executivo do projeto

---

## 🎯 Status do Projeto

```
✅ 39 ferramentas implementadas
✅ 100% testado e funcional
✅ Documentação completa
✅ Autenticação automática com refresh token
✅ Gestão completa de clínicas médicas
```

### Cobertura da API Ninsaúde
- **Ferramentas disponíveis**: 39
- **Endpoints utilizados**: ~50
- **Cobertura estimada**: 50% da API do Ninsaúde

---

## 🔐 Autenticação

O servidor gerencia automaticamente:
- Token OAuth2
- Renovação automática (a cada 14 minutos)
- Refresh token configurado no `.env`

---

## 🏆 Conquistas

- ✅ **16 ferramentas iniciais** - Pacientes, Agendamentos, Formulários, Financeiro, Relatórios
- ✅ **23 novas ferramentas** - Profissionais, Convênios, Serviços, Contas, Fornecedores, Categorias, Relatórios Avançados, Prontuários, Estoque
- ✅ **100% de testes passando**
- ✅ **Documentação completa e exemplos práticos**

---

## 📞 Suporte

Para mais informações sobre a API do Ninsaúde, consulte a documentação oficial.

**Versão**: 2.0.0  
**Data**: Fevereiro 2026  
**Status**: ✅ Produção - 39 Ferramentas Ativas

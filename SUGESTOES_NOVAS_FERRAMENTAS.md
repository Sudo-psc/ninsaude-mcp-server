# Sugestões de Novas Ferramentas para o Ninsaúde MCP Server

## 📋 Análise da API e Oportunidades

Após análise completa da coleção Postman do Ninsaúde, aqui estão as **sugestões de ferramentas mais úteis** organizadas por prioridade e caso de uso.

---

## 🌟 PRIORIDADE ALTA - Ferramentas Essenciais

### 1. **Gestão de Profissionais de Saúde** (3 ferramentas)

#### 1.1 `list_profissionais` - Listar profissionais
**Por que é útil**: Essencial para listar médicos/dentistas da clínica
**Endpoint**: `/cadastroprofissional/listar`
**Parâmetros**:
- `limit`, `offset` - Paginação
- `nome` - Filtrar por nome
- `especialidade` - Filtrar por especialidade
- `ativo` - Somente ativos (0 ou 1)
- `accountUnidade` - Filtrar por unidade

**Casos de uso**:
- Listar médicos disponíveis para agendamento
- Buscar profissional por nome ou especialidade
- Dashboard de profissionais ativos

#### 1.2 `get_profissional` - Obter detalhes do profissional
**Por que é útil**: Ver informações completas (CRM, especialidades, horários, etc.)
**Endpoint**: `/cadastroprofissional/{id}`

#### 1.3 `list_profissional_agenda` - Listar grade de horários do profissional
**Por que é útil**: Ver disponibilidade de agenda
**Endpoint**: `/cadastroprofissionalhorario/listar`
**Parâmetros**:
- `profissional[]` - IDs dos profissionais
- `diaSemana` - Dia da semana (0-6)

---

### 2. **Gestão de Convênios** (2 ferramentas)

#### 2.1 `list_convenios` - Listar convênios/planos de saúde
**Por que é útil**: Gerenciar planos aceitos pela clínica
**Endpoint**: `/cadastroconvenio/listar`
**Parâmetros**:
- `limit`, `offset`
- `descricao` - Nome do convênio
- `ativo` - Somente ativos

**Casos de uso**:
- Verificar convênios aceitos
- Criar agendamento com convênio específico
- Relatórios por convênio

#### 2.2 `get_convenio` - Obter detalhes do convênio
**Por que é útil**: Ver detalhes de cobertura, carência, etc.
**Endpoint**: `/cadastroconvenio/{id}`

---

### 3. **Gestão de Serviços Médicos** (2 ferramentas)

#### 3.1 `list_servicos` - Listar serviços/procedimentos
**Por que é útil**: Ver procedimentos oferecidos pela clínica
**Endpoint**: `/cadastroservico/listar`
**Parâmetros**:
- `limit`, `offset`
- `descricao` - Nome do serviço
- `especialidade` - Filtrar por especialidade
- `ativo` - Somente ativos

**Casos de uso**:
- Catálogo de serviços
- Criar agendamento com serviço específico
- Tabela de preços

#### 3.2 `get_servico` - Obter detalhes do serviço
**Por que é útil**: Ver preço, duração, descrição completa
**Endpoint**: `/cadastroservico/{id}`

---

### 4. **Gestão de Contas Bancárias** (2 ferramentas)

#### 4.1 `list_contas` - Listar contas bancárias
**Por que é útil**: Ver contas disponíveis para transações
**Endpoint**: `/fluxo_conta/listar`
**Parâmetros**:
- `limit`, `offset`
- `descricao` - Nome da conta
- `ativo` - Somente ativas

**Casos de uso**:
- Selecionar conta para receitas/despesas
- Dashboard financeiro
- Conciliação bancária

#### 4.2 `get_conta_saldo` - Obter saldo da conta
**Por que é útil**: Ver saldo atual de cada conta
**Endpoint**: `/fluxo_grafico/listar/conta/saldo`

---

## 🎯 PRIORIDADE MÉDIA - Ferramentas Muito Úteis

### 5. **Gestão de Fornecedores** (2 ferramentas)

#### 5.1 `list_fornecedores` - Listar fornecedores
**Por que é útil**: Gerenciar fornecedores para despesas
**Endpoint**: `/cadastrofornecedor/listar`
**Parâmetros**:
- `limit`, `offset`
- `nomeFantasia` - Nome do fornecedor
- `cnpj` - Filtrar por CNPJ
- `ativo` - Somente ativos

#### 5.2 `create_fornecedor` - Criar fornecedor
**Por que é útil**: Adicionar novos fornecedores
**Parâmetros obrigatórios**:
- `nomeFantasia` - Nome do fornecedor
- `cnpj` ou `cpf` - Documento
- `telefone`, `email`

---

### 6. **Categorias Financeiras** (2 ferramentas)

#### 6.1 `list_categorias_receita` - Listar categorias de receitas
**Por que é útil**: Organizar receitas por categoria
**Endpoint**: `/fluxo_categoriareceita/listar`

#### 6.2 `list_categorias_despesa` - Listar categorias de despesas
**Por que é útil**: Organizar despesas por categoria
**Endpoint**: `/fluxo_categoriadespesa/listar`

---

### 7. **Relatórios Adicionais** (4 ferramentas)

#### 7.1 `get_tipo_pagamento_report` - Receitas por tipo de pagamento
**Por que é útil**: Ver distribuição (Pix, cartão, dinheiro, etc.)
**Endpoint**: `/fluxo_grafico/listar/tipoDePagamento/dataInicial/{dataInicial}/dataFinal/{dataFinal}`

**Retorno exemplo**:
```json
{
  "result": [
    { "descricao": "Pix", "receita": 15000 },
    { "descricao": "Cartão de Crédito", "receita": 8000 },
    { "descricao": "Dinheiro", "receita": 2000 }
  ]
}
```

#### 7.2 `get_inadimplencia_report` - Relatório de inadimplência
**Por que é útil**: Identificar pagamentos atrasados
**Endpoint**: `/fluxo_grafico/listar/inadimplencia/dataInicial/{dataInicial}/dataFinal/{dataFinal}`

#### 7.3 `get_profissional_report` - Receitas por profissional
**Por que é útil**: Performance de cada médico/dentista
**Endpoint**: `/fluxo_grafico/listar/profissional/dataInicial/{dataInicial}/dataFinal/{dataFinal}`

#### 7.4 `get_convenio_report` - Receitas por convênio
**Por que é útil**: Análise de convênios mais rentáveis
**Endpoint**: `/fluxo_grafico/listar/convenio/dataInicial/{dataInicial}/dataFinal/{dataFinal}`

---

### 8. **Criação de Agendamentos** (1 ferramenta)

#### 8.1 `create_agendamento` - Criar novo agendamento
**Por que é útil**: Agendar consultas via API
**Endpoint**: `/atendimento_agenda` (POST)
**Parâmetros obrigatórios**:
- `accountUnidade` - ID da unidade
- `profissional` - ID do profissional
- `data` - Data (YYYY-MM-DD)
- `horaInicial` - Hora inicial (HH:MM:SS)
- `horaFinal` - Hora final (HH:MM:SS)
- `paciente` - ID do paciente
- `servico` - ID do serviço
- `especialidade` - ID da especialidade
- `status` - Status (0=Agendado, 2=Confirmado, etc.)

**Casos de uso**:
- Sistema de agendamento online
- Integração com WhatsApp/chatbots
- Encaixe de pacientes

---

## 💡 PRIORIDADE BAIXA - Ferramentas Especializadas

### 9. **Prontuários Médicos** (3 ferramentas)

#### 9.1 `list_prontuarios` - Listar prontuários
**Por que é útil**: Ver histórico de atendimentos
**Endpoint**: `/prontuario_prontuario/listar`

#### 9.2 `get_prontuario` - Obter prontuário específico
**Por que é útil**: Ver detalhes do atendimento

#### 9.3 `create_prontuario` - Criar novo prontuário
**Por que é útil**: Registrar atendimentos

---

### 10. **Estoque/Produtos** (2 ferramentas)

#### 10.1 `list_produtos` - Listar produtos
**Por que é útil**: Gerenciar estoque de medicamentos/materiais
**Endpoint**: `/cadastroproduto/listar`

#### 10.2 `get_produto_estoque` - Obter nível de estoque
**Por que é útil**: Controle de inventário

---

## 📊 Resumo por Prioridade

### 🌟 ALTA (13 ferramentas - Implementar primeiro)
1. **Profissionais** (3): list, get, agenda
2. **Convênios** (2): list, get
3. **Serviços** (2): list, get
4. **Contas** (2): list, saldo
5. **Fornecedores** (2): list, create
6. **Categorias** (2): receitas, despesas

### 🎯 MÉDIA (5 ferramentas - Implementar em seguida)
7. **Relatórios** (4): tipo pagamento, inadimplência, profissional, convênio
8. **Agendamentos** (1): create

### 💡 BAIXA (5 ferramentas - Implementar se necessário)
9. **Prontuários** (3): list, get, create
10. **Estoque** (2): list produtos, get estoque

---

## 🎯 Roadmap Sugerido

### Fase 1: Cadastros Básicos (Sprint 1)
```
✅ Pacientes (já implementado)
🆕 Profissionais (3 ferramentas)
🆕 Convênios (2 ferramentas)
🆕 Serviços (2 ferramentas)
```
**Total**: 7 novas ferramentas
**Impacto**: Alto - Permite gestão completa de recursos

### Fase 2: Financeiro Avançado (Sprint 2)
```
✅ Receitas/Despesas (já implementado)
✅ Relatórios básicos (já implementado)
🆕 Contas bancárias (2 ferramentas)
🆕 Fornecedores (2 ferramentas)
🆕 Categorias (2 ferramentas)
🆕 Relatórios avançados (4 ferramentas)
```
**Total**: 10 novas ferramentas
**Impacto**: Alto - Dashboard financeiro completo

### Fase 3: Operacional (Sprint 3)
```
✅ Agendamentos list (já implementado)
🆕 Agendamento create (1 ferramenta)
🆕 Prontuários (3 ferramentas)
```
**Total**: 4 novas ferramentas
**Impacto**: Médio - Operação clínica completa

### Fase 4: Estoque (Sprint 4)
```
🆕 Produtos/Estoque (2 ferramentas)
```
**Total**: 2 novas ferramentas
**Impacto**: Baixo - Controle de inventário

---

## 🔥 TOP 5 Ferramentas Mais Úteis (Por Demanda)

### 1️⃣ `create_agendamento` ⭐⭐⭐⭐⭐
**Por quê**: Automação de agendamentos é uma das principais necessidades
**Casos de uso**:
- Agendamento online via site
- Integração com WhatsApp
- Sistema de lembretes automáticos

### 2️⃣ `list_profissionais` ⭐⭐⭐⭐⭐
**Por quê**: Base para qualquer sistema de agendamento
**Casos de uso**:
- Mostrar médicos disponíveis
- Filtrar por especialidade
- Grade de horários

### 3️⃣ `get_inadimplencia_report` ⭐⭐⭐⭐
**Por quê**: Gestão financeira crítica para clínicas
**Casos de uso**:
- Identificar devedores
- Campanhas de cobrança
- Previsão de caixa

### 4️⃣ `list_contas` + `get_conta_saldo` ⭐⭐⭐⭐
**Por quê**: Visão consolidada de todas as contas
**Casos de uso**:
- Dashboard financeiro
- Decisões de investimento
- Conciliação bancária

### 5️⃣ `get_tipo_pagamento_report` ⭐⭐⭐⭐
**Por quê**: Análise de preferências de pagamento
**Casos de uso**:
- Otimizar formas de pagamento
- Reduzir taxas
- Melhorar conversão

---

## 💼 Exemplos de Uso Práticos

### Exemplo 1: Sistema de Agendamento Completo
```javascript
// 1. Listar profissionais disponíveis
const profissionais = await list_profissionais({
  especialidade: 'Oftalmologia',
  ativo: 1
});

// 2. Ver agenda do profissional
const agenda = await list_profissional_agenda({
  profissional: [profissionais[0].id],
  diaSemana: 1 // Segunda-feira
});

// 3. Criar agendamento
const agendamento = await create_agendamento({
  accountUnidade: 1,
  profissional: profissionais[0].id,
  data: '2026-02-17',
  horaInicial: '14:00:00',
  horaFinal: '14:30:00',
  paciente: 123,
  servico: 1,
  especialidade: 5,
  status: 2 // Confirmado
});
```

### Exemplo 2: Dashboard Financeiro Completo
```javascript
// 1. Saldo das contas
const contas = await list_contas({ ativo: 1 });
const saldos = await get_conta_saldo();

// 2. Relatórios do mês
const periodo = {
  dataInicial: '2026-02-01',
  dataFinal: '2026-02-28'
};

const dashboard = {
  fluxoCaixa: await get_fluxo_caixa_report(periodo),
  tiposPagamento: await get_tipo_pagamento_report(periodo),
  inadimplencia: await get_inadimplencia_report(periodo),
  porProfissional: await get_profissional_report(periodo),
  porConvenio: await get_convenio_report(periodo),
  saldos: saldos
};
```

### Exemplo 3: Gestão de Fornecedores
```javascript
// 1. Criar fornecedor
const fornecedor = await create_fornecedor({
  nomeFantasia: 'Farmácia ABC',
  cnpj: '12.345.678/0001-99',
  telefone: '(31) 3333-4444',
  email: 'contato@farmaabc.com'
});

// 2. Criar despesa vinculada
const despesa = await create_despesa({
  accountUnidade: 1,
  conta: 3,
  categoria: 2, // Suprimentos
  fornecedor: fornecedor.result,
  tipoPagto: 7, // Pix
  dataVencto: '2026-02-28',
  dataEmissao: '2026-02-14',
  valor: 850.00,
  valorTotal: 850.00,
  pago: 0, // Não pago ainda
  observacao: 'Compra de materiais'
});
```

---

## 🎬 Próximos Passos Recomendados

1. **Implementar Fase 1 (Cadastros Básicos)** 
   - Foco em `list_profissionais`, `list_convenios`, `list_servicos`
   - Enabler para outras funcionalidades

2. **Testar com Casos de Uso Reais**
   - Criar scripts de exemplo
   - Validar com dados da clínica

3. **Documentar Padrões**
   - Estrutura consistente
   - Tratamento de erros
   - Validações

4. **Expandir Gradualmente**
   - Seguir roadmap sugerido
   - Priorizar por necessidade real
   - Manter 100% de testes passando

---

**Total de Ferramentas Sugeridas**: 23 novas ferramentas
**Atual**: 16 ferramentas
**Futuro**: 39 ferramentas totais

Com estas implementações, o servidor MCP do Ninsaúde se tornaria uma **plataforma completa** para gestão de clínicas médicas! 🏥💻

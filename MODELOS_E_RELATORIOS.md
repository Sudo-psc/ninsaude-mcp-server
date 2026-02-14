# Ninsaúde MCP Server - Modelos de Documentos e Relatórios

## ✅ Novas Ferramentas Implementadas (4 total)

### 📄 Modelos de Documentos (Document Templates)

#### 1. **list_document_modelos** - Listar modelos de documentos
Lista modelos de documentos médicos disponíveis no sistema.

**Parâmetros:**
- `limit` (opcional): Número máximo de resultados
- `offset` (opcional): Offset para paginação
- `descricao` (opcional): Filtro por descrição
- `tipo` (opcional): Tipo de documento
  - `0` = Receituário (Prescription)
  - `1` = Atestado (Certificate)
  - `2` = Resultado de exames (Exam results)
  - `3` = Outros (Others)
  - `4` = Recibos (Receipts)
- `lingua` (opcional): Idioma do modelo (ex: "pt-BR")

**Exemplo de uso:**
```javascript
await list_document_modelos({
  limit: 10,
  lingua: "pt-BR",
  tipo: 0 // Receituários
});
```

**Retorno inclui:**
- ID do modelo
- Descrição
- Tipo de documento
- Idioma
- Conteúdo do modelo (HTML/texto)

---

## 📊 Relatórios Financeiros (Financial Reports)

### 2. **get_fluxo_caixa_report** - Relatório de fluxo de caixa
Retorna dados de receitas e despesas por período para análise de fluxo de caixa.

**Parâmetros obrigatórios:**
- `dataInicial` (string): Data inicial YYYY-MM-DD
- `dataFinal` (string): Data final YYYY-MM-DD

**Parâmetros opcionais:**
- `accountUnidade` (number): ID da unidade de atendimento
- `conta` (number): ID da conta bancária

**Exemplo de uso:**
```javascript
await get_fluxo_caixa_report({
  dataInicial: "2026-02-01",
  dataFinal: "2026-02-28",
  accountUnidade: 1
});
```

**Retorno:**
```json
{
  "result": [
    {
      "periodo": "2026-02-01",
      "receita": 14260,
      "despesa": 16740
    }
  ]
}
```

---

### 3. **get_categoria_receita_report** - Relatório de receitas por categoria
Agrupa receitas por categoria financeira no período especificado.

**Parâmetros obrigatórios:**
- `dataInicial` (string): Data inicial YYYY-MM-DD
- `dataFinal` (string): Data final YYYY-MM-DD

**Parâmetros opcionais:**
- `accountUnidade` (number): ID da unidade de atendimento

**Exemplo de uso:**
```javascript
await get_categoria_receita_report({
  dataInicial: "2026-02-01",
  dataFinal: "2026-02-28",
  accountUnidade: 1
});
```

**Retorno:**
```json
{
  "result": [
    {
      "descricao": "Amor e Saúde",
      "receita": 7300
    },
    {
      "descricao": "Recebimentos",
      "receita": 6960
    }
  ]
}
```

---

### 4. **get_categoria_despesa_report** - Relatório de despesas por categoria
Agrupa despesas por categoria financeira no período especificado.

**Parâmetros obrigatórios:**
- `dataInicial` (string): Data inicial YYYY-MM-DD
- `dataFinal` (string): Data final YYYY-MM-DD

**Parâmetros opcionais:**
- `accountUnidade` (number): ID da unidade de atendimento

**Exemplo de uso:**
```javascript
await get_categoria_despesa_report({
  dataInicial: "2026-02-01",
  dataFinal: "2026-02-28",
  accountUnidade: 1
});
```

**Retorno:**
```json
{
  "result": [
    {
      "descricao": "Impostos",
      "despesa": 1500
    },
    {
      "descricao": "Infraestrutura",
      "despesa": 6200
    },
    {
      "descricao": "Outras despesas",
      "despesa": 9040
    }
  ]
}
```

---

## 🧪 Testes Realizados

### Teste 1: Listagem de Modelos de Documentos ✅
```
Parâmetros: limit=5, lingua="pt-BR"
Resultado: Lista de modelos disponíveis retornada com sucesso
```

### Teste 2: Relatório de Fluxo de Caixa ✅
```
Período: 2026-02-01 a 2026-02-14
Resultado: 
  - Receitas: R$ 14.260,00
  - Despesas: R$ 16.740,00
  - Saldo: -R$ 2.480,00
```

### Teste 3: Relatório de Receitas por Categoria ✅
```
Período: 2026-02-01 a 2026-02-14
Resultado: 
  - Amor e Saúde: R$ 7.300,00
  - Recebimentos: R$ 6.960,00
  Total: R$ 14.260,00
```

### Teste 4: Relatório de Despesas por Categoria ✅
```
Período: 2026-02-01 a 2026-02-14
Resultado: 
  - Impostos: R$ 1.500,00
  - Infraestrutura: R$ 6.200,00
  - Outras despesas: R$ 9.040,00
  Total: R$ 16.740,00
```

---

## 📈 Total de Ferramentas Disponíveis: **16**

### Por Módulo:
- **Pacientes**: 2 ferramentas (list, get)
- **Agendamentos**: 1 ferramenta (list)
- **Formulários de Pesquisa**: 5 ferramentas (list, get, create, update, delete)
- **Receitas**: 2 ferramentas (list, create)
- **Despesas**: 2 ferramentas (list, create)
- **Modelos de Documentos**: 1 ferramenta (list) 🆕
- **Relatórios Financeiros**: 3 ferramentas (fluxo de caixa, receitas por categoria, despesas por categoria) 🆕

---

## 💡 Casos de Uso

### 1. Análise Financeira Mensal
```javascript
// Obter relatório completo do mês
const hoje = new Date();
const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
const dataInicial = primeiroDia.toISOString().split('T')[0];
const dataFinal = hoje.toISOString().split('T')[0];

// Fluxo de caixa
const fluxo = await get_fluxo_caixa_report({
  dataInicial,
  dataFinal,
  accountUnidade: 1
});

// Receitas detalhadas
const receitas = await get_categoria_receita_report({
  dataInicial,
  dataFinal,
  accountUnidade: 1
});

// Despesas detalhadas
const despesas = await get_categoria_despesa_report({
  dataInicial,
  dataFinal,
  accountUnidade: 1
});
```

### 2. Preparar Documentos para Consulta
```javascript
// Buscar modelo de receituário em português
const receituarios = await list_document_modelos({
  tipo: 0, // Receituário
  lingua: "pt-BR",
  limit: 10
});

// Buscar modelos de atestado
const atestados = await list_document_modelos({
  tipo: 1, // Atestado
  lingua: "pt-BR"
});
```

### 3. Dashboard Financeiro
```javascript
// Criar dados para dashboard mensal
const periodo = {
  dataInicial: "2026-02-01",
  dataFinal: "2026-02-28",
  accountUnidade: 1
};

const dados = {
  fluxoCaixa: await get_fluxo_caixa_report(periodo),
  receitasPorCategoria: await get_categoria_receita_report(periodo),
  despesasPorCategoria: await get_categoria_despesa_report(periodo)
};

// Calcular totais
const totalReceitas = dados.receitasPorCategoria.result.reduce(
  (sum, cat) => sum + cat.receita, 0
);
const totalDespesas = dados.despesasPorCategoria.result.reduce(
  (sum, cat) => sum + cat.despesa, 0
);
const saldo = totalReceitas - totalDespesas;
```

---

## ⚠️ Observações Importantes

### Modelos de Documentos:
1. **Idioma**: Use "pt-BR" para português brasileiro
2. **Tipos**: Sempre use os códigos numéricos (0-4)
3. **Personalização**: Os modelos retornados podem conter variáveis para substituição

### Relatórios Financeiros:
1. **Datas**: Sempre use o formato YYYY-MM-DD
2. **Período**: Recomendado usar períodos de até 12 meses
3. **Unidade**: Filtrar por `accountUnidade` para relatórios por clínica/filial
4. **Valores**: Todos os valores são retornados em reais (BRL)

---

## 🚀 Próximas Funcionalidades Sugeridas

### Modelos de Documentos:
- [ ] Criar novo modelo de documento
- [ ] Atualizar modelo existente
- [ ] Obter detalhes de um modelo específico
- [ ] Duplicar modelo

### Relatórios:
- [ ] Relatório por tipo de pagamento (Pix, cartão, dinheiro)
- [ ] Relatório de inadimplência
- [ ] Relatório por profissional
- [ ] Relatório por convênio
- [ ] Saldo de contas bancárias
- [ ] Relatório de ticket médio por paciente
- [ ] Balanço anual

### Agendamentos:
- [ ] Criar novo agendamento
- [ ] Atualizar agendamento
- [ ] Cancelar agendamento
- [ ] Listar horários disponíveis

---

## 📝 Exemplo Completo de Uso

```javascript
// 1. Listar modelos de receituário disponíveis
const modelos = await list_document_modelos({
  tipo: 0,
  lingua: "pt-BR",
  limit: 5
});

// 2. Análise financeira do mês atual
const dataInicial = "2026-02-01";
const dataFinal = "2026-02-28";

const fluxoCaixa = await get_fluxo_caixa_report({
  dataInicial,
  dataFinal,
  accountUnidade: 1
});

const receitas = await get_categoria_receita_report({
  dataInicial,
  dataFinal,
  accountUnidade: 1
});

const despesas = await get_categoria_despesa_report({
  dataInicial,
  dataFinal,
  accountUnidade: 1
});

// 3. Processar os dados para um dashboard
const resumoFinanceiro = {
  periodo: { dataInicial, dataFinal },
  fluxoCaixa: fluxoCaixa.result,
  categorias: {
    receitas: receitas.result,
    despesas: despesas.result
  },
  totais: {
    receitas: receitas.result.reduce((sum, cat) => sum + cat.receita, 0),
    despesas: despesas.result.reduce((sum, cat) => sum + cat.despesa, 0)
  }
};

resumoFinanceiro.totais.saldo = 
  resumoFinanceiro.totais.receitas - resumoFinanceiro.totais.despesas;

console.log('Resumo Financeiro:', resumoFinanceiro);
```

---

**Documentação completa**: Consulte o README.md e os arquivos FUNCIONALIDADES.md e FINANCEIRO.md para mais detalhes sobre outras ferramentas disponíveis.

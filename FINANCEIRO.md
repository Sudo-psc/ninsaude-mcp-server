# Ninsaúde MCP Server - Módulo Financeiro

## ✅ Ferramentas Financeiras Implementadas (4 total)

### 💰 Receitas/Recebimentos (Receivables - fluxo_receita)

#### 1. **list_receitas** - Listar receitas/recebimentos
Lista todas as receitas com filtros opcionais.

**Parâmetros:**
- `limit` (opcional): Número máximo de resultados
- `offset` (opcional): Offset para paginação
- `dataVencimentoInicial` (opcional): Data inicial de vencimento (YYYY-MM-DD)
- `dataVencimentoFinal` (opcional): Data final de vencimento (YYYY-MM-DD)
- `dataPagamentoInicial` (opcional): Data inicial de pagamento (YYYY-MM-DD)
- `dataPagamentoFinal` (opcional): Data final de pagamento (YYYY-MM-DD)
- `paciente` (opcional): Filtrar por ID do paciente

**Exemplo de uso:**
```javascript
list_receitas({
  limit: 10,
  dataVencimentoInicial: "2026-02-01",
  dataVencimentoFinal: "2026-02-28"
})
```

**Retorno inclui:**
- ID da receita
- Unidade de atendimento
- Paciente (se aplicável)
- Conta bancária
- Categoria e subcategoria
- Tipo de pagamento (Dinheiro, Pix, Cartão, etc.)
- Valor, valor total, juros, multa, desconto
- Datas: vencimento, emissão, pagamento
- Status de pagamento
- Observações

#### 2. **create_receita** - Criar nova receita/recebimento
Cria um novo registro de recebimento no sistema financeiro.

**Parâmetros obrigatórios:**
- `accountUnidade` (number): ID da unidade de atendimento
- `conta` (number): ID da conta bancária
- `categoria` (number): ID da categoria (ex: 4 = Recebimentos)
- `tipoPagto` (number): ID do tipo de pagamento
  - 3 = Cartão de Crédito
  - 5 = Dinheiro
  - 6 = Transferência
  - 7 = Pix
- `dataVencto` (string): Data de vencimento (YYYY-MM-DD)
- `dataEmissao` (string): Data de emissão (YYYY-MM-DD)
- `valor` (number): Valor da receita
- `valorTotal` (number): Valor total (geralmente igual ao valor)
- `recibo` (number): Tipo de recibo
  - 0 = Usar bloco de recibos
  - 1 = Imprimir em nome do profissional
  - 2 = Imprimir em nome da clínica
- `pago` (number): Status de pagamento
  - 0 = Não pago
  - 1 = Pago

**Parâmetros opcionais:**
- `paciente` (number): ID do paciente
- `dataPagamento` (string): Data do pagamento (YYYY-MM-DD)
- `observacao` (string): Observações adicionais

**Exemplo de uso:**
```javascript
create_receita({
  accountUnidade: 1,
  conta: 1, // Caixinha
  categoria: 4, // Recebimentos
  tipoPagto: 5, // Dinheiro
  dataVencto: "2026-02-14",
  dataEmissao: "2026-02-14",
  dataPagamento: "2026-02-14",
  valor: 150.00,
  valorTotal: 150.00,
  recibo: 2, // Nome da clínica
  pago: 1, // Pago
  observacao: "Consulta oftalmológica"
})
```

**Retorna**: ID da receita criada

---

### 💸 Despesas/Pagamentos (Expenses - fluxo_despesa)

#### 3. **list_despesas** - Listar despesas/pagamentos
Lista todas as despesas com filtros opcionais.

**Parâmetros:**
- `limit` (opcional): Número máximo de resultados
- `offset` (opcional): Offset para paginação
- `dataVencimentoInicial` (opcional): Data inicial de vencimento (YYYY-MM-DD)
- `dataVencimentoFinal` (opcional): Data final de vencimento (YYYY-MM-DD)
- `dataPagamentoInicial` (opcional): Data inicial de pagamento (YYYY-MM-DD)
- `dataPagamentoFinal` (opcional): Data final de pagamento (YYYY-MM-DD)
- `fornecedor` (opcional): Filtrar por ID do fornecedor

**Exemplo de uso:**
```javascript
list_despesas({
  limit: 10,
  dataVencimentoInicial: "2026-02-01",
  dataVencimentoFinal: "2026-02-28"
})
```

**Retorno inclui:**
- ID da despesa
- Unidade de atendimento
- Fornecedor (se aplicável)
- Conta bancária
- Categoria e subcategoria
- Tipo de pagamento
- Valor, valor total, juros, multa, desconto
- Datas: vencimento, emissão, pagamento
- Status de pagamento
- Observações

#### 4. **create_despesa** - Criar nova despesa/pagamento
Cria um novo registro de pagamento no sistema financeiro.

**Parâmetros obrigatórios:**
- `accountUnidade` (number): ID da unidade de atendimento
- `conta` (number): ID da conta bancária
- `categoria` (number): ID da categoria (ex: 2 = Infraestrutura, 3 = Outras despesas)
- `tipoPagto` (number): ID do tipo de pagamento
  - 3 = Cartão de Crédito
  - 5 = Dinheiro
  - 6 = Transferência
  - 7 = Pix
- `dataVencto` (string): Data de vencimento (YYYY-MM-DD)
- `dataEmissao` (string): Data de emissão (YYYY-MM-DD)
- `valor` (number): Valor da despesa
- `valorTotal` (number): Valor total (geralmente igual ao valor)
- `pago` (number): Status de pagamento
  - 0 = Não pago
  - 1 = Pago

**Parâmetros opcionais:**
- `fornecedor` (number): ID do fornecedor
- `dataPagamento` (string): Data do pagamento (YYYY-MM-DD)
- `observacao` (string): Observações adicionais

**Exemplo de uso:**
```javascript
create_despesa({
  accountUnidade: 1,
  conta: 3, // Inter
  categoria: 3, // Outras despesas
  tipoPagto: 7, // Pix
  dataVencto: "2026-02-14",
  dataEmissao: "2026-02-14",
  dataPagamento: "2026-02-14",
  valor: 200.00,
  valorTotal: 200.00,
  pago: 1, // Pago
  observacao: "Assinatura software"
})
```

**Retorna**: ID da despesa criada

---

## 🧪 Testes Realizados

### Teste 1: Listagem de Receitas ✅
```
Resultado: 3 receitas recentes listadas com sucesso
- Receita #166: R$ 150,00 (Cartão de Crédito)
- Receita #165: R$ 100,00 (Dinheiro)
- Receita #164: R$ 300,00 (Pix)
```

### Teste 2: Listagem de Despesas ✅
```
Resultado: 3 despesas recentes listadas com sucesso
- Despesa #96: R$ 1.700,00 (Marketing)
- Despesa #93: R$ 200,00 (Ninsaúde PEP)
- Despesa #95: R$ 400,00 (Viagem)
```

### Teste 3: Criação de Receita ✅
```
Dados: R$ 50,00 - Dinheiro - Caixinha
Resultado: Receita #167 criada com sucesso
Confirmação: Aparece na listagem de receitas recentes
```

### Teste 4: Criação de Despesa ✅
```
Dados: R$ 30,00 - Pix - Inter
Resultado: Despesa #99 criada com sucesso
Confirmação: Aparece na listagem de despesas recentes
```

---

## 📊 IDs Comuns (Exemplo - Clínica Saraiva Vision)

### Unidades de Atendimento
- `1`: Clínica Saraiva Vision Oftalmologia (Matriz)

### Contas Bancárias
- `1`: Caixinha
- `3`: Inter

### Categorias de Receitas
- `4`: Recebimentos

### Categorias de Despesas
- `2`: Infraestrutura
- `3`: Outras despesas

### Tipos de Pagamento
- `3`: Cartão de Crédito
- `5`: Dinheiro
- `6`: Transferência
- `7`: Pix

**Nota**: Estes IDs são específicos da instância testada. Use a interface web do Ninsaúde ou a API para obter os IDs corretos para seu ambiente.

---

## 🔐 Autenticação
Todas as requisições utilizam o mesmo sistema de autenticação OAuth2 do servidor MCP:
- Token de acesso renovado automaticamente a cada 14 minutos
- Refresh token configurado no arquivo `.env`

---

## 📈 Total de Ferramentas Disponíveis: **12**

### Por Módulo:
- **Pacientes**: 2 ferramentas (list, get)
- **Agendamentos**: 1 ferramenta (list)
- **Formulários de Pesquisa**: 5 ferramentas (list, get, create, update, delete)
- **Receitas**: 2 ferramentas (list, create) 🆕
- **Despesas**: 2 ferramentas (list, create) 🆕

---

## 🚀 Próximas Funcionalidades Sugeridas

### Módulo Financeiro:
- [ ] Atualizar receita/despesa (update)
- [ ] Excluir receita/despesa (delete)
- [ ] Marcar como pago/não pago
- [ ] Criar duplicatas
- [ ] Fluxo de caixa consolidado
- [ ] Relatórios financeiros por período

### Outros Módulos:
- [ ] Gerenciamento de fornecedores
- [ ] Gerenciamento de categorias financeiras
- [ ] Gerenciamento de contas bancárias
- [ ] Conciliação bancária
- [ ] Emissão de recibos

---

## 📝 Exemplo Completo de Uso

```javascript
// 1. Listar receitas do mês atual
const hoje = new Date();
const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
await list_receitas({
  dataVencimentoInicial: primeiroDia.toISOString().split('T')[0],
  dataVencimentoFinal: hoje.toISOString().split('T')[0],
  limit: 50
});

// 2. Criar uma nova receita
const novaReceita = await create_receita({
  accountUnidade: 1,
  conta: 3, // Inter
  categoria: 4, // Recebimentos
  tipoPagto: 7, // Pix
  dataVencto: "2026-02-14",
  dataEmissao: "2026-02-14",
  dataPagamento: "2026-02-14",
  valor: 280.00,
  valorTotal: 280.00,
  recibo: 2,
  pago: 1,
  paciente: 123, // ID do paciente
  observacao: "Consulta + exames"
});

// 3. Criar uma nova despesa
const novaDespesa = await create_despesa({
  accountUnidade: 1,
  conta: 3, // Inter
  categoria: 2, // Infraestrutura
  tipoPagto: 7, // Pix
  dataVencto: "2026-02-14",
  dataEmissao: "2026-02-14",
  dataPagamento: "2026-02-14",
  valor: 450.00,
  valorTotal: 450.00,
  pago: 1,
  fornecedor: 5, // ID do fornecedor
  observacao: "Licença de software anual"
});

// 4. Listar despesas pendentes (não pagas)
await list_despesas({
  status: 0, // Não pago
  limit: 20
});
```

---

## ⚠️ Observações Importantes

1. **IDs**: Sempre use os IDs corretos da sua instância do Ninsaúde
2. **Datas**: Formato obrigatório YYYY-MM-DD
3. **Valores**: Use números decimais (ex: 150.00, não "150,00")
4. **Status pago**: 0 = Não pago, 1 = Pago
5. **Validação**: A API do Ninsaúde valida todos os campos obrigatórios

---

**Documentação completa**: Consulte o arquivo README.md e a coleção Postman do Ninsaúde para mais detalhes.

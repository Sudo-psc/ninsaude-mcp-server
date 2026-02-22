# 📊 RELATÓRIO DE FATURAMENTO - JANEIRO E FEVEREIRO 2026

**Data de Geração:** 14 de Fevereiro de 2026  
**Status:** Token expirado - Template gerado

---

## ⚠️ IMPORTANTE: Como Gerar o Relatório

O script `generate-billing-report.js` está pronto, mas precisa de um **token de acesso válido**.

### 🔄 Opção 1: Obter Novo Token
1. Faça login no Ninsaúde Clinic
2. Vá em **Configurações → API**
3. Gere um novo token
4. Atualize o `.env`:
   ```env
   NINSAUDE_REFRESH_TOKEN=seu_novo_token_aqui
   ```
5. Execute:
   ```bash
   node generate-billing-report.js
   ```

### 📊 Opção 2: Via Interface Web
1. Acesse **Relatórios → Financeiro → Faturamento**
2. Selecione o período:
   - Data Inicial: `01/01/2026`
   - Data Final: `28/02/2026`
3. Clique em **Gerar Relatório**
4. Exporte em PDF ou Excel

---

## 📋 ESTRUTURA DO RELATÓRIO

O script gera automaticamente:

### 📄 Arquivo TXT (`relatorio-faturamento-jan-fev-2026-YYYY-MM-DD.txt`)
- Formatação para leitura humana
- Divisão por meses
- Consolidado do período
- Estatísticas detalhadas

### 📊 Arquivo JSON (`relatorio-faturamento-jan-fev-2026-YYYY-MM-DD.json`)
- Dados estruturados para análise
- Formato importável
- Integração com outras ferramentas

---

## 📊 MÉTRICAS INCLUÍDAS NO RELATÓRIO

### Por Período (Janeiro e Fevereiro):
- ✅ **Total de Receitas**
  - Quantidade de lançamentos
  - Valor total
  - Receitas pagas vs pendentes
  - Breakdown por tipo de pagamento

- ✅ **Total de Despesas**
  - Quantidade de lançamentos
  - Valor total
  - Categorização

- ✅ **Saldo do Período**
  - Resultado (Receitas - Despesas)
  - Margem percentual

### Consolidado Geral:
- ✅ Totais acumulados de janeiro + fevereiro
- ✅ Saldo consolidado
- ✅ Margem de lucro do bimestre

---

## 📈 EXEMPLO DE SAÍDA (Simulado)

```
════════════════════════════════════════════════════════════════════════════════
              RELATÓRIO DE FATURAMENTO - JANEIRO E FEVEREIRO 2026
════════════════════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────────────────────
  JANEIRO 2026
────────────────────────────────────────────────────────────────────────────────

📊 RESUMO GERAL:
   Total de Receitas: R$ 45.750,00
   Total de Despesas: R$ 18.320,00
   Saldo do Período:  R$ 27.430,00
   Margem:            59.95%

💰 RECEITAS:
   Quantidade:        87 lançamentos
   Pagas:             78 (R$ 42.150,00)
   Pendentes:         9 (R$ 3.600,00)

📈 RECEITAS POR TIPO DE PAGAMENTO:
   Dinheiro                       R$ 12.350,00      (27.0%)
   Cartão de Crédito              R$ 18.750,00      (41.0%)
   Cartão de Débito               R$ 9.450,00       (20.7%)
   PIX                            R$ 5.200,00       (11.4%)

💸 DESPESAS:
   Quantidade:        34 lançamentos
   Total:             R$ 18.320,00

────────────────────────────────────────────────────────────────────────────────
  FEVEREIRO 2026
────────────────────────────────────────────────────────────────────────────────

📊 RESUMO GERAL:
   Total de Receitas: R$ 38.920,00
   Total de Despesas: R$ 15.780,00
   Saldo do Período:  R$ 23.140,00
   Margem:            59.46%

💰 RECEITAS:
   Quantidade:        72 lançamentos
   Pagas:             68 (R$ 37.120,00)
   Pendentes:         4 (R$ 1.800,00)

📈 RECEITAS POR TIPO DE PAGAMENTO:
   Dinheiro                       R$ 10.120,00      (26.0%)
   Cartão de Crédito              R$ 16.890,00      (43.4%)
   Cartão de Débito               R$ 7.450,00       (19.1%)
   PIX                            R$ 4.460,00       (11.5%)

💸 DESPESAS:
   Quantidade:        29 lançamentos
   Total:             R$ 15.780,00

════════════════════════════════════════════════════════════════════════════════
                        CONSOLIDADO JANEIRO + FEVEREIRO
════════════════════════════════════════════════════════════════════════════════

   Total de Receitas: R$ 84.670,00
   Total de Despesas: R$ 34.100,00
   Saldo do Período:  R$ 50.570,00
   Margem:            59.73%

════════════════════════════════════════════════════════════════════════════════
```

---

## 🔍 ANÁLISE POR TIPO DE PAGAMENTO

O relatório quebra as receitas por forma de pagamento:

| Tipo | % Médio | Observação |
|------|---------|------------|
| **Cartão de Crédito** | ~42% | Principal forma de pagamento |
| **Dinheiro** | ~26% | Segunda maior |
| **Cartão de Débito** | ~20% | Terceira posição |
| **PIX** | ~11% | Crescimento esperado |

---

## 📊 INDICADORES FINANCEIROS

### KPIs Principais:
- **Faturamento Médio Mensal:** Calculado automaticamente
- **Taxa de Inadimplência:** % de receitas pendentes
- **Margem de Lucro:** Saldo / Receitas totais
- **Ticket Médio:** Receita total / Número de atendimentos

### Comparativo Mês a Mês:
- Variação percentual entre janeiro e fevereiro
- Tendências de crescimento ou queda
- Análise de sazonalidade

---

## 💡 INSIGHTS E RECOMENDAÇÕES

### Com base nos dados (quando gerado):
1. **Gestão de Recebíveis:**
   - Monitorar receitas pendentes
   - Estratégias de cobrança
   - Análise de inadimplência

2. **Otimização de Custos:**
   - Identificar despesas recorrentes
   - Possíveis reduções
   - Renegociações com fornecedores

3. **Crescimento:**
   - Identificar meses de pico
   - Planejar ações de marketing
   - Ajustar equipe conforme demanda

---

## 🔄 AUTOMAÇÃO DO RELATÓRIO

### Executar Mensalmente:
```bash
# Adicione ao cron (Linux/Mac) ou Agendador de Tarefas (Windows)
# Exemplo: Todo dia 1 às 8h
0 8 1 * * cd /caminho/ninsaude-mcp-server && node generate-billing-report.js
```

### Envio Automático por Email:
Modifique o script para enviar por email:
```javascript
// Adicione ao final do main()
const nodemailer = require('nodemailer');
// Configurar e enviar relatório
```

---

## 📁 ARQUIVOS GERADOS

Quando o script rodar com sucesso, será criado:

1. **`relatorio-faturamento-jan-fev-2026-2026-02-14.txt`**
   - Relatório formatado em texto
   - Fácil leitura e impressão

2. **`relatorio-faturamento-jan-fev-2026-2026-02-14.json`**
   - Dados estruturados
   - Pode ser importado em Excel, Power BI, etc.

---

## ✅ PRÓXIMOS PASSOS

1. ✅ **Renovar Token:** Obter novo token de acesso
2. ✅ **Executar Script:** `node generate-billing-report.js`
3. ✅ **Analisar Dados:** Revisar métricas e KPIs
4. ✅ **Tomar Decisões:** Baseadas nos insights
5. ✅ **Automatizar:** Agendar execução mensal

---

## 🆘 SUPORTE

### Problemas Comuns:

**Erro 401 (Token Inválido):**
- Solução: Renovar token no Ninsaúde Clinic

**Nenhum Dado Retornado:**
- Verificar período selecionado
- Confirmar lançamentos no sistema
- Verificar filtros aplicados

**Erro na Geração de Arquivos:**
- Verificar permissões de escrita
- Confirmar espaço em disco

---

**Script Criado:** `generate-billing-report.js`  
**Documentação Completa:** Este arquivo  
**Status:** Aguardando token válido para execução  

🎯 **Objetivo:** Fornecer visão completa do faturamento de janeiro e fevereiro de 2026

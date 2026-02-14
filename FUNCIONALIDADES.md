# Ninsaúde MCP Server - Resumo de Funcionalidades

## ✅ Ferramentas Implementadas (8 total)

### 📋 Gerenciamento de Pacientes
1. **list_patients** - Lista pacientes com filtros
   - Filtros: `limit`, `offset`, `nomeExato`, `cpf`, `ativo`
   - Retorna lista de pacientes com dados pessoais e de contato

2. **get_patient** - Obtém detalhes de um paciente específico
   - Parâmetro: `id` (ID do paciente)
   - Retorna dados completos do paciente

### 📅 Gerenciamento de Agendamentos
3. **list_appointments** - Lista agendamentos
   - Filtros: `dataInicial`, `dataFinal`, `status`, `profissional`, `limit`, `offset`
   - Status: 0=Agendado, 1=Aguardando, 2=Confirmado, 3=Realizado, 4=Faltou, 5=Cancelado

### 📝 Gerenciamento de Formulários de Pesquisa (NOVO!)
4. **list_surveys** - Lista formulários de pesquisa
   - Filtros: `limit`, `offset`, `descricao`, `ativo`, `paciente`
   - Retorna lista de formulários ativos ou inativos

5. **get_survey** - Obtém detalhes de um formulário
   - Parâmetro: `id` (ID do formulário)
   - Retorna dados completos do formulário

6. **create_survey** - Cria novo formulário de pesquisa
   - Parâmetros obrigatórios:
     - `descricao`: string (3-45 caracteres) ⚠️
     - `ativo`: number (0 ou 1)
   - Retorna ID do formulário criado

7. **update_survey** - Atualiza formulário existente
   - Parâmetros obrigatórios:
     - `id`: string (ID do formulário)
     - `descricao`: string (3-45 caracteres) ⚠️
     - `ativo`: number (0 ou 1)
   - Retorna confirmação de atualização

8. **delete_survey** - Exclui formulário de pesquisa
   - Parâmetro: `id` (ID do formulário)
   - Retorna confirmação de exclusão

## ⚠️ Validações Importantes

### Descrição de Formulários
- **Mínimo**: 3 caracteres
- **Máximo**: 45 caracteres
- ❌ ERRO: "Teste MCP - Formulário ATUALIZADO com Sucesso!" (muito longo)
- ✅ OK: "Teste MCP - Formulário Atualizado" (dentro do limite)

## 🧪 Testes Realizados

### Teste 1: Listagem de Formulários
```
✅ Sucesso - Encontrados 3 formulários ativos:
- DED-5 - Questionário de Avaliação do Olho Seco
- Google review
- Pesquisa de satisfação
```

### Teste 2: Criação de Formulário
```
✅ Sucesso - Formulário criado com ID: 4
Descrição: "Teste MCP - Formulário de Teste Automatizado"
```

### Teste 3: Obtenção de Detalhes
```
✅ Sucesso - Dados completos do formulário ID 4 retornados
```

### Teste 4: Atualização
```
⚠️ Falha inicial - Descrição muito longa (>45 caracteres)
A API validou corretamente e retornou erro 400
```

### Teste 5: Exclusão
```
✅ Sucesso - Formulário ID 4 excluído
✅ Confirmado - Formulário não aparece mais na listagem
```

## 🔐 Autenticação
- Utiliza OAuth2 com refresh token
- Token de acesso renovado automaticamente a cada 14 minutos
- Refresh token configurado no arquivo `.env`

## 📊 Endpoints da API Ninsaúde

| Operação | Método | Endpoint |
|----------|--------|----------|
| Listar formulários | GET | `/v1/zapp_pesquisa1/listar` |
| Obter formulário | GET | `/v1/zapp_pesquisa1/{id}` |
| Criar formulário | POST | `/v1/zapp_pesquisa1` |
| Atualizar formulário | PUT | `/v1/zapp_pesquisa1/{id}` |
| Excluir formulário | DELETE | `/v1/zapp_pesquisa1/{id}` |

## 🚀 Como Usar

### Via Claude Desktop
Adicione ao arquivo de configuração do Claude Desktop:
```json
{
  "mcpServers": {
    "ninsaude": {
      "command": "node",
      "args": ["/Users/philipecruz/ninsaude-mcp-server/dist/index.js"]
    }
  }
}
```

### Exemplos de Uso
```javascript
// Criar formulário
create_survey({
  descricao: "Questionário de Satisfação",
  ativo: 1
})

// Atualizar formulário
update_survey({
  id: "4",
  descricao: "Questionário Atualizado",
  ativo: 1
})

// Listar formulários ativos
list_surveys({
  ativo: 1,
  limit: 10
})

// Excluir formulário
delete_survey({
  id: "4"
})
```

## 📈 Próximas Funcionalidades Sugeridas
- [ ] Gerenciamento de perguntas dos formulários
- [ ] Análise de resultados (gráficos)
- [ ] Exportação de modelos de formulários
- [ ] Importação de modelos públicos
- [ ] Gerenciamento de respostas de pacientes

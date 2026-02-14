# 💊 MÓDULO DE MEDICAMENTOS - NINSAÚDE MCP SERVER

## ℹ️ **Informação Importante**

A API Ninsaúde mantém um **banco de dados central de medicamentos** que é **somente leitura**. Isso significa que:

- ✅ Você pode **LISTAR** medicamentos
- ✅ Você pode **BUSCAR** medicamentos específicos
- ❌ Você **NÃO PODE criar** novos medicamentos
- ❌ Você **NÃO PODE atualizar** medicamentos existentes

Os medicamentos são gerenciados centralmente pela Ninsaúde e incluem informações oficiais de:
- Registro ANVISA
- Fabricantes/Laboratórios
- Princípios ativos
- Apresentações comerciais

---

## 🛠️ **Ferramentas Disponíveis** (2 ferramentas)

### 1. **`list_medicamentos` - Listar Medicamentos** 📋

Lista medicamentos do banco de dados Ninsaúde com filtros opcionais.

**Parâmetros:**
```javascript
{
  limit: número,              // Limite de resultados
  offset: número,             // Paginação
  nome: "string",             // Nome do medicamento
  laboratorio: "string",      // Laboratório/fabricante
  principioAtivo: "string",   // Princípio ativo
  ativo: 0 ou 1              // Status (0=Inativo, 1=Ativo)
}
```

**Exemplo de uso:**
```javascript
// Buscar colírios
await list_medicamentos({
  nome: "colirio",
  limit: 20
});

// Buscar por laboratório
await list_medicamentos({
  laboratorio: "Adaptados",
  limit: 50
});

// Buscar por princípio ativo
await list_medicamentos({
  principioAtivo: "Cloreto de sódio",
  limit: 10
});
```

---

### 2. **`get_medicamento` - Obter Detalhes** 🔍

Obtém informações detalhadas de um medicamento específico.

**Parâmetros:**
```javascript
{
  id: "string"  // ID do medicamento
}
```

**Exemplo de uso:**
```javascript
await get_medicamento({ id: "12345" });
```

**Retorno esperado:**
```json
{
  "result": {
    "id": "12345",
    "codigoIdentificador": 7896543210001,
    "nome": "BRITENSLC",
    "laboratorio": "Adaptados",
    "principioAtivo": "Cloreto de sódio",
    "apresentacao": "Colírio 5ml",
    "codigoPais": "BR",
    "ativo": 1
  }
}
```

---

## 🔍 **Como Encontrar Medicamentos**

### Workflow 1: Buscar Colírio BRITENSLC

```javascript
// 1. Buscar por nome
const resultado = await list_medicamentos({
  nome: "BRITENSLC",
  limit: 1
});

// 2. Se não encontrar, buscar colírios de sódio
if (!resultado.result || resultado.result.length === 0) {
  const alternativas = await list_medicamentos({
    principioAtivo: "Cloreto de sódio",
    nome: "colirio",
    limit: 20
  });
  
  console.log("Colírios de cloreto de sódio disponíveis:");
  console.log(alternativas);
}
```

### Workflow 2: Buscar Medicamentos por Fabricante

```javascript
// Listar todos os produtos do laboratório Adaptados
const medicamentos = await list_medicamentos({
  laboratorio: "Adaptados",
  ativo: 1,
  limit: 100
});
```

### Workflow 3: Buscar por Princípio Ativo

```javascript
// Encontrar todos os anti-inflamatórios
const antiInflamatorios = await list_medicamentos({
  principioAtivo: "diclofenaco",
  limit: 50
});
```

---

## 📊 **Informações dos Medicamentos**

Cada medicamento contém:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID único do medicamento |
| `codigoIdentificador` | number | Código identificador (pode ser EAN/código de barras) |
| `nome` | string | Nome comercial do medicamento |
| `laboratorio` | string | Fabricante/laboratório |
| `principioAtivo` | string | Substância ativa principal |
| `apresentacao` | string | Forma farmacêutica e dosagem |
| `codigoPais` | string | Código do país (BR = Brasil) |
| `ativo` | number | 0=Inativo, 1=Ativo no sistema |

---

## 💡 **Casos de Uso**

### ✅ **Prescrição Médica**
```javascript
// 1. Buscar medicamento
const medicamento = await list_medicamentos({
  nome: "BRITENSLC",
  limit: 1
});

// 2. Usar o ID para prescrever
if (medicamento.result && medicamento.result.length > 0) {
  const medId = medicamento.result[0].id;
  
  // 3. Criar prescrição (usando outro endpoint)
  await create_prescricao({
    paciente: 123,
    medicamento: medId,
    dosagem: "1 gota",
    frequencia: "4x ao dia",
    duracao: "7 dias"
  });
}
```

### ✅ **Controle de Estoque**
```javascript
// Listar medicamentos para verificar estoque
const medicamentos = await list_medicamentos({
  laboratorio: "Adaptados",
  ativo: 1,
  limit: 100
});

// Para cada medicamento, verificar estoque (se implementado)
for (const med of medicamentos.result) {
  console.log(`${med.nome} - ${med.apresentacao}`);
}
```

### ✅ **Busca Inteligente**
```javascript
async function buscarMedicamento(termo) {
  // Buscar por nome
  let resultado = await list_medicamentos({ nome: termo, limit: 10 });
  
  if (resultado.result.length === 0) {
    // Se não encontrar, buscar por princípio ativo
    resultado = await list_medicamentos({ 
      principioAtivo: termo, 
      limit: 10 
    });
  }
  
  if (resultado.result.length === 0) {
    // Se ainda não encontrar, buscar por laboratório
    resultado = await list_medicamentos({ 
      laboratorio: termo, 
      limit: 10 
    });
  }
  
  return resultado;
}

// Uso
const resultados = await buscarMedicamento("cloreto");
```

---

## ⚠️ **Limitações e Restrições**

### ❌ **NÃO É POSSÍVEL:**
- Criar medicamentos personalizados
- Editar informações de medicamentos existentes
- Deletar medicamentos do banco de dados
- Adicionar medicamentos que não estão no catálogo Ninsaúde

### ✅ **É POSSÍVEL:**
- Listar todos os medicamentos disponíveis
- Filtrar por nome, laboratório ou princípio ativo
- Obter detalhes completos de qualquer medicamento
- Usar medicamentos em prescrições e receitas

---

## 🔗 **Integração com Outros Módulos**

### **Prescrições**
Os medicamentos são utilizados no módulo de prescrições:
- Lista medicamentos disponíveis
- Médico seleciona o medicamento
- Sistema cria prescrição com dosagem e posologia

### **Produtos/Estoque**
Para criar produtos no estoque, você pode:
1. Buscar o medicamento no banco central
2. Criar um produto baseado no medicamento
3. Associar preço e controle de estoque

---

## 📈 **Estatísticas**

| Métrica | Valor |
|---------|-------|
| **Ferramentas CRUD** | 2 (Read-only) |
| **Total de Medicamentos** | Milhares (banco central) |
| **Tipos de Filtro** | 6 |
| **Campos por Medicamento** | 8 |

---

## 🎯 **Resumo**

- ✅ **2 ferramentas** de consulta de medicamentos
- ✅ Acesso ao **banco central Ninsaúde**
- ✅ Informações oficiais (ANVISA, fabricantes)
- ❌ Sem permissão para criar/editar (proteção de dados)
- ✅ Integrado com prescrições e produtos

---

**Versão:** 1.0.0  
**Atualização:** Fevereiro 2026  
**Status:** ✅ Funcional - Somente Leitura

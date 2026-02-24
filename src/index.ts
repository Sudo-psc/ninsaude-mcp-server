import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { NinsaudeAPI } from './api.js';

const api = new NinsaudeAPI();

const server = new McpServer({
    name: 'ninsaude-mcp-server',
    version: '3.0.0',
});

// ─────────────────────────────────────────────
// Helper: wrap API result as MCP text content
// ─────────────────────────────────────────────
function ok(data: unknown) {
    return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

// ════════════════════════════════════════════════════════
// 1. PACIENTES
// ════════════════════════════════════════════════════════
server.registerTool('list_patients', {
    description: 'List patients from Ninsaúde Clinic with optional filters',
    inputSchema: {
        limit: z.number().optional().describe('Records to return (default 20)'),
        offset: z.number().optional().describe('Pagination offset'),
        nomeExato: z.string().optional().describe('Exact patient name'),
        cpf: z.string().optional().describe('CPF document number'),
        dataNascimento: z.string().optional().describe('Birth date YYYY-MM-DD'),
        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listPatients(args)));

server.registerTool('get_patient', {
    description: 'Get details of a specific patient by ID',
    inputSchema: { id: z.string().describe('Patient ID') },
}, async ({ id }) => ok(await api.getPatient(id)));

server.registerTool('create_patient', {
    description: 'Create a new patient in Ninsaúde Clinic',
    inputSchema: {
        nome: z.string().describe('Patient full name (required)'),
        cpf: z.string().optional().describe('CPF document'),
        dataNascimento: z.string().optional().describe('Birth date YYYY-MM-DD'),
        sexo: z.string().optional().describe('Sex: M=Male, F=Female'),
        email: z.string().optional().describe('Email address'),
        foneCelular: z.string().optional().describe('Cell phone'),
        foneResidencial: z.string().optional().describe('Home phone'),
        enderecoCep: z.string().optional().describe('ZIP code (CEP)'),
        enderecoCidade: z.number().optional().describe('City ID'),
        enderecoBairro: z.string().optional().describe('Neighborhood'),
        enderecoLogradouro: z.string().optional().describe('Street address'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.createPatient(args)));

server.registerTool('update_patient', {
    description: 'Update an existing patient record',
    inputSchema: {
        id: z.string().describe('Patient ID (required)'),
        nome: z.string().optional().describe('Patient name'),
        cpf: z.string().optional().describe('CPF document'),
        dataNascimento: z.string().optional().describe('Birth date YYYY-MM-DD'),
        sexo: z.string().optional().describe('Sex: M=Male, F=Female'),
        email: z.string().optional().describe('Email address'),
        foneCelular: z.string().optional().describe('Cell phone'),
        foneResidencial: z.string().optional().describe('Home phone'),
        enderecoCep: z.string().optional().describe('ZIP code'),
        enderecoCidade: z.number().optional().describe('City ID'),
        enderecoBairro: z.string().optional().describe('Neighborhood'),
        enderecoLogradouro: z.string().optional().describe('Street address'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async ({ id, ...data }) => ok(await api.updatePatient(id, data)));

// ════════════════════════════════════════════════════════
// 2. AGENDAMENTOS
// ════════════════════════════════════════════════════════
server.registerTool('list_appointments', {
    description: 'List appointments (agendamentos) with filters',
    inputSchema: {
        dataInicial: z.string().optional().describe('Start date YYYY-MM-DD'),
        dataFinal: z.string().optional().describe('End date YYYY-MM-DD'),
        status: z.number().optional().describe('Status: 0=Sched,1=Wait,2=Conf,3=InProgress,4=Done,5=Cancelled'),
        profissional: z.number().optional().describe('Professional ID'),
        paciente: z.number().optional().describe('Patient ID'),
        limit: z.number().optional(),
        offset: z.number().optional(),
    },
}, async (args) => ok(await api.listAppointments(args)));

server.registerTool('create_agendamento', {
    description: 'Create a new appointment',
    inputSchema: {
        accountUnidade: z.number().describe('Unit ID (required)'),
        profissional: z.number().describe('Professional ID (required)'),
        data: z.string().describe('Date YYYY-MM-DD (required)'),
        horaInicial: z.string().describe('Start time HH:MM:SS (required)'),
        horaFinal: z.string().describe('End time HH:MM:SS (required)'),
        paciente: z.number().optional().describe('Patient ID'),
        servico: z.number().optional().describe('Service ID'),
        especialidade: z.number().optional().describe('Specialty ID'),
        status: z.number().optional().describe('Status (default 0=Scheduled)'),
        observacao: z.string().optional().describe('Notes'),
    },
}, async (args) => ok(await api.createAgendamento(args)));

server.registerTool('update_agendamento', {
    description: 'Update/reschedule an appointment',
    inputSchema: {
        id: z.string().describe('Appointment ID (required)'),
        data: z.string().optional().describe('New date YYYY-MM-DD'),
        horaInicial: z.string().optional().describe('New start time HH:MM:SS'),
        horaFinal: z.string().optional().describe('New end time HH:MM:SS'),
        status: z.number().optional().describe('New status'),
        observacao: z.string().optional().describe('Notes'),
    },
}, async ({ id, ...data }) => ok(await api.updateAgendamento(id, data)));

// ════════════════════════════════════════════════════════
// 3. FORMULÁRIOS DE PESQUISA (SURVEYS)
// ════════════════════════════════════════════════════════
server.registerTool('list_surveys', {
    description: 'List research/satisfaction surveys',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listSurveys(args)));

server.registerTool('get_survey', {
    description: 'Get survey details by ID',
    inputSchema: { id: z.string().describe('Survey ID') },
}, async ({ id }) => ok(await api.getSurvey(id)));

server.registerTool('create_survey', {
    description: 'Create a new research survey',
    inputSchema: {
        titulo: z.string().describe('Survey title (required)'),
        descricao: z.string().optional().describe('Description'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.createSurvey(args)));

server.registerTool('update_survey', {
    description: 'Update an existing survey',
    inputSchema: {
        id: z.string().describe('Survey ID (required)'),
        titulo: z.string().optional().describe('Survey title'),
        descricao: z.string().optional().describe('Description'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async ({ id, ...data }) => ok(await api.updateSurvey(id, data)));

server.registerTool('delete_survey', {
    description: 'Delete a survey by ID',
    inputSchema: { id: z.string().describe('Survey ID') },
}, async ({ id }) => ok(await api.deleteSurvey(id)));

// ════════════════════════════════════════════════════════
// 4. RECEITAS / RECEBIMENTOS
// ════════════════════════════════════════════════════════
server.registerTool('list_receitas', {
    description: 'List income/revenue entries with optional date filters',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        dataVencimentoInicial: z.string().optional().describe('Due date start YYYY-MM-DD'),
        dataVencimentoFinal: z.string().optional().describe('Due date end YYYY-MM-DD'),
        dataPagamentoInicial: z.string().optional().describe('Payment date start YYYY-MM-DD'),
        dataPagamentoFinal: z.string().optional().describe('Payment date end YYYY-MM-DD'),
        pago: z.number().optional().describe('Paid: 0=Pending, 1=Paid'),
        paciente: z.number().optional().describe('Patient ID filter'),
        conta: z.number().optional().describe('Account ID filter'),
    },
}, async (args) => ok(await api.listReceitas(args)));

server.registerTool('create_receita', {
    description: 'Create a new revenue/income entry',
    inputSchema: {
        accountUnidade: z.number().describe('Unit ID (required)'),
        conta: z.number().describe('Account ID (required)'),
        categoria: z.number().describe('Category ID (required)'),
        tipoPagto: z.number().describe('Payment type ID (required)'),
        dataVencto: z.string().describe('Due date YYYY-MM-DD (required)'),
        dataEmissao: z.string().describe('Issue date YYYY-MM-DD (required)'),
        valor: z.number().describe('Value (required)'),
        valorTotal: z.number().describe('Total value (required)'),
        recibo: z.number().optional().describe('Receipt: 1=Yes, 2=No'),
        pago: z.number().optional().describe('Paid: 0=No, 1=Yes'),
        dataPagamento: z.string().optional().describe('Payment date YYYY-MM-DD'),
        documento: z.string().optional().describe('Document/description'),
        observacao: z.string().optional().describe('Notes'),
        paciente: z.number().optional().describe('Patient ID'),
    },
}, async (args) => ok(await api.createReceita(args)));

// ════════════════════════════════════════════════════════
// 5. DESPESAS / PAGAMENTOS
// ════════════════════════════════════════════════════════
server.registerTool('list_despesas', {
    description: 'List expense/payment entries with optional date filters',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        dataVencimentoInicial: z.string().optional().describe('Due date start YYYY-MM-DD'),
        dataVencimentoFinal: z.string().optional().describe('Due date end YYYY-MM-DD'),
        dataPagamentoInicial: z.string().optional().describe('Payment date start YYYY-MM-DD'),
        dataPagamentoFinal: z.string().optional().describe('Payment date end YYYY-MM-DD'),
        pago: z.number().optional().describe('Paid: 0=Pending, 1=Paid'),
        conta: z.number().optional().describe('Account ID filter'),
    },
}, async (args) => ok(await api.listDespesas(args)));

server.registerTool('create_despesa', {
    description: 'Create a new expense/payment entry',
    inputSchema: {
        accountUnidade: z.number().describe('Unit ID (required)'),
        conta: z.number().describe('Account ID (required)'),
        categoria: z.number().describe('Category ID (required)'),
        tipoPagto: z.number().describe('Payment type ID (required)'),
        dataVencto: z.string().describe('Due date YYYY-MM-DD (required)'),
        dataEmissao: z.string().describe('Issue date YYYY-MM-DD (required)'),
        valor: z.number().describe('Value (required)'),
        valorTotal: z.number().describe('Total value (required)'),
        pago: z.number().optional().describe('Paid: 0=No, 1=Yes'),
        dataPagamento: z.string().optional().describe('Payment date YYYY-MM-DD'),
        documento: z.string().optional().describe('Document/description'),
        observacao: z.string().optional().describe('Notes'),
        fornecedor: z.number().optional().describe('Supplier ID'),
    },
}, async (args) => ok(await api.createDespesa(args)));

// ════════════════════════════════════════════════════════
// 6. MODELOS DE DOCUMENTOS
// ════════════════════════════════════════════════════════
server.registerTool('list_document_modelos', {
    description: 'List document templates (prescriptions, certificates, receipts)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        tipo: z.number().optional().describe('Type: 0=Prescription,1=Certificate,4=Receipt'),
        lingua: z.string().optional().describe('Language code e.g. pt-BR'),
    },
}, async (args) => ok(await api.listDocumentModelos(args)));

// ════════════════════════════════════════════════════════
// 7. RELATÓRIOS FINANCEIROS BÁSICOS
// ════════════════════════════════════════════════════════
const periodSchema = {
    dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
    dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
    accountUnidade: z.number().optional().describe('Unit ID filter'),
};

server.registerTool('get_fluxo_caixa_report', {
    description: 'Get cash flow report for a date range',
    inputSchema: periodSchema,
}, async (args) => ok(await api.getFluxoCaixaReport(args.dataInicial, args.dataFinal, args)));

server.registerTool('get_categoria_receita_report', {
    description: 'Get revenue breakdown by category for a date range',
    inputSchema: periodSchema,
}, async (args) => ok(await api.getCategoriaReceitaReport(args.dataInicial, args.dataFinal, args)));

server.registerTool('get_categoria_despesa_report', {
    description: 'Get expense breakdown by category for a date range',
    inputSchema: periodSchema,
}, async (args) => ok(await api.getCategoriaDespesaReport(args.dataInicial, args.dataFinal, args)));

// ════════════════════════════════════════════════════════
// 8. PROFISSIONAIS DE SAÚDE
// ════════════════════════════════════════════════════════
server.registerTool('list_profissionais', {
    description: 'List healthcare professionals',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        nome: z.string().optional().describe('Name filter'),
        especialidade: z.number().optional().describe('Specialty ID filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
        accountUnidade: z.number().optional().describe('Unit ID filter'),
    },
}, async (args) => ok(await api.listProfissionais(args)));

server.registerTool('get_profissional', {
    description: 'Get professional details by ID',
    inputSchema: { id: z.string().describe('Professional ID') },
}, async ({ id }) => ok(await api.getProfissional(id)));

server.registerTool('list_profissional_agenda', {
    description: 'Get a professional\'s schedule/time slots by weekday',
    inputSchema: {
        profissional: z.number().describe('Professional ID (required)'),
        diaSemana: z.number().optional().describe('Weekday: 0=Sun,1=Mon,...,6=Sat'),
    },
}, async (args) => ok(await api.listProfissionalAgenda(args)));

// ════════════════════════════════════════════════════════
// 9. CONVÊNIOS / PLANOS DE SAÚDE
// ════════════════════════════════════════════════════════
server.registerTool('list_convenios', {
    description: 'List health insurance plans (convênios)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        descricao: z.string().optional().describe('Plan name filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listConvenios(args)));

server.registerTool('get_convenio', {
    description: 'Get health insurance plan details by ID',
    inputSchema: { id: z.string().describe('Convênio ID') },
}, async ({ id }) => ok(await api.getConvenio(id)));

// ════════════════════════════════════════════════════════
// 10. SERVIÇOS MÉDICOS
// ════════════════════════════════════════════════════════
server.registerTool('list_servicos', {
    description: 'List medical services/procedures offered by the clinic',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        descricao: z.string().optional().describe('Service description filter'),
        especialidade: z.number().optional().describe('Specialty ID filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listServicos(args)));

server.registerTool('get_servico', {
    description: 'Get medical service details by ID',
    inputSchema: { id: z.string().describe('Service ID') },
}, async ({ id }) => ok(await api.getServico(id)));

// ════════════════════════════════════════════════════════
// 11. CONTAS BANCÁRIAS
// ════════════════════════════════════════════════════════
server.registerTool('list_contas', {
    description: 'List bank/cash accounts registered in the clinic',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listContas(args)));

server.registerTool('get_conta_saldo', {
    description: 'Get current balance of all bank accounts',
    inputSchema: {},
}, async () => ok(await api.getContaSaldo()));

// ════════════════════════════════════════════════════════
// 12. FORNECEDORES
// ════════════════════════════════════════════════════════
server.registerTool('list_fornecedores', {
    description: 'List suppliers registered in the clinic',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        nomeFantasia: z.string().optional().describe('Trade name filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listFornecedores(args)));

server.registerTool('create_fornecedor', {
    description: 'Create a new supplier',
    inputSchema: {
        nomeFantasia: z.string().describe('Trade name (required)'),
        razaoSocial: z.string().optional().describe('Legal name'),
        cnpj: z.string().optional().describe('CNPJ tax number'),
        cpf: z.string().optional().describe('CPF (individual)'),
        telefone: z.string().optional().describe('Phone'),
        email: z.string().optional().describe('Email'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.createFornecedor(args)));

// ════════════════════════════════════════════════════════
// 13. CATEGORIAS FINANCEIRAS
// ════════════════════════════════════════════════════════
server.registerTool('list_categorias_receita', {
    description: 'List all revenue/income categories',
    inputSchema: { limit: z.number().optional(), offset: z.number().optional() },
}, async (args) => ok(await api.listCategoriasReceita(args)));

server.registerTool('list_categorias_despesa', {
    description: 'List all expense/cost categories',
    inputSchema: { limit: z.number().optional(), offset: z.number().optional() },
}, async (args) => ok(await api.listCategoriasDespesa(args)));

// ════════════════════════════════════════════════════════
// 14. RELATÓRIOS FINANCEIROS AVANÇADOS
// ════════════════════════════════════════════════════════
server.registerTool('get_tipo_pagamento_report', {
    description: 'Get revenue breakdown by payment method (PIX, card, cash, etc.)',
    inputSchema: periodSchema,
}, async (args) => ok(await api.getTipoPagamentoReport(args.dataInicial, args.dataFinal, args)));

server.registerTool('get_inadimplencia_report', {
    description: 'Get overdue/delinquency report showing unpaid receivables',
    inputSchema: periodSchema,
}, async (args) => ok(await api.getInadimplenciaReport(args.dataInicial, args.dataFinal, args)));

server.registerTool('get_profissional_report', {
    description: 'Get revenue generated per healthcare professional',
    inputSchema: { ...periodSchema, profissional: z.number().optional().describe('Professional ID filter') },
}, async (args) => ok(await api.getProfissionalReport(args.dataInicial, args.dataFinal, args)));

server.registerTool('get_convenio_report', {
    description: 'Get revenue breakdown by health insurance plan',
    inputSchema: periodSchema,
}, async (args) => ok(await api.getConvenioReport(args.dataInicial, args.dataFinal, args)));

// ════════════════════════════════════════════════════════
// 15. PRONTUÁRIOS MÉDICOS
// ════════════════════════════════════════════════════════
server.registerTool('list_prontuarios', {
    description: 'List medical records (prontuários)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        paciente: z.number().optional().describe('Patient ID filter'),
        profissional: z.number().optional().describe('Professional ID filter'),
        dataInicial: z.string().optional().describe('Start date YYYY-MM-DD'),
        dataFinal: z.string().optional().describe('End date YYYY-MM-DD'),
    },
}, async (args) => ok(await api.listProntuarios(args)));

server.registerTool('get_prontuario', {
    description: 'Get medical record details by ID',
    inputSchema: { id: z.string().describe('Medical record ID') },
}, async ({ id }) => ok(await api.getProntuario(id)));

server.registerTool('create_prontuario', {
    description: 'Create a new medical record (prontuário) for a patient visit',
    inputSchema: {
        paciente: z.number().describe('Patient ID (required)'),
        profissional: z.number().describe('Professional ID (required)'),
        data: z.string().describe('Date YYYY-MM-DD (required)'),
        hora: z.string().optional().describe('Time HH:MM:SS'),
        queixaPrincipal: z.string().optional().describe('Chief complaint'),
        diagnostico: z.string().optional().describe('Diagnosis text'),
        conduta: z.string().optional().describe('Treatment plan/conduct'),
        observacao: z.string().optional().describe('Notes'),
    },
}, async (args) => ok(await api.createProntuario(args)));

server.registerTool('update_prontuario', {
    description: 'Update an existing medical record',
    inputSchema: {
        id: z.string().describe('Medical record ID (required)'),
        queixaPrincipal: z.string().optional().describe('Chief complaint'),
        diagnostico: z.string().optional().describe('Diagnosis text'),
        conduta: z.string().optional().describe('Treatment plan/conduct'),
        observacao: z.string().optional().describe('Notes'),
    },
}, async ({ id, ...data }) => ok(await api.updateProntuario(id, data)));

// ════════════════════════════════════════════════════════
// 16. PRODUTOS / ESTOQUE BÁSICO
// ════════════════════════════════════════════════════════
server.registerTool('list_produtos', {
    description: 'List products/items in clinic inventory',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        descricao: z.string().optional().describe('Product name filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listProdutos(args)));

server.registerTool('get_produto_estoque', {
    description: 'Get current stock level for a product across deposits',
    inputSchema: { id: z.string().describe('Product ID') },
}, async ({ id }) => ok(await api.getProdutoEstoque(id)));

// ════════════════════════════════════════════════════════
// 17. TÍTULOS DE TRANSFERÊNCIA
// ════════════════════════════════════════════════════════
server.registerTool('list_titulos_transferencias', {
    description: 'List financial transfer titles (bank reconciliation)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        conta: z.number().optional().describe('Account ID filter'),
        dataInicial: z.string().optional().describe('Start date YYYY-MM-DD'),
        dataFinal: z.string().optional().describe('End date YYYY-MM-DD'),
    },
}, async (args) => ok(await api.listTitulosTransferencias(args)));

server.registerTool('get_titulo_transferencia', {
    description: 'Get transfer title details by ID',
    inputSchema: { id: z.string().describe('Transfer title ID') },
}, async ({ id }) => ok(await api.getTituloTransferencia(id)));

server.registerTool('add_titulos_lote', {
    description: 'Add multiple transfer titles in batch',
    inputSchema: {
        titulos: z.array(z.object({
            conta: z.number(),
            valor: z.number(),
            data: z.string(),
            descricao: z.string().optional(),
        })).describe('Array of transfer titles'),
    },
}, async (args) => ok(await api.addTitulosLote(args)));

// ════════════════════════════════════════════════════════
// 18. MEDICAMENTOS (BASE CENTRAL - SOMENTE LEITURA)
// ════════════════════════════════════════════════════════
server.registerTool('list_medicamentos', {
    description: 'Search medications in Ninsaúde central database (read-only)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        nome: z.string().optional().describe('Medication name filter'),
        laboratorio: z.string().optional().describe('Laboratory/manufacturer filter'),
        principioAtivo: z.string().optional().describe('Active ingredient filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listMedicamentos(args)));

server.registerTool('get_medicamento', {
    description: 'Get details of a specific medication from central database',
    inputSchema: { id: z.string().describe('Medication ID') },
}, async ({ id }) => ok(await api.getMedicamento(id)));

// ════════════════════════════════════════════════════════
// 19. PRESCRIÇÕES DO PRONTUÁRIO
// ════════════════════════════════════════════════════════
server.registerTool('list_prontuario_prescricoes', {
    description: 'List prescriptions linked to medical records',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        prontuario: z.number().optional().describe('Medical record ID filter'),
        paciente: z.number().optional().describe('Patient ID filter'),
    },
}, async (args) => ok(await api.listProntuarioPrescricoes(args)));

server.registerTool('get_prontuario_prescricao', {
    description: 'Get prescription details by ID',
    inputSchema: { id: z.string().describe('Prescription ID') },
}, async ({ id }) => ok(await api.getProntuarioPrescricao(id)));

server.registerTool('create_prontuario_prescricao', {
    description: 'Create a new prescription in a medical record',
    inputSchema: {
        prontuario: z.number().describe('Medical record ID (required)'),
        descricao: z.string().optional().describe('Prescription header/description'),
        validade: z.string().optional().describe('Validity date YYYY-MM-DD'),
        tipo: z.number().optional().describe('Type: 0=Simple, 1=Special control'),
    },
}, async (args) => ok(await api.createProntuarioPrescricao(args)));

server.registerTool('update_prontuario_prescricao', {
    description: 'Update an existing prescription',
    inputSchema: {
        id: z.string().describe('Prescription ID (required)'),
        descricao: z.string().optional().describe('Prescription header/description'),
        validade: z.string().optional().describe('Validity date YYYY-MM-DD'),
        tipo: z.number().optional().describe('Type: 0=Simple, 1=Special control'),
    },
}, async ({ id, ...data }) => ok(await api.updateProntuarioPrescricao(id, data)));

// ════════════════════════════════════════════════════════
// 20. MEDICAMENTOS DA PRESCRIÇÃO
// ════════════════════════════════════════════════════════
server.registerTool('list_prescricao_medicamentos', {
    description: 'List medication items within a prescription',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        prescricao: z.number().optional().describe('Prescription ID filter'),
    },
}, async (args) => ok(await api.listPrescricaoMedicamentos(args)));

server.registerTool('create_prescricao_medicamento', {
    description: 'Add a medication item to a prescription',
    inputSchema: {
        prescricao: z.number().describe('Prescription ID (required)'),
        medicamento: z.number().optional().describe('Medication ID from central database'),
        descricao: z.string().optional().describe('Free-text medication description'),
        posologia: z.string().optional().describe('Dosage instructions'),
        quantidade: z.number().optional().describe('Quantity'),
        unidade: z.string().optional().describe('Unit (e.g., caixa, comprimido)'),
    },
}, async (args) => ok(await api.createPrescricaoMedicamento(args)));

server.registerTool('delete_prescricao_medicamento', {
    description: 'Remove a medication item from a prescription',
    inputSchema: { id: z.string().describe('Medication item ID') },
}, async ({ id }) => ok(await api.deletePrescricaoMedicamento(id)));

// ════════════════════════════════════════════════════════
// 21. NOTAS DO PRONTUÁRIO
// ════════════════════════════════════════════════════════
server.registerTool('list_prontuario_notas', {
    description: 'List clinical notes from medical records',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        prontuario: z.number().optional().describe('Medical record ID filter'),
        paciente: z.number().optional().describe('Patient ID filter'),
    },
}, async (args) => ok(await api.listProntuarioNotas(args)));

server.registerTool('create_prontuario_nota', {
    description: 'Create a clinical note in a medical record',
    inputSchema: {
        prontuario: z.number().describe('Medical record ID (required)'),
        nota: z.string().describe('Note content (required)'),
        tipo: z.number().optional().describe('Note type'),
    },
}, async (args) => ok(await api.createProntuarioNota(args)));

server.registerTool('update_prontuario_nota', {
    description: 'Update a clinical note',
    inputSchema: {
        id: z.string().describe('Note ID (required)'),
        nota: z.string().optional().describe('Note content'),
        tipo: z.number().optional().describe('Note type'),
    },
}, async ({ id, ...data }) => ok(await api.updateProntuarioNota(id, data)));

server.registerTool('delete_prontuario_nota', {
    description: 'Delete a clinical note from a medical record',
    inputSchema: { id: z.string().describe('Note ID') },
}, async ({ id }) => ok(await api.deleteProntuarioNota(id)));

// ════════════════════════════════════════════════════════
// 22. ALERGIAS
// ════════════════════════════════════════════════════════
server.registerTool('list_alergias', {
    description: 'List patient allergies',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        paciente: z.number().optional().describe('Patient ID filter'),
    },
}, async (args) => ok(await api.listAlergias(args)));

server.registerTool('create_alergia', {
    description: 'Register a patient allergy',
    inputSchema: {
        paciente: z.number().describe('Patient ID (required)'),
        descricao: z.string().describe('Allergy description (required)'),
        tipo: z.number().optional().describe('Type: 0=Medication,1=Food,2=Environment,3=Other'),
        gravidade: z.number().optional().describe('Severity: 0=Mild,1=Moderate,2=Severe'),
    },
}, async (args) => ok(await api.createAlergia(args)));

server.registerTool('update_alergia', {
    description: 'Update a patient allergy record',
    inputSchema: {
        id: z.string().describe('Allergy ID (required)'),
        descricao: z.string().optional().describe('Allergy description'),
        tipo: z.number().optional().describe('Type: 0=Medication,1=Food,2=Environment,3=Other'),
        gravidade: z.number().optional().describe('Severity: 0=Mild,1=Moderate,2=Severe'),
    },
}, async ({ id, ...data }) => ok(await api.updateAlergia(id, data)));

server.registerTool('delete_alergia', {
    description: 'Delete a patient allergy record',
    inputSchema: { id: z.string().describe('Allergy ID') },
}, async ({ id }) => ok(await api.deleteAlergia(id)));

// ════════════════════════════════════════════════════════
// 23. DOCUMENTOS DO PRONTUÁRIO
// ════════════════════════════════════════════════════════
server.registerTool('list_prontuario_documentos', {
    description: 'List documents attached to medical records (exams, certificates, etc.)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        prontuario: z.number().optional().describe('Medical record ID filter'),
        paciente: z.number().optional().describe('Patient ID filter'),
    },
}, async (args) => ok(await api.listProntuarioDocumentos(args)));

server.registerTool('get_prontuario_documento', {
    description: 'Get a specific document from a medical record',
    inputSchema: { id: z.string().describe('Document ID') },
}, async ({ id }) => ok(await api.getProntuarioDocumento(id)));

// ════════════════════════════════════════════════════════
// 24. ENCAMINHADORES
// ════════════════════════════════════════════════════════
server.registerTool('list_encaminhadores', {
    description: 'List referring physicians/referrers',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        nome: z.string().optional().describe('Name filter'),
        especialidade: z.number().optional().describe('Specialty ID filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listEncaminhadores(args)));

server.registerTool('get_encaminhador', {
    description: 'Get referrer/referring physician details by ID',
    inputSchema: { id: z.string().describe('Referrer ID') },
}, async ({ id }) => ok(await api.getEncaminhador(id)));

server.registerTool('create_encaminhador', {
    description: 'Create a new referrer/referring physician',
    inputSchema: {
        nome: z.string().describe('Full name (required)'),
        crm: z.string().optional().describe('CRM council number'),
        especialidade: z.number().optional().describe('Specialty ID'),
        email: z.string().optional().describe('Email'),
        telefone: z.string().optional().describe('Phone'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.createEncaminhador(args)));

// ════════════════════════════════════════════════════════
// 25. SALAS
// ════════════════════════════════════════════════════════
server.registerTool('list_salas', {
    description: 'List clinic rooms/offices',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        descricao: z.string().optional().describe('Room name filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listSalas(args)));

server.registerTool('get_sala', {
    description: 'Get clinic room details by ID',
    inputSchema: { id: z.string().describe('Room ID') },
}, async ({ id }) => ok(await api.getSala(id)));

// ════════════════════════════════════════════════════════
// 26. TIPOS DE PAGAMENTO
// ════════════════════════════════════════════════════════
server.registerTool('list_tipos_pagamento', {
    description: 'List payment types (PIX, credit card, cash, etc.)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        descricao: z.string().optional().describe('Description filter'),
        ativo: z.number().optional().describe('Active: 0=Inactive, 1=Active'),
    },
}, async (args) => ok(await api.listTiposPagamento(args)));

server.registerTool('get_tipo_pagamento', {
    description: 'Get payment type details by ID',
    inputSchema: { id: z.string().describe('Payment type ID') },
}, async ({ id }) => ok(await api.getTipoPagamento(id)));

// ════════════════════════════════════════════════════════
// 27. ESPECIALIDADES MÉDICAS
// ════════════════════════════════════════════════════════
server.registerTool('list_especialidades', {
    description: 'List medical specialties (Ophthalmology, Cardiology, etc.)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        lingua: z.string().optional().describe('Language code e.g. pt-BR, en'),
    },
}, async (args) => ok(await api.listEspecialidades(args)));

// ════════════════════════════════════════════════════════
// 28. CID-10
// ════════════════════════════════════════════════════════
server.registerTool('list_cid', {
    description: 'Search CID-10 disease codes (International Classification of Diseases)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        descricao: z.string().optional().describe('Disease description filter e.g. "diabetes"'),
        codigo: z.string().optional().describe('CID code filter e.g. "E11"'),
    },
}, async (args) => ok(await api.listCid(args)));

server.registerTool('get_cid', {
    description: 'Get details of a specific CID-10 disease code',
    inputSchema: { id: z.string().describe('CID ID') },
}, async ({ id }) => ok(await api.getCid(id)));

// ════════════════════════════════════════════════════════
// 29. CIDADE / CEP
// ════════════════════════════════════════════════════════
server.registerTool('buscar_endereco_por_cep', {
    description: 'Look up a Brazilian address (logradouro, bairro, city) by ZIP code (CEP)',
    inputSchema: {
        cep: z.string().describe('Brazilian ZIP code (CEP) without dashes e.g. 01310100'),
    },
}, async ({ cep }) => ok(await api.buscarEnderecoPorCep(cep)));

server.registerTool('list_cidades', {
    description: 'List cities, optionally filtered by state and country',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        nome: z.string().optional().describe('City name filter'),
        pais: z.number().optional().describe('Country ID (use together with estado)'),
        estado: z.string().optional().describe('State code e.g. MG (use together with pais)'),
    },
}, async (args) => ok(await api.listCidades(args)));

// ════════════════════════════════════════════════════════
// 30. TRANSFERÊNCIAS FINANCEIRAS
// ════════════════════════════════════════════════════════
server.registerTool('list_transferencias', {
    description: 'List financial transfers between bank accounts',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        dataInicial: z.string().optional().describe('Start date YYYY-MM-DD'),
        dataFinal: z.string().optional().describe('End date YYYY-MM-DD'),
        contaOrigem: z.number().optional().describe('Source account ID'),
        contaDestino: z.number().optional().describe('Destination account ID'),
    },
}, async (args) => ok(await api.listTransferencias(args)));

server.registerTool('create_transferencia', {
    description: 'Create a financial transfer between two accounts',
    inputSchema: {
        contaOrigem: z.number().describe('Source account ID (required)'),
        contaDestino: z.number().describe('Destination account ID (required)'),
        valor: z.number().describe('Transfer amount (required)'),
        data: z.string().describe('Transfer date YYYY-MM-DD (required)'),
        observacao: z.string().optional().describe('Notes'),
    },
}, async (args) => ok(await api.createTransferencia(args)));

server.registerTool('get_transferencia', {
    description: 'Get details of a specific financial transfer',
    inputSchema: { id: z.string().describe('Transfer ID') },
}, async ({ id }) => ok(await api.getTransferencia(id)));

// ════════════════════════════════════════════════════════
// 31. DEPÓSITOS DE ESTOQUE
// ════════════════════════════════════════════════════════
server.registerTool('list_depositos', {
    description: 'List stock deposits/warehouses',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        accountUnidade: z.number().optional().describe('Unit ID filter'),
    },
}, async (args) => ok(await api.listDepositos(args)));

server.registerTool('get_deposito', {
    description: 'Get stock deposit/warehouse details by ID',
    inputSchema: { id: z.string().describe('Deposit ID') },
}, async ({ id }) => ok(await api.getDeposito(id)));

// ════════════════════════════════════════════════════════
// 32. MOVIMENTAÇÕES DE ESTOQUE
// ════════════════════════════════════════════════════════
server.registerTool('list_movimentacoes_estoque', {
    description: 'List stock movements (entries, exits, internal transfers)',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        dataInicial: z.string().optional().describe('Start date YYYY-MM-DD'),
        dataFinal: z.string().optional().describe('End date YYYY-MM-DD'),
        produto: z.number().optional().describe('Product ID filter'),
        depositoOrigem: z.number().optional().describe('Source deposit ID'),
        depositoDestino: z.number().optional().describe('Destination deposit ID'),
        accountUnidade: z.number().optional().describe('Unit ID filter'),
    },
}, async (args) => ok(await api.listMovimentacoesEstoque(args)));

server.registerTool('create_movimentacao_estoque', {
    description: 'Create a stock movement (entry, exit or internal transfer)',
    inputSchema: {
        produto: z.number().describe('Product ID (required)'),
        quantidade: z.number().describe('Quantity (required)'),
        tipo: z.number().describe('Type: 0=Entry, 1=Exit, 2=Transfer (required)'),
        data: z.string().describe('Date YYYY-MM-DD (required)'),
        depositoOrigem: z.number().optional().describe('Source deposit ID'),
        depositoDestino: z.number().optional().describe('Destination deposit ID'),
        observacao: z.string().optional().describe('Notes'),
        valorUnitario: z.number().optional().describe('Unit cost'),
    },
}, async (args) => ok(await api.createMovimentacaoEstoque(args)));

// ════════════════════════════════════════════════════════
// 33. RELATÓRIOS DE ATENDIMENTO
// ════════════════════════════════════════════════════════
const attendancePeriodSchema = {
    dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
    dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
    profissional: z.number().optional().describe('Professional ID filter'),
    accountUnidade: z.number().optional().describe('Unit ID filter'),
};

server.registerTool('get_atendimento_sobrecarga_report', {
    description: 'Get appointment workload/overload report per professional',
    inputSchema: attendancePeriodSchema,
}, async ({ dataInicial, dataFinal, ...filters }) =>
    ok(await api.getAtendimentoSobrecargaReport(dataInicial, dataFinal, filters)));

server.registerTool('get_atendimento_sazonalidade', {
    description: 'Get appointment seasonality report (monthly/weekly trends)',
    inputSchema: attendancePeriodSchema,
}, async ({ dataInicial, dataFinal, ...filters }) =>
    ok(await api.getAtendimentoSazonalidade(dataInicial, dataFinal, filters)));

server.registerTool('get_atendimento_sexo_pacientes', {
    description: 'Get patient gender distribution report for appointments',
    inputSchema: attendancePeriodSchema,
}, async ({ dataInicial, dataFinal, ...filters }) =>
    ok(await api.getAtendimentoSexoPacientes(dataInicial, dataFinal, filters)));

server.registerTool('get_atendimento_horarios_pico', {
    description: 'Get peak appointment hours report',
    inputSchema: attendancePeriodSchema,
}, async ({ dataInicial, dataFinal, ...filters }) =>
    ok(await api.getAtendimentoHorariosPico(dataInicial, dataFinal, filters)));

server.registerTool('get_atendimento_servicos_mais_vendidos', {
    description: 'Get most performed medical services report',
    inputSchema: attendancePeriodSchema,
}, async ({ dataInicial, dataFinal, ...filters }) =>
    ok(await api.getAtendimentoServicosMaisVendidos(dataInicial, dataFinal, filters)));

server.registerTool('get_atendimento_convenios_mais_vendidos', {
    description: 'Get most used health insurance plans report',
    inputSchema: {
        dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
        dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
        accountUnidade: z.number().optional().describe('Unit ID filter'),
    },
}, async ({ dataInicial, dataFinal, ...filters }) =>
    ok(await api.getAtendimentoConveniosMaisVendidos(dataInicial, dataFinal, filters)));

server.registerTool('get_atendimento_quantidades', {
    description: 'Get appointment counts report (attended, missed, cancelled, rescheduled)',
    inputSchema: attendancePeriodSchema,
}, async ({ dataInicial, dataFinal, ...filters }) =>
    ok(await api.getAtendimentoQuantidades(dataInicial, dataFinal, filters)));

server.registerTool('get_total_pacientes', {
    description: 'Get overall patient totals summary',
    inputSchema: {},
}, async () => ok(await api.getTotalPacientes()));

// ════════════════════════════════════════════════════════
// 34. NOTAS FISCAIS (NFS-e)
// ════════════════════════════════════════════════════════
server.registerTool('list_notas_fiscais', {
    description: 'List electronic invoices (NFS-e) with optional date or status filter',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
        dataInicial: z.string().optional().describe('Start date YYYY-MM-DD'),
        dataFinal: z.string().optional().describe('End date YYYY-MM-DD'),
        status: z.number().optional().describe('Status: 0=Pending, 1=Issued, 2=Cancelled'),
    },
}, async (args) => ok(await api.listNotasFiscais(args)));

server.registerTool('get_nota_fiscal_estatisticas', {
    description: 'Get electronic invoice (NFS-e) statistics — totals and issued values',
    inputSchema: {},
}, async () => ok(await api.getNotaFiscalEstatisticas()));

server.registerTool('cancelar_nota_fiscal', {
    description: 'Cancel an electronic invoice (NFS-e) by ID',
    inputSchema: { id: z.string().describe('NFS-e ID') },
}, async ({ id }) => ok(await api.cancelarNotaFiscal(id)));

server.registerTool('enviar_nota_fiscal_email', {
    description: 'Send an electronic invoice (NFS-e) by email to the patient',
    inputSchema: { id: z.string().describe('NFS-e ID') },
}, async ({ id }) => ok(await api.enviarNotaFiscalEmail(id)));

// ════════════════════════════════════════════════════════
// 35. COBRANÇAS NINSAÚDE PAY
// ════════════════════════════════════════════════════════
server.registerTool('list_cobrancas', {
    description: 'List Ninsaúde Pay charges/billing links',
    inputSchema: {
        limit: z.number().optional(),
        offset: z.number().optional(),
    },
}, async (args) => ok(await api.listCobrancas(args)));

server.registerTool('get_cobranca', {
    description: 'Get details of a specific Ninsaúde Pay charge',
    inputSchema: { cobrancaId: z.string().describe('Charge ID') },
}, async ({ cobrancaId }) => ok(await api.getCobranca(cobrancaId)));

server.registerTool('get_link_cobranca', {
    description: 'Get the payment link URL for a Ninsaúde Pay charge',
    inputSchema: { cobrancaId: z.string().describe('Charge ID') },
}, async ({ cobrancaId }) => ok(await api.getLinkCobranca(cobrancaId)));

// ════════════════════════════════════════════════════════
// START SERVER
// ════════════════════════════════════════════════════════
async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Ninsaúde MCP Server v3.0.0 running on stdio (MCP SDK 1.x)');
}

run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});

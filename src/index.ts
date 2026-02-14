import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { NinsaudeAPI } from './api';

const api = new NinsaudeAPI();

const server = new Server(
    {
        name: 'ninsaude-mcp-server',
        version: '0.1.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'list_patients',
                description: 'List patients from Ninsaúde Clinic with optional filters',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional().describe('Number of records to return (default 20)'),
                        offset: z.number().optional().describe('Pagination offset'),
                        nomeExato: z.string().optional().describe('Exact name of the patient'),
                        cpf: z.string().optional().describe('CPF of the patient'),
                    })
                ),
            },
            {
                name: 'get_patient',
                description: 'Get details of a specific patient by ID',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('ID of the patient'),
                    })
                ),
            },
            {
                name: 'create_patient',
                description: 'Create a new patient',
                inputSchema: zodToJSONSchema(
                    z.object({
                        nome: z.string().describe('Patient name (required)'),
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
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                    })
                )
            },
            {
                name: 'update_patient',
                description: 'Update an existing patient',
                inputSchema: zodToJSONSchema(
                    z.object({
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
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                    })
                )
            },
            {
                name: 'list_appointments',
                description: 'List appointments (agendamentos)',
                inputSchema: zodToJSONSchema(
                    z.object({
                        dataInicial: z.string().optional().describe('Start date (YYYY-MM-DD)'),
                        dataFinal: z.string().optional().describe('End date (YYYY-MM-DD)'),
                        status: z.number().optional().describe('Status (0=Sched, 1=Wait, 2=Conf, 3=Done, 4=Missed, 5=Canc)'),
                        profissional: z.number().optional().describe('ID of the professional'),
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                    })
                )
            },
            {
                name: 'list_surveys',
                description: 'List surveys/research forms (formulários de pesquisa)',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional().describe('Number of records to return'),
                        offset: z.number().optional().describe('Pagination offset'),
                        descricao: z.string().optional().describe('Description filter'),
                        ativo: z.number().optional().describe('Active status (0 or 1)'),
                        paciente: z.number().optional().describe('Patient ID filter'),
                    })
                )
            },
            {
                name: 'get_survey',
                description: 'Get details of a specific survey/research form by ID',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('ID of the survey'),
                    })
                )
            },
            {
                name: 'create_survey',
                description: 'Create a new survey/research form',
                inputSchema: zodToJSONSchema(
                    z.object({
                        descricao: z.string().describe('Description of the survey (required)'),
                        ativo: z.number().describe('Active status: 1 for active, 0 for inactive (required)'),
                    })
                )
            },
            {
                name: 'update_survey',
                description: 'Update an existing survey/research form',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('ID of the survey to update'),
                        descricao: z.string().describe('Description of the survey (required)'),
                        ativo: z.number().describe('Active status: 1 for active, 0 for inactive (required)'),
                    })
                )
            },
            {
                name: 'delete_survey',
                description: 'Delete a survey/research form by ID',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('ID of the survey to delete'),
                    })
                )
            },
            {
                name: 'create_receita',
                description: 'Create a new receivable/income (recebimento)',
                inputSchema: zodToJSONSchema(
                    z.object({
                        accountUnidade: z.number().describe('Unit ID (required)'),
                        conta: z.number().describe('Account ID (required)'),
                        categoria: z.number().describe('Category ID (required)'),
                        tipoPagto: z.number().describe('Payment type ID (required)'),
                        dataVencto: z.string().describe('Due date YYYY-MM-DD (required)'),
                        dataEmissao: z.string().describe('Issue date YYYY-MM-DD (required)'),
                        valor: z.number().describe('Amount (required)'),
                        valorTotal: z.number().describe('Total amount (required)'),
                        recibo: z.number().describe('Receipt type: 0=Use receipt block, 1=Print in professional name, 2=Print in clinic name (required)'),
                        pago: z.number().describe('Paid status: 0=Not paid, 1=Paid (required)'),
                        paciente: z.number().optional().describe('Patient ID (optional)'),
                        dataPagamento: z.string().optional().describe('Payment date YYYY-MM-DD (optional)'),
                        observacao: z.string().optional().describe('Notes (optional)'),
                    })
                )
            },
            {
                name: 'list_receitas',
                description: 'List receivables/income (recebimentos)',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        dataVencimentoInicial: z.string().optional().describe('Start due date YYYY-MM-DD'),
                        dataVencimentoFinal: z.string().optional().describe('End due date YYYY-MM-DD'),
                        dataPagamentoInicial: z.string().optional().describe('Start payment date YYYY-MM-DD'),
                        dataPagamentoFinal: z.string().optional().describe('End payment date YYYY-MM-DD'),
                        paciente: z.number().optional().describe('Patient ID filter'),
                    })
                )
            },
            {
                name: 'create_despesa',
                description: 'Create a new expense/payment ( despesa)',
                inputSchema: zodToJSONSchema(
                    z.object({
                        accountUnidade: z.number().describe('Unit ID (required)'),
                        conta: z.number().describe('Account ID (required)'),
                        categoria: z.number().describe('Category ID (required)'),
                        tipoPagto: z.number().describe('Payment type ID (required)'),
                        dataVencto: z.string().describe('Due date YYYY-MM-DD (required)'),
                        dataEmissao: z.string().describe('Issue date YYYY-MM-DD (required)'),
                        valor: z.number().describe('Amount (required)'),
                        valorTotal: z.number().describe('Total amount (required)'),
                        pago: z.number().describe('Paid status: 0=Not paid, 1=Paid (required)'),
                        fornecedor: z.number().optional().describe('Supplier ID (optional)'),
                        dataPagamento: z.string().optional().describe('Payment date YYYY-MM-DD (optional)'),
                        observacao: z.string().optional().describe('Notes (optional)'),
                    })
                )
            },
            {
                name: 'list_despesas',
                description: 'List expenses/payments (despesas)',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        dataVencimentoInicial: z.string().optional().describe('Start due date YYYY-MM-DD'),
                        dataVencimentoFinal: z.string().optional().describe('End due date YYYY-MM-DD'),
                        dataPagamentoInicial: z.string().optional().describe('Start payment date YYYY-MM-DD'),
                        dataPagamentoFinal: z.string().optional().describe('End payment date YYYY-MM-DD'),
                        fornecedor: z.number().optional().describe('Supplier ID filter'),
                    })
                )
            },
            {
                name: 'list_document_modelos',
                description: 'List document templates (modelos de documentos)',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        descricao: z.string().optional().describe('Description filter'),
                        tipo: z.number().optional().describe('Document type: 0=Prescription, 1=Certificate, 2=Exam results, 3=Others, 4=Receipts'),
                        lingua: z.string().optional().describe('Language filter'),
                    })
                )
            },
            {
                name: 'get_fluxo_caixa_report',
                description: 'Get cash flow report for a date range',
                inputSchema: zodToJSONSchema(
                    z.object({
                        dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
                        dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
                        accountUnidade: z.number().optional().describe('Unit ID filter'),
                        conta: z.number().optional().describe('Account ID filter'),
                    })
                )
            },
            {
                name: 'get_categoria_receita_report',
                description: 'Get revenue by category report for a date range',
                inputSchema: zodToJSONSchema(
                    z.object({
                        dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
                        dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
                        accountUnidade: z.number().optional().describe('Unit ID filter'),
                    })
                )
            },
            {
                name: 'get_categoria_despesa_report',
                description: 'Get expenses by category report for a date range',
                inputSchema: zodToJSONSchema(
                    z.object({
                        dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
                        dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
                        accountUnidade: z.number().optional().describe('Unit ID filter'),
                    })
                )
            },
            // ========== PROFISSIONAIS (3 ferramentas) ==========
            {
                name: 'list_profissionais',
                description: 'List healthcare professionals',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        nome: z.string().optional().describe('Name filter'),
                        especialidade: z.number().optional().describe('Specialty ID filter'),
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                        accountUnidade: z.number().optional().describe('Unit ID filter'),
                    })
                )
            },
            {
                name: 'get_profissional',
                description: 'Get professional details by ID',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('Professional ID'),
                    })
                )
            },
            {
                name: 'list_profissional_agenda',
                description: 'List professional schedule/availability',
                inputSchema: zodToJSONSchema(
                    z.object({
                        profissional: z.number().describe('Professional ID (required)'),
                        diaSemana: z.number().optional().describe('Day of week: 0=Sunday, 1=Monday,...,6=Saturday'),
                    })
                )
            },
            // ========== CONVÊNIOS (2 ferramentas) ==========
            {
                name: 'list_convenios',
                description: 'List health insurance plans/convenios',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        descricao: z.string().optional().describe('Description filter'),
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                    })
                )
            },
            {
                name: 'get_convenio',
                description: 'Get insurance plan details by ID',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('Insurance plan ID'),
                    })
                )
            },
            // ========== SERVIÇOS (2 ferramentas) ==========
            {
                name: 'list_servicos',
                description: 'List medical services/procedures',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        descricao: z.string().optional().describe('Description filter'),
                        especialidade: z.number().optional().describe('Specialty ID filter'),
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                    })
                )
            },
            {
                name: 'get_servico',
                description: 'Get service details by ID',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('Service ID'),
                    })
                )
            },
            // ========== CONTAS BANCÁRIAS (2 ferramentas) ==========
            {
                name: 'list_contas',
                description: 'List bank accounts',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        descricao: z.string().optional().describe('Description filter'),
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                    })
                )
            },
            {
                name: 'get_conta_saldo',
                description: 'Get balance of all accounts',
                inputSchema: zodToJSONSchema(z.object({}))
            },
            // ========== FORNECEDORES (2 ferramentas) ==========
            {
                name: 'list_fornecedores',
                description: 'List suppliers',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        nomeFantasia: z.string().optional().describe('Trade name filter'),
                        cnpj: z.string().optional().describe('CNPJ filter'),
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                    })
                )
            },
            {
                name: 'create_fornecedor',
                description: 'Create a new supplier',
                inputSchema: zodToJSONSchema(
                    z.object({
                        nomeFantasia: z.string().describe('Trade name (required)'),
                        razaoSocial: z.string().optional().describe('Legal name'),
                        cnpj: z.string().optional().describe('CNPJ'),
                        cpf: z.string().optional().describe('CPF'),
                        telefone: z.string().describe('Phone (required)'),
                        email: z.string().describe('Email (required)'),
                        endereco: z.string().optional().describe('Address'),
                        cidade: z.string().optional().describe('City'),
                        estado: z.string().optional().describe('State'),
                        cep: z.string().optional().describe('ZIP code'),
                    })
                )
            },
            // ========== CATEGORIAS FINANCEIRAS (2 ferramentas) ==========
            {
                name: 'list_categorias_receita',
                description: 'List revenue categories',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                    })
                )
            },
            {
                name: 'list_categorias_despesa',
                description: 'List expense categories',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                    })
                )
            },
            // ========== RELATÓRIOS AVANÇADOS (4 ferramentas) ==========
            {
                name: 'get_tipo_pagamento_report',
                description: 'Get revenue by payment type report',
                inputSchema: zodToJSONSchema(
                    z.object({
                        dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
                        dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
                        accountUnidade: z.number().optional().describe('Unit ID filter'),
                    })
                )
            },
            {
                name: 'get_inadimplencia_report',
                description: 'Get overdue payments report',
                inputSchema: zodToJSONSchema(
                    z.object({
                        dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
                        dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
                        accountUnidade: z.number().optional().describe('Unit ID filter'),
                    })
                )
            },
            {
                name: 'get_profissional_report',
                description: 'Get revenue by professional report',
                inputSchema: zodToJSONSchema(
                    z.object({
                        dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
                        dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
                        accountUnidade: z.number().optional().describe('Unit ID filter'),
                    })
                )
            },
            {
                name: 'get_convenio_report',
                description: 'Get revenue by insurance plan report',
                inputSchema: zodToJSONSchema(
                    z.object({
                        dataInicial: z.string().describe('Start date YYYY-MM-DD (required)'),
                        dataFinal: z.string().describe('End date YYYY-MM-DD (required)'),
                        accountUnidade: z.number().optional().describe('Unit ID filter'),
                    })
                )
            },
            // ========== AGENDAMENTOS (1 ferramenta) ==========
            {
                name: 'create_agendamento',
                description: 'Create a new appointment',
                inputSchema: zodToJSONSchema(
                    z.object({
                        accountUnidade: z.number().describe('Unit ID (required)'),
                        profissional: z.number().describe('Professional ID (required)'),
                        data: z.string().describe('Date YYYY-MM-DD (required)'),
                        horaInicial: z.string().describe('Start time HH:MM:SS (required)'),
                        horaFinal: z.string().describe('End time HH:MM:SS (required)'),
                        paciente: z.number().describe('Patient ID (required)'),
                        servico: z.number().describe('Service ID (required)'),
                        especialidade: z.number().describe('Specialty ID (required)'),
                        status: z.number().describe('Status: 0=Scheduled, 2=Confirmed, 3=In Progress, 4=Completed, 5=Canceled'),
                        observacao: z.string().optional().describe('Notes'),
                    })
                )
            },
            {
                name: 'update_agendamento',
                description: 'Update/Reschedule an appointment',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('Appointment ID (required)'),
                        data: z.string().describe('New date YYYY-MM-DD (required)'),
                        horaInicial: z.string().describe('New start time HH:MM:SS (required)'),
                        horaFinal: z.string().describe('New end time HH:MM:SS (required)'),
                    })
                )
            },
            {
                name: 'cancel_agendamento',
                description: 'Cancel an appointment',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('Appointment ID (required)'),
                    })
                )
            },
            // ========== PRONTUÁRIOS (3 ferramentas) ==========
            {
                name: 'list_prontuarios',
                description: 'List medical records',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        paciente: z.number().optional().describe('Patient ID filter'),
                        profissional: z.number().optional().describe('Professional ID filter'),
                    })
                )
            },
            {
                name: 'get_prontuario',
                description: 'Get medical record details by ID',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('Medical record ID'),
                    })
                )
            },
            {
                name: 'create_prontuario',
                description: 'Create a new medical record',
                inputSchema: zodToJSONSchema(
                    z.object({
                        paciente: z.number().describe('Patient ID (required)'),
                        profissional: z.number().describe('Professional ID (required)'),
                        data: z.string().describe('Date YYYY-MM-DD (required)'),
                        hora: z.string().describe('Time HH:MM:SS (required)'),
                        queixaPrincipal: z.string().optional().describe('Main complaint'),
                        historiaDoenca: z.string().optional().describe('Disease history'),
                        exameFisico: z.string().optional().describe('Physical examination'),
                        diagnostico: z.string().optional().describe('Diagnosis'),
                        conduta: z.string().optional().describe('Treatment plan'),
                    })
                )
            },
            // ========== PRODUTOS/ESTOQUE (2 ferramentas) ==========
            {
                name: 'list_produtos',
                description: 'List products/inventory items',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        descricao: z.string().optional().describe('Description filter'),
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                    })
                )
            },
            {
                name: 'get_produto_estoque',
                description: 'Get product stock level by ID',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('Product ID'),
                    })
                )
            },
            // ========== MEDICAMENTOS (2 ferramentas - SOMENTE LEITURA) ==========
            {
                name: 'list_medicamentos',
                description: 'List medications from Ninsaúde central database (READ-ONLY)',
                inputSchema: zodToJSONSchema(
                    z.object({
                        limit: z.number().optional(),
                        offset: z.number().optional(),
                        nome: z.string().optional().describe('Medication name'),
                        laboratorio: z.string().optional().describe('Laboratory/manufacturer'),
                        principioAtivo: z.string().optional().describe('Active ingredient'),
                        ativo: z.number().optional().describe('Active status: 0=Inactive, 1=Active'),
                    })
                )
            },
            {
                name: 'get_medicamento',
                description: 'Get details of a specific medication from central database',
                inputSchema: zodToJSONSchema(
                    z.object({
                        id: z.string().describe('Medication ID'),
                    })
                )
            }
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        switch (request.params.name) {
            case 'list_patients': {
                const args = request.params.arguments || {};
                const patients = await api.listPatients(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(patients, null, 2),
                        },
                    ],
                };
            }
            case 'get_patient': {
                const args = request.params.arguments as { id: string };
                const patient = await api.getPatient(args.id);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(patient, null, 2),
                        }
                    ]
                }
            }
            case 'create_patient': {
                const args = request.params.arguments as any;
                const result = await api.createPatient(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'update_patient': {
                const args = request.params.arguments as any;
                const { id, ...data } = args;
                const result = await api.updatePatient(id, data);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'list_appointments': {
                const args = request.params.arguments || {};
                const appointments = await api.listAppointments(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(appointments, null, 2)
                        }
                    ]
                }
            }
            case 'list_surveys': {
                const args = request.params.arguments || {};
                const surveys = await api.listSurveys(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(surveys, null, 2)
                        }
                    ]
                }
            }
            case 'get_survey': {
                const args = request.params.arguments as { id: string };
                const survey = await api.getSurvey(args.id);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(survey, null, 2)
                        }
                    ]
                }
            }
            case 'create_survey': {
                const args = request.params.arguments as { descricao: string; ativo: number };
                const result = await api.createSurvey({
                    descricao: args.descricao,
                    ativo: args.ativo
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'update_survey': {
                const args = request.params.arguments as { id: string; descricao: string; ativo: number };
                const result = await api.updateSurvey(args.id, {
                    descricao: args.descricao,
                    ativo: args.ativo
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'delete_survey': {
                const args = request.params.arguments as { id: string };
                const result = await api.deleteSurvey(args.id);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'create_receita': {
                const args = request.params.arguments as any;
                const result = await api.createReceita(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'list_receitas': {
                const args = request.params.arguments || {};
                const result = await api.listReceitas(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'create_despesa': {
                const args = request.params.arguments as any;
                const result = await api.createDespesa(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'list_despesas': {
                const args = request.params.arguments || {};
                const result = await api.listDespesas(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'list_document_modelos': {
                const args = request.params.arguments || {};
                const result = await api.listDocumentModelos(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'get_fluxo_caixa_report': {
                const args = request.params.arguments as { dataInicial: string; dataFinal: string; accountUnidade?: number; conta?: number };
                const result = await api.getFluxoCaixaReport(args.dataInicial, args.dataFinal, {
                    accountUnidade: args.accountUnidade,
                    conta: args.conta
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'get_categoria_receita_report': {
                const args = request.params.arguments as { dataInicial: string; dataFinal: string; accountUnidade?: number };
                const result = await api.getCategoriaReceitaReport(args.dataInicial, args.dataFinal, {
                    accountUnidade: args.accountUnidade
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }
            case 'get_categoria_despesa_report': {
                const args = request.params.arguments as { dataInicial: string; dataFinal: string; accountUnidade?: number };
                const result = await api.getCategoriaDespesaReport(args.dataInicial, args.dataFinal, {
                    accountUnidade: args.accountUnidade
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                }
            }

            // ========== PROFISSIONAIS (3 handlers) ==========
            case 'list_profissionais': {
                const args = request.params.arguments || {};
                const result = await api.listProfissionais(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_profissional': {
                const args = request.params.arguments as { id: string };
                const result = await api.getProfissional(args.id);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'list_profissional_agenda': {
                const args = request.params.arguments || {};
                const result = await api.listProfissionalAgenda(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== CONVÊNIOS (2 handlers) ==========
            case 'list_convenios': {
                const args = request.params.arguments || {};
                const result = await api.listConvenios(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_convenio': {
                const args = request.params.arguments as { id: string };
                const result = await api.getConvenio(args.id);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== SERVIÇOS (2 handlers) ==========
            case 'list_servicos': {
                const args = request.params.arguments || {};
                const result = await api.listServicos(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_servico': {
                const args = request.params.arguments as { id: string };
                const result = await api.getServico(args.id);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== CONTAS BANCÁRIAS (2 handlers) ==========
            case 'list_contas': {
                const args = request.params.arguments || {};
                const result = await api.listContas(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_conta_saldo': {
                const result = await api.getContaSaldo();
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== FORNECEDORES (2 handlers) ==========
            case 'list_fornecedores': {
                const args = request.params.arguments || {};
                const result = await api.listFornecedores(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'create_fornecedor': {
                const args = request.params.arguments as any;
                const result = await api.createFornecedor(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== CATEGORIAS FINANCEIRAS (2 handlers) ==========
            case 'list_categorias_receita': {
                const args = request.params.arguments || {};
                const result = await api.listCategoriasReceita(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'list_categorias_despesa': {
                const args = request.params.arguments || {};
                const result = await api.listCategoriasDespesa(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== RELATÓRIOS AVANÇADOS (4 handlers) ==========
            case 'get_tipo_pagamento_report': {
                const args = request.params.arguments as { dataInicial: string; dataFinal: string; accountUnidade?: number };
                const result = await api.getTipoPagamentoReport(args.dataInicial, args.dataFinal, {
                    accountUnidade: args.accountUnidade
                });
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_inadimplencia_report': {
                const args = request.params.arguments as { dataInicial: string; dataFinal: string; accountUnidade?: number };
                const result = await api.getInadimplenciaReport(args.dataInicial, args.dataFinal, {
                    accountUnidade: args.accountUnidade
                });
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_profissional_report': {
                const args = request.params.arguments as { dataInicial: string; dataFinal: string; accountUnidade?: number };
                const result = await api.getProfissionalReport(args.dataInicial, args.dataFinal, {
                    accountUnidade: args.accountUnidade
                });
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_convenio_report': {
                const args = request.params.arguments as { dataInicial: string; dataFinal: string; accountUnidade?: number };
                const result = await api.getConvenioReport(args.dataInicial, args.dataFinal, {
                    accountUnidade: args.accountUnidade
                });
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== AGENDAMENTOS (1 handler) ==========
            case 'create_agendamento': {
                const args = request.params.arguments as any;
                const result = await api.createAgendamento(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'update_agendamento': {
                const args = request.params.arguments as any;
                const { id, ...data } = args;
                const result = await api.updateAgendamento(id, data);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'cancel_agendamento': {
                const args = request.params.arguments as { id: string };
                const result = await api.cancelAgendamento(args.id);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== PRONTUÁRIOS (3 handlers) ==========
            case 'list_prontuarios': {
                const args = request.params.arguments || {};
                const result = await api.listProntuarios(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_prontuario': {
                const args = request.params.arguments as { id: string };
                const result = await api.getProntuario(args.id);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'create_prontuario': {
                const args = request.params.arguments as any;
                const result = await api.createProntuario(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== PRODUTOS/ESTOQUE (2 handlers) ==========
            case 'list_produtos': {
                const args = request.params.arguments || {};
                const result = await api.listProdutos(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_produto_estoque': {
                const args = request.params.arguments as { id: string };
                const result = await api.getProdutoEstoque(args.id);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            // ========== MEDICAMENTOS (2 handlers - SOMENTE LEITURA) ==========
            case 'list_medicamentos': {
                const args = request.params.arguments || {};
                const result = await api.listMedicamentos(args);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }
            case 'get_medicamento': {
                const args = request.params.arguments as { id: string };
                const result = await api.getMedicamento(args.id);
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
                }
            }

            default:
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${request.params.name}`
                );
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});

// Helper to convert Zod schema to JSON schema
function zodToJSONSchema(schema: z.ZodType<any>): any {
    // This is a simplified conversion. 
    // In a real production app, use zod-to-json-schema package.
    // implementing a minimal recursive converter here for illustration or adding dependency.
    // Adding zod-to-json-schema dependency would be better.
    // For now, I'll attempt to construct the schema structure manually in the tools definition 
    // or just rely on a basic conversion if I had the library.
    // Let's actually install `zod-to-json-schema` to be safe and correct.
    return require('zod-to-json-schema').zodToJsonSchema(schema);
}

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Ninsaúde MCP Server running on stdio');
}

run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});

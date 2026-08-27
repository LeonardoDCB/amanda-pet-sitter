const { z } = require('zod');

const orcamentoSchema = z.object({
  nome_cliente: z.string().trim().min(2).max(100),
  contato: z.string().trim().min(5).max(60),
  tipo_pet: z.enum(['cachorro', 'gato', 'outro']),
  tipo_servico: z.enum(['visita', 'hospedagem', 'passeio', 'creche', 'banho']),
  porte: z.enum(['Pequeno', 'Grande']),
  usa_medicacao: z.enum(['sim', 'nao']),
  medicacao_detalhes: z.string().max(500).optional().nullable(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD'),
  data_fim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD')
    .nullable()
    .optional(),
  mensagem: z.string().max(2000).optional().default(''),
  website: z.string().max(100).optional().default('')
});

const loginSchema = z.object({
  usuario: z.string().min(1),
  senha: z.string().min(1)
});

const statusOrcamentoSchema = z.object({
  status: z.enum(['novo', 'lido', 'contatado', 'arquivado'])
});

const statusGaleriaSchema = z.object({
  status: z.enum(['publicado', 'oculto'])
});

const legendaSchema = z.object({
  legenda: z.string().max(200).nullable().optional()
});

const statusPedidoSchema = z.object({
  status: z.enum(['recebido', 'pago', 'enviado', 'concluido', 'cancelado'])
});

const produtoSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  descricao: z.string().max(2000).optional().default(''),
  preco_centavos: z.coerce.number().int().min(0).max(999999999),
  estoque: z.coerce.number().int().min(0).max(999999).optional().nullable(),
  ativo: z.enum(['sim', 'nao']).optional().default('sim'),
  ordem: z.coerce.number().int().min(0).max(999999).optional().default(0)
});

const produtoPatchSchema = z.object({
  nome: z.string().trim().min(2).max(120).optional(),
  descricao: z.string().max(2000).optional(),
  preco_centavos: z.coerce.number().int().min(0).max(999999999).optional(),
  estoque: z.coerce.number().int().min(0).max(999999).optional().nullable(),
  ativo: z.enum(['sim', 'nao']).optional(),
  ordem: z.coerce.number().int().min(0).max(999999).optional()
});

const itemPedidoSchema = z.object({
  produto_id: z.number().int().positive(),
  quantidade: z.number().int().min(1).max(999)
});

const pedidoSchema = z.object({
  nome_cliente: z.string().trim().min(2).max(100),
  contato: z.string().trim().min(5).max(60),
  itens: z.array(itemPedidoSchema).min(1).max(50),
  observacoes: z.string().max(2000).optional().default(''),
  website: z.string().max(100).optional().default('')
});

const depoimentoSchema = z.object({
  autor: z.string().trim().max(100).optional().nullable(),
  texto: z.string().max(2000).optional().nullable(),
  ativo: z.enum(['sim', 'nao']).optional().default('sim'),
  ordem: z.coerce.number().int().min(0).max(999999).optional().default(0),
  avaliacao: z.coerce.number().int().min(1).max(5).optional()
});

function validar(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({
        erro: 'Dados inválidos',
        detalhes: resultado.error.flatten()
      });
    }
    req.dados = resultado.data;
    next();
  };
}

module.exports = {
  orcamentoSchema,
  loginSchema,
  statusOrcamentoSchema,
  statusGaleriaSchema,
  statusPedidoSchema,
  legendaSchema,
  produtoSchema,
  produtoPatchSchema,
  pedidoSchema,
  depoimentoSchema,
  validar
};
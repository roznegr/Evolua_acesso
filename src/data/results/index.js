/**
 * Textos do diagnóstico. Sem estatísticas, sem percentuais, sem afirmar que o condomínio "é seguro".
 * O diagnóstico é preliminar e nunca recomenda uma solução específica (ex.: "portaria remota").
 */
export const DISCLAIMER =
  'Este é um diagnóstico preliminar baseado nas respostas fornecidas. Uma avaliação completa depende da análise da estrutura e operação do condomínio.';

export const LEVEL_LABELS = {
  structured: 'Estruturado',
  improvement: 'Oportunidade de melhoria',
  attention: 'Ponto de atenção',
};

export const DIMENSION_META = {
  accessControl: {
    label: 'Controle de acesso',
    description: 'Quão estruturado parece ser o processo de entrada de visitantes e terceiros.',
  },
  traceability: {
    label: 'Rastreabilidade',
    description: 'Capacidade aparente de consultar e reconstruir eventos de acesso.',
  },
  continuity: {
    label: 'Continuidade operacional',
    description: 'Quanto a operação parece preparada para falhas e contingências.',
  },
  efficiency: {
    label: 'Eficiência operacional',
    description: 'Quanto os processos parecem padronizados e apoiados por tecnologia.',
  },
};

/** Texto da dimensão no resultado completo, por nível. */
export const DIMENSION_COPY = {
  accessControl: {
    attention:
      'Pelas respostas, o processo de liberação de acessos parece pouco padronizado. Vale revisar como visitantes e terceiros são autorizados e como isso é acompanhado.',
    improvement:
      'Há uma base de controle, mas algumas etapas podem depender de quem está de plantão ou da situação. Padronizar costuma trazer mais previsibilidade.',
    structured:
      'As respostas indicam um processo de acesso com etapas definidas. Uma análise completa ajuda a confirmar se ele se mantém em todos os horários e situações.',
  },
  traceability: {
    attention:
      'Parte das informações de acesso pode não estar disponível de forma simples quando é necessário reconstruir um evento. Esse é um ponto que merece olhar mais detalhado.',
    improvement:
      'Existem registros, mas consultá-los pode exigir esforço ou ter lacunas. Vale entender o que fica registrado e como é feita a consulta.',
    structured:
      'As respostas indicam que é possível consultar quem entrou e quando, com razoável facilidade.',
  },
  continuity: {
    attention:
      'Pelas respostas, vale revisar como o acesso funcionaria diante de indisponibilidade de internet, energia ou equipamentos. A ausência de um procedimento claro costuma aparecer justamente nos piores momentos.',
    improvement:
      'Existe alguma preparação para falhas, mas com dúvidas ou dependência da situação. Formalizar o procedimento ajuda a operação a responder da mesma forma sempre.',
    structured:
      'As respostas indicam que há um procedimento definido para falhas. Vale confirmar se ele é conhecido por todos e testado.',
  },
  efficiency: {
    attention:
      'Os processos parecem pouco padronizados e com pouco apoio de tecnologia. Isso tende a gerar retrabalho e dependência de quem está operando.',
    improvement:
      'Parte da operação já é padronizada, mas ainda há etapas manuais ou variáveis. Há espaço para ganhar consistência.',
    structured:
      'As respostas indicam processos razoavelmente padronizados e apoiados por ferramentas.',
  },
};

/** Narrativa personalizada pela dor (pergunta 7). `bridge` conecta a dor à análise completa da Evolua. */
export const PAIN_COPY = {
  access_security: {
    title: 'Você indicou segurança dos acessos como preocupação',
    body: 'Preocupação com segurança é válida, mas ela não indica por si só um problema. O que a análise avalia é como o acesso é controlado e se é possível reconstruir o que aconteceu quando necessário.',
  },
  cost: {
    title: 'Você indicou o custo da operação como preocupação',
    body: 'Uma análise completa considera os dois lados: como ganhar previsibilidade e eficiência na operação sem tratar custo e controle de acesso separadamente.',
  },
  visitors: {
    title: 'Você indicou a gestão de visitantes como preocupação',
    body: 'Visitantes costumam ser o ponto em que processo e rotina mais se encontram. A análise olha como a autorização acontece hoje e se o mesmo padrão vale para todos os moradores.',
  },
  providers: {
    title: 'Você indicou o acesso de prestadores como preocupação',
    body: 'Prestadores têm dinâmica diferente de visitantes (horários, recorrência, identificação). A análise considera se existe uma regra clara e consultável para esse tipo de acesso.',
  },
  deliveries: {
    title: 'Você indicou a gestão de entregas como preocupação',
    body: 'Entregas costumam ser grande parte do movimento diário. A análise considera como elas são recebidas, registradas e comunicadas ao morador.',
  },
  no_records: {
    title: 'Você indicou a falta de registros como preocupação',
    body: 'Sem registros fica difícil esclarecer ocorrências e prestar contas ao conselho. A análise olha o que é registrado, onde fica guardado e com que facilidade é consultado.',
  },
  porter_dependency: {
    title: 'Você indicou a dependência do porteiro como preocupação',
    body: 'Quando o acesso depende da pessoa de plantão, a rotina varia de turno a turno. A análise considera o que pode ser padronizado para a operação funcionar da mesma forma independentemente de quem está lá.',
  },
  resident_complaints: {
    title: 'Você indicou reclamações dos moradores como preocupação',
    body: 'Reclamações costumam vir de inconsistência: regras que mudam conforme o dia ou o turno. A análise olha padronização e previsibilidade da experiência de quem mora.',
  },
  no_specific: {
    title: 'Você não indicou um problema específico',
    body: 'Isso é um bom ponto de partida: dá para olhar a estrutura com calma, antes de uma urgência.',
  },
};

export const PAIN_BRIDGE =
  'É esse tipo de relação entre o que preocupa e o que a estrutura entrega que a análise completa da Evolua considera.';

/** Rótulo curto para briefing comercial e relatório. */
export const PAIN_LABELS = {
  access_security: 'Segurança dos acessos',
  cost: 'Custo da operação',
  visitors: 'Visitantes',
  providers: 'Prestadores de serviço',
  deliveries: 'Entregas',
  no_records: 'Falta de registros',
  porter_dependency: 'Dependência do porteiro',
  resident_complaints: 'Reclamações dos moradores',
  no_specific: 'Sem problema específico',
};

/** CTA/mensagem por papel (pergunta 8). */
export const ROLE_COPY = {
  sindico: {
    label: 'Síndico(a)',
    cta: 'Veja os principais pontos para levar ao conselho.',
  },
  subsindico: {
    label: 'Subsíndico(a)',
    cta: 'Veja os pontos que merecem discussão com o síndico e o conselho.',
  },
  administradora: {
    label: 'Administradora',
    cta: 'Veja oportunidades que podem ser discutidas com o condomínio.',
  },
  conselheiro: {
    label: 'Conselheiro(a)',
    cta: 'Veja os pontos que merecem discussão com o síndico e a administradora.',
  },
  morador: {
    label: 'Morador(a)',
    cta: 'Veja quais perguntas podem ser levadas à administração do condomínio.',
  },
  other: {
    label: 'Outro',
    cta: 'Veja os pontos que podem ser levados a quem decide no condomínio.',
  },
};

/** Opções legíveis para o briefing comercial (rótulos por pergunta/valor vêm de data/questions). */

/**
 * Insights disparados por respostas específicas.
 * `when`: { question, values[] } — dispara se a resposta estiver em `values`.
 */
export const INSIGHTS = [
  {
    id: 'no_single_visitor_process',
    dimension: 'accessControl',
    when: { question: 'visitorProcess', values: ['no_single_process'] },
    text: 'A ausência de um padrão para autorização de visitantes pode dificultar tanto o controle quanto a consulta posterior dos acessos.',
  },
  {
    id: 'no_contingency',
    dimension: 'continuity',
    when: { question: 'contingency', values: ['none', 'depends'] },
    text: 'Sem um procedimento definido para falhas de internet, energia ou equipamento, a operação tende a improvisar quando o problema acontece.',
  },
  {
    id: 'records_hard',
    dimension: 'traceability',
    when: { question: 'accessRecords', values: ['partial', 'no'] },
    text: 'Se for preciso esclarecer uma ocorrência, informações incompletas podem limitar o que o condomínio consegue reconstruir.',
  },
  {
    id: 'camera_gaps',
    dimension: 'traceability',
    when: { question: 'cameraCoverage', values: ['gaps', 'very_limited', 'unknown_access'] },
    text: 'Ter câmeras é diferente de ter cobertura nos principais acessos e conseguir consultar as imagens. Vale confirmar os dois pontos.',
  },
  {
    id: 'undefined_model',
    dimension: 'efficiency',
    when: { question: 'currentModel', values: ['undefined'] },
    text: 'Quando não há estrutura definida, a operação depende de arranjos informais que variam de pessoa para pessoa.',
  },
];

/** Gerado quando houver respostas "não sei" suficientes. */
export const VISIBILITY_INSIGHT = {
  id: 'low_visibility',
  minUnsure: 2,
  text: 'Algumas respostas foram "não sei". Isso é comum e já é uma informação útil: conhecer melhor como a operação funciona é o primeiro passo para avaliar qualquer mudança.',
};

/** Mensagens do pré-resultado (antes da captura). */
export const PREVIEW_COPY = {
  title: 'Análise concluída',
  subtitle: 'Veja como as respostas se distribuem nas quatro dimensões avaliadas.',
  gate: {
    none: 'As respostas indicam uma estrutura organizada nas quatro dimensões. Uma análise completa ainda pode apontar detalhes e perguntas úteis para o conselho.',
    one: 'Identificamos 1 ponto que merece uma análise mais detalhada.',
    many: (n) => `Identificamos ${n} pontos que merecem uma análise mais detalhada.`,
  },
  cta: 'Receber minha análise completa',
};

export const FULL_RESULT_COPY = {
  title: 'Seu diagnóstico preliminar',
  primaryLabel: 'Principal ponto identificado',
  secondaryLabel: 'Também merece atenção',
  allStructured:
    'Pelas respostas, não há um ponto que se destaque como lacuna. Mesmo assim, uma análise completa costuma revelar detalhes que o questionário não alcança.',
  relatedBadge: 'Relacionado à sua preocupação',
  closing:
    'Com base nas respostas, existem pontos que justificam uma análise mais detalhada da estrutura atual. É isso que a Evolua faz na análise completa.',
};

/** Perguntas para o checklist de conselho/administradora, por dimensão. */
export const DISCUSSION_QUESTIONS = {
  accessControl: [
    'Existe um processo único e conhecido por todos para autorizar visitantes e prestadores?',
    'Quem pode autorizar um acesso e como isso fica registrado?',
  ],
  traceability: [
    'Os registros de acesso podem ser consultados rapidamente por data e horário?',
    'Todos os principais acessos estão cobertos por câmeras e as imagens podem ser consultadas por quem precisa?',
  ],
  continuity: [
    'Existe procedimento formal para falha de internet, energia ou equipamento?',
    'Esse procedimento já foi testado e quem é responsável por acioná-lo?',
  ],
  efficiency: [
    'Os processos de portaria funcionam da mesma forma em qualquer turno ou dia?',
    'Quais etapas dependem de ação manual e quais poderiam ser padronizadas?',
  ],
};

/** Perguntas gerais para avaliar qualquer solução (independente do diagnóstico). */
export const SOLUTION_EVALUATION_QUESTIONS = [
  'Como o acesso continua funcionando se a internet, a energia ou o equipamento falhar?',
  'Quais registros ficam guardados, por quanto tempo e quem pode consultá-los?',
  'Como são tratados dados pessoais de moradores e visitantes (LGPD)?',
  'Qual é o processo de implantação e quem treina moradores e equipe?',
  'Como é o suporte quando algo não funciona e qual o tempo de resposta combinado?',
  'Quais são todos os custos envolvidos (implantação, mensalidade, manutenção)?',
];

export const ASSEMBLY_COPY = {
  title: 'Prepare a discussão com seu condomínio.',
  intro:
    'A Evolua pode disponibilizar um material baseado nas suas respostas para apoiar a conversa com o conselho, a administradora e a assembleia:',
  items: [
    'Resumo do diagnóstico',
    'Pontos identificados',
    'Perguntas importantes para avaliar soluções',
    'Checklist para conselho e administradora',
    'Informações que podem apoiar a discussão em assembleia',
  ],
};

export const CONFIRMATION_COPY = {
  title: 'Recebemos seu pedido',
  body: 'A Evolua vai entrar em contato pelo WhatsApp informado para apresentar a análise completa.',
};

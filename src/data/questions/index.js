/**
 * Perguntas do diagnóstico. Edite aqui textos, opções e ordem.
 * `value` é o identificador estável usado em scoring/results/analytics — não renomeie sem
 * atualizar os arquivos de scoring e results.
 *
 * type: 'single' | 'multi' (multi respeita `max` e `exclusive`)
 * kind: 'diagnostic' (pontua) | 'context' (só comercial/personalização)
 */
export const QUESTIONS = [
  {
    id: 'unitRange',
    kind: 'context',
    type: 'single',
    title: 'Quantas unidades possui o condomínio?',
    helper: 'Usamos para entender o contexto. Não altera o diagnóstico.',
    options: [
      { value: 'up_to_20', label: 'Até 20' },
      { value: '21_50', label: '21 a 50' },
      { value: '51_100', label: '51 a 100' },
      { value: '101_200', label: '101 a 200' },
      { value: 'over_200', label: 'Mais de 200' },
      { value: 'unknown', label: 'Não sei informar' },
    ],
  },
  {
    id: 'currentModel',
    kind: 'diagnostic',
    type: 'single',
    title: 'Como funciona o controle de acesso atualmente?',
    options: [
      { value: 'porter_24h', label: 'Porteiro 24h' },
      { value: 'porter_partial', label: 'Porteiro em horário parcial' },
      { value: 'remote', label: 'Portaria remota' },
      { value: 'hybrid', label: 'Sistema híbrido' },
      { value: 'undefined', label: 'Não existe uma estrutura definida' },
    ],
  },
  {
    id: 'visitorProcess',
    kind: 'diagnostic',
    type: 'single',
    title: 'Como os visitantes são liberados hoje?',
    helper: 'Pense no que acontece na maior parte dos casos.',
    options: [
      { value: 'pre_authorized', label: 'O morador autoriza previamente' },
      { value: 'confirm_now', label: 'O porteiro ou interfone confirma no momento' },
      { value: 'whatsapp', label: 'A autorização acontece por WhatsApp' },
      { value: 'app_system', label: 'Usamos aplicativo ou sistema de controle de acesso' },
      { value: 'no_single_process', label: 'Não existe um processo único' },
      { value: 'unknown', label: 'Não sei informar' },
    ],
  },
  {
    id: 'accessRecords',
    kind: 'diagnostic',
    type: 'single',
    title:
      'Se fosse preciso verificar quem entrou no condomínio em determinado dia e horário, essa informação estaria disponível com facilidade?',
    options: [
      { value: 'fast', label: 'Sim, de forma rápida' },
      { value: 'laborious', label: 'Sim, mas dá trabalho localizar' },
      { value: 'partial', label: 'Apenas algumas informações ficam registradas' },
      { value: 'no', label: 'Não' },
      { value: 'unknown', label: 'Não sei' },
    ],
  },
  {
    id: 'cameraCoverage',
    kind: 'diagnostic',
    type: 'single',
    title: 'Como é a cobertura das câmeras nos principais pontos de acesso?',
    options: [
      { value: 'full_coverage', label: 'Os principais acessos estão cobertos e as imagens podem ser consultadas' },
      { value: 'gaps', label: 'Existem câmeras, mas há pontos sem cobertura' },
      { value: 'unknown_access', label: 'Existem câmeras, mas não sei como funciona o acesso às gravações' },
      { value: 'very_limited', label: 'A cobertura é muito limitada' },
      { value: 'none', label: 'Não existem câmeras' },
      { value: 'unknown', label: 'Não sei informar' },
    ],
  },
  {
    id: 'contingency',
    kind: 'diagnostic',
    type: 'single',
    title:
      'Se houver falha de internet, energia ou de algum equipamento, vocês sabem exatamente como o acesso continuará funcionando?',
    options: [
      { value: 'defined', label: 'Sim, existe um procedimento definido' },
      { value: 'doubts', label: 'Existe algum procedimento, mas tenho dúvidas' },
      { value: 'depends', label: 'Depende da situação' },
      { value: 'none', label: 'Não existe procedimento definido' },
      { value: 'unknown', label: 'Não sei informar' },
    ],
  },
  {
    id: 'mainPain',
    kind: 'context',
    type: 'multi',
    max: 2,
    exclusive: ['no_specific'],
    title: 'Quando você pensa na portaria do condomínio hoje, o que mais preocupa?',
    helper: 'Escolha até 2.',
    options: [
      { value: 'access_security', label: 'Segurança dos acessos' },
      { value: 'cost', label: 'Custo da operação' },
      { value: 'visitors', label: 'Visitantes' },
      { value: 'providers', label: 'Prestadores de serviço' },
      { value: 'deliveries', label: 'Entregas' },
      { value: 'no_records', label: 'Falta de registros' },
      { value: 'porter_dependency', label: 'Dependência do porteiro' },
      { value: 'resident_complaints', label: 'Reclamações dos moradores' },
      { value: 'no_specific', label: 'Não existe um problema específico' },
    ],
  },
  {
    id: 'userRole',
    kind: 'context',
    type: 'single',
    title: 'Qual é a sua relação com o condomínio?',
    options: [
      { value: 'sindico', label: 'Síndico(a)' },
      { value: 'subsindico', label: 'Subsíndico(a)' },
      { value: 'conselheiro', label: 'Conselheiro(a)' },
      { value: 'administradora', label: 'Administradora' },
      { value: 'morador', label: 'Morador(a)' },
      { value: 'other', label: 'Outro' },
    ],
  },
];

/** Pergunta de timing — feita DEPOIS da captura (não faz parte do fluxo de 8 perguntas). */
export const TIMING_QUESTION = {
  id: 'timing',
  title: 'Para entendermos o momento do condomínio: existe intenção de rever a estrutura da portaria?',
  options: [
    { value: 'evaluating', label: 'Já estamos avaliando alternativas' },
    { value: 'next_months', label: 'Pretendemos avaliar nos próximos meses' },
    { value: 'discussed', label: 'O assunto já apareceu em reunião ou assembleia' },
    { value: 'researching', label: 'Estou apenas pesquisando' },
    { value: 'no_discussion', label: 'Não existe uma discussão atualmente' },
  ],
};

export const QUESTION_IDS = QUESTIONS.map((q) => q.id);
export const getQuestion = (id) => QUESTIONS.find((q) => q.id === id);

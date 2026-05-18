import { useState } from 'react';
import {
  Save, Globe, Mail, Shield, AlertTriangle, ToggleLeft, ToggleRight,
  Palette, BookOpen, CreditCard, Webhook, BarChart3, Lock, Bell,
  ChevronRight, ExternalLink, Copy, RefreshCw, Check, Eye, EyeOff
} from 'lucide-react';

type Section = 'geral' | 'plataforma' | 'email' | 'pagamentos' | 'integracoes' | 'privacidade' | 'perigo';

const inputCls = "w-full h-9 px-3 bg-[#09090b] border border-[#27272a] rounded-lg text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger transition-all";
const labelCls = "block text-sm font-semibold text-white mb-0.5";
const descCls  = "text-xs text-[#71717a]";

const Toggle = ({ value, onChange, label, desc, badge }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-[#27272a]/60 last:border-0">
    <div>
      <div className="flex items-center gap-2 mb-0.5">
        <p className="text-sm font-semibold text-white">{label}</p>
        {badge && <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${badge === 'Recomendado' ? 'text-success bg-success/10 border-success/20' : 'text-warning bg-warning/10 border-warning/20'}`}>{badge}</span>}
      </div>
      <p className="text-xs text-[#71717a]">{desc}</p>
    </div>
    <button onClick={() => onChange(!value)} className={`transition-colors shrink-0 ml-4 ${value ? 'text-success' : 'text-[#52525b]'}`}>
      {value ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}
    </button>
  </div>
);

const Field = ({ label, desc, children }: any) => (
  <div className="flex flex-col md:flex-row gap-3 md:gap-8 py-5 border-b border-[#27272a]/60 last:border-0">
    <div className="w-full md:w-2/5 shrink-0">
      <p className={labelCls}>{label}</p>
      {desc && <p className={descCls}>{desc}</p>}
    </div>
    <div className="w-full md:w-3/5">{children}</div>
  </div>
);

const SectionCard = ({ title, desc, icon: Icon, children }: any) => (
  <div className="bg-[#121214] border border-[#27272a] rounded-2xl overflow-hidden">
    <div className="p-6 border-b border-[#27272a]">
      <h3 className="text-base font-bold text-white flex items-center gap-2 mb-0.5">
        <Icon size={16} className="text-danger" /> {title}
      </h3>
      <p className="text-xs text-[#71717a]">{desc}</p>
    </div>
    <div className="px-6">{children}</div>
  </div>
);

const ApiKeyField = ({ label, value }: { label: string; value: string }) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const masked = '••••••••••••••••••••••••••••••••';

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            readOnly
            value={visible ? value : masked}
            className={`${inputCls} font-mono text-xs pr-10`}
          />
          <button onClick={() => setVisible(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-white transition-colors">
            {visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <button onClick={copy} className="w-9 h-9 rounded-lg border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] flex items-center justify-center text-[#71717a] hover:text-white transition-colors">
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
        <button className="w-9 h-9 rounded-lg border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] flex items-center justify-center text-[#71717a] hover:text-white transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>
    </Field>
  );
};

export const AdminSettings = () => {
  const [section, setSection] = useState<Section>('geral');

  // State
  const [maintenance, setMaintenance]   = useState(false);
  const [registrations, setRegistrations] = useState(true);
  const [autoApprove, setAutoApprove]   = useState(false);
  const [emailVerify, setEmailVerify]   = useState(true);
  const [twoFactor, setTwoFactor]       = useState(false);
  const [welcomeEmail, setWelcomeEmail] = useState(true);
  const [promoEmail, setPromoEmail]     = useState(false);
  const [certEmail, setCertEmail]       = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(true);
  const [dataRetention, setDataRetention] = useState(true);

  const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: 'geral',        label: 'Geral',                icon: Globe },
    { id: 'plataforma',   label: 'Plataforma',           icon: Shield },
    { id: 'email',        label: 'E-mail & Notificações',icon: Mail },
    { id: 'pagamentos',   label: 'Pagamentos',           icon: CreditCard },
    { id: 'integracoes',  label: 'Integrações & API',    icon: Webhook },
    { id: 'privacidade',  label: 'Privacidade & LGPD',   icon: Lock },
    { id: 'perigo',       label: 'Zona de Perigo',       icon: AlertTriangle },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Configurações</h1>
        <p className="text-[#71717a] text-sm">Gerencie as configurações globais da plataforma VirtuLearning.</p>
      </div>

      <div className="flex gap-6">
        {/* Left Nav */}
        <aside className="w-52 shrink-0">
          <nav className="flex flex-col gap-0.5 sticky top-4">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                    active
                      ? 'bg-danger/10 text-danger font-bold border border-danger/20'
                      : 'text-[#71717a] hover:text-white hover:bg-[#18181b] border border-transparent'
                  }`}
                >
                  <Icon size={15} />
                  <span className="truncate">{item.label}</span>
                  {item.id === 'perigo' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-danger"></div>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* ── GERAL ─────────────────────────────────── */}
          {section === 'geral' && (
            <>
              <SectionCard title="Identidade Visual" desc="Nome e aparência exibidos publicamente." icon={Palette}>
                <Field label="Nome da Plataforma" desc="Exibido no cabeçalho, e-mails e documentos.">
                  <input className={inputCls} defaultValue="VirtuLearning" />
                </Field>
                <Field label="Slogan" desc="Frase curta exibida na landing page.">
                  <input className={inputCls} defaultValue="Aprenda. Evolua. Conecte-se." />
                </Field>
                <Field label="URL da Logo" desc="Link direto para PNG ou SVG (mín. 200x200px).">
                  <input className={inputCls} placeholder="https://cdn.exemplo.com/logo.svg" />
                </Field>
                <Field label="Favicon URL" desc="Ícone exibido na aba do navegador (32x32px).">
                  <input className={inputCls} placeholder="https://cdn.exemplo.com/favicon.ico" />
                </Field>
                <Field label="Cor de Destaque" desc="Cor primária usada em botões e links.">
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#FFD700" className="w-9 h-9 rounded-lg border border-[#27272a] bg-[#09090b] cursor-pointer p-1 shrink-0" />
                    <input className={`${inputCls} flex-1`} defaultValue="#FFD700" />
                  </div>
                </Field>
                <Field label="URL da Plataforma" desc="Domínio principal onde a plataforma está hospedada.">
                  <input className={inputCls} defaultValue="https://virtulearning.com.br" />
                </Field>
              </SectionCard>

              <SectionCard title="SEO & Metadados" desc="Configurações de indexação e redes sociais." icon={BarChart3}>
                <Field label="Título da Página" desc="Exibido na aba do navegador e resultados de busca.">
                  <input className={inputCls} defaultValue="VirtuLearning — Aprenda com os melhores" />
                </Field>
                <Field label="Meta Descrição" desc="Descrição exibida nos resultados do Google (máx. 160 caracteres).">
                  <textarea className={`${inputCls} h-20 resize-none py-2`} defaultValue="Plataforma de cursos online com os melhores professores do Brasil." />
                </Field>
                <Field label="Palavras-chave" desc="Separadas por vírgula.">
                  <input className={inputCls} defaultValue="cursos online, EAD, programação, design, marketing" />
                </Field>
              </SectionCard>
            </>
          )}

          {/* ── PLATAFORMA ────────────────────────────── */}
          {section === 'plataforma' && (
            <>
              <SectionCard title="Acesso e Cadastro" desc="Controles de quem pode entrar e como." icon={Shield}>
                <Toggle value={registrations} onChange={setRegistrations}
                  label="Cadastros abertos" desc="Permite que novos usuários se registrem." badge="Recomendado" />
                <Toggle value={emailVerify} onChange={setEmailVerify}
                  label="Verificação de e-mail obrigatória" desc="Usuário deve confirmar o e-mail antes de acessar." badge="Recomendado" />
                <Toggle value={twoFactor} onChange={setTwoFactor}
                  label="2FA obrigatório para admins" desc="Administradores precisam ativar autenticação em dois fatores." />
              </SectionCard>

              <SectionCard title="Professores e Cursos" desc="Regras de publicação e aprovação." icon={BookOpen}>
                <Toggle value={autoApprove} onChange={setAutoApprove}
                  label="Aprovação automática de professores" desc="Candidaturas aprovadas sem revisão manual." />
                <Field label="Máx. cursos por professor" desc="Limite de cursos ativos simultâneos.">
                  <input className={inputCls} type="number" defaultValue={10} />
                </Field>
                <Field label="Tamanho máx. de upload (MB)" desc="Limite por arquivo de vídeo ou material.">
                  <input className={inputCls} type="number" defaultValue={500} />
                </Field>
                <Field label="Prazo de reembolso (dias)" desc="Janela de tempo para solicitar reembolso.">
                  <input className={inputCls} type="number" defaultValue={7} />
                </Field>
              </SectionCard>

              <SectionCard title="Manutenção" desc="Controle de disponibilidade da plataforma." icon={AlertTriangle}>
                <Toggle value={maintenance} onChange={setMaintenance}
                  label="Modo de Manutenção" desc="Exibe página de manutenção para todos (exceto admins)." badge={maintenance ? 'Ativo' : undefined} />
                <Field label="Mensagem de manutenção" desc="Texto exibido para visitantes durante a manutenção.">
                  <textarea className={`${inputCls} h-20 resize-none py-2`} defaultValue="Estamos realizando melhorias. Voltamos em breve!" />
                </Field>
              </SectionCard>
            </>
          )}

          {/* ── E-MAIL ────────────────────────────────── */}
          {section === 'email' && (
            <>
              <SectionCard title="Remetente" desc="Configurações de quem envia os e-mails." icon={Mail}>
                <Field label="E-mail de Suporte" desc="Endereço exibido como remetente e de resposta.">
                  <input className={inputCls} defaultValue="suporte@virtulearning.com" />
                </Field>
                <Field label="Nome do Remetente" desc="Nome exibido na caixa de entrada do usuário.">
                  <input className={inputCls} defaultValue="VirtuLearning Suporte" />
                </Field>
                <Field label="Servidor SMTP" desc="Host do seu provedor de e-mail transacional.">
                  <input className={inputCls} placeholder="smtp.sendgrid.net" />
                </Field>
                <Field label="Porta SMTP">
                  <input className={inputCls} type="number" defaultValue={587} />
                </Field>
                <Field label="Usuário SMTP">
                  <input className={inputCls} placeholder="apikey" />
                </Field>
                <Field label="Senha SMTP">
                  <input className={inputCls} type="password" placeholder="••••••••••••" />
                </Field>
              </SectionCard>

              <SectionCard title="Notificações Automáticas" desc="Defina quais eventos disparam e-mails." icon={Bell}>
                <Toggle value={welcomeEmail} onChange={setWelcomeEmail}
                  label="Boas-vindas ao novo usuário" desc="Enviado após o registro e verificação de e-mail." badge="Recomendado" />
                <Toggle value={certEmail} onChange={setCertEmail}
                  label="Emissão de certificado" desc="Notifica o aluno ao concluir um curso." badge="Recomendado" />
                <Toggle value={promoEmail} onChange={setPromoEmail}
                  label="E-mails promocionais" desc="Newsletters e ofertas de cursos. Respeita preferências do usuário." />
              </SectionCard>
            </>
          )}

          {/* ── PAGAMENTOS ────────────────────────────── */}
          {section === 'pagamentos' && (
            <>
              <SectionCard title="Gateway de Pagamento" desc="Configure o provedor de pagamentos da plataforma." icon={CreditCard}>
                <Field label="Provedor Ativo" desc="Gateway responsável pelo processamento.">
                  <select className={`${inputCls} appearance-none cursor-pointer`}>
                    <option>Stripe</option>
                    <option>PagSeguro</option>
                    <option>Mercado Pago</option>
                    <option>Asaas</option>
                  </select>
                </Field>
                <Field label="Chave Pública (Publishable Key)" desc="Usada no frontend para tokenizar cartões.">
                  <input className={inputCls} placeholder="pk_live_..." />
                </Field>
                <Field label="Chave Secreta (Secret Key)" desc="Usada no servidor. Nunca exponha publicamente.">
                  <input className={inputCls} type="password" placeholder="sk_live_..." />
                </Field>
                <Field label="Webhook Secret" desc="Para validar eventos recebidos do gateway.">
                  <input className={inputCls} type="password" placeholder="whsec_..." />
                </Field>
              </SectionCard>

              <SectionCard title="Comissões e Repasses" desc="Defina como a receita é distribuída." icon={CreditCard}>
                <Field label="Comissão da plataforma (%)" desc="Percentual retido pela VirtuLearning por venda.">
                  <div className="flex items-center gap-2">
                    <input className={`${inputCls} flex-1`} type="number" defaultValue={20} min={0} max={100} />
                    <span className="text-sm text-[#71717a] shrink-0">%</span>
                  </div>
                </Field>
                <Field label="Repasse ao professor (%)" desc="Percentual pago ao professor por venda.">
                  <div className="flex items-center gap-2">
                    <input className={`${inputCls} flex-1`} type="number" defaultValue={80} min={0} max={100} />
                    <span className="text-sm text-[#71717a] shrink-0">%</span>
                  </div>
                </Field>
                <Field label="Prazo de repasse (dias)" desc="Dias após a venda para liberar o valor ao professor.">
                  <input className={inputCls} type="number" defaultValue={14} />
                </Field>
              </SectionCard>
            </>
          )}

          {/* ── INTEGRAÇÕES ───────────────────────────── */}
          {section === 'integracoes' && (
            <>
              <SectionCard title="Chaves de API" desc="Autentique sistemas externos na sua plataforma." icon={Webhook}>
                <ApiKeyField label="Chave de API Pública" value="vl_pub_9f3k2j1h4g5f6d7s8a9q0w" />
                <ApiKeyField label="Chave de API Privada" value="vl_priv_x7y8z9a1b2c3d4e5f6g7h8i" />
                <Field label="IPs permitidos" desc="Restrinja chamadas de API a IPs específicos (um por linha).">
                  <textarea className={`${inputCls} h-24 resize-none py-2 font-mono text-xs`} placeholder={'192.168.1.1\n10.0.0.0/24'} />
                </Field>
              </SectionCard>

              <SectionCard title="Webhooks" desc="Envie eventos da plataforma para sistemas externos." icon={Webhook}>
                <Field label="URL do Webhook" desc="Endpoint que receberá as notificações de eventos.">
                  <input className={inputCls} placeholder="https://meusite.com/webhook" />
                </Field>
                <Field label="Eventos ativos" desc="Selecione quais eventos disparam notificações.">
                  <div className="space-y-2">
                    {['user.created', 'course.published', 'payment.completed', 'enrollment.new', 'certificate.issued'].map(event => (
                      <label key={event} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-danger rounded" />
                        <span className="text-sm font-mono text-[#a1a1aa] group-hover:text-white transition-colors">{event}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              </SectionCard>

              <SectionCard title="Analytics" desc="Ferramentas de rastreamento e análise de tráfego." icon={BarChart3}>
                <Toggle value={analyticsEnabled} onChange={setAnalyticsEnabled}
                  label="Google Analytics" desc="Rastreamento de pageviews e eventos." />
                <Field label="ID de Medição (GA4)" desc="Formato: G-XXXXXXXXXX">
                  <input className={inputCls} placeholder="G-XXXXXXXXXX" defaultValue="G-AB12CD34EF" />
                </Field>
                <Field label="Meta Pixel ID" desc="Para rastreamento de conversões no Facebook/Instagram.">
                  <input className={inputCls} placeholder="000000000000000" />
                </Field>
              </SectionCard>
            </>
          )}

          {/* ── PRIVACIDADE ───────────────────────────── */}
          {section === 'privacidade' && (
            <>
              <SectionCard title="Privacidade & LGPD" desc="Conformidade com a Lei Geral de Proteção de Dados." icon={Lock}>
                <Toggle value={cookieConsent} onChange={setCookieConsent}
                  label="Banner de consentimento de cookies" desc="Exibe o aviso de cookies para novos visitantes." badge="Recomendado" />
                <Toggle value={dataRetention} onChange={setDataRetention}
                  label="Retenção automática de dados" desc="Remove dados de contas inativas após 24 meses." />
                <Field label="URL da Política de Privacidade" desc="Exibida no rodapé e no cadastro.">
                  <input className={inputCls} defaultValue="/privacy" />
                </Field>
                <Field label="URL dos Termos de Uso" desc="Exibida no rodapé e aceita no cadastro.">
                  <input className={inputCls} defaultValue="/terms" />
                </Field>
                <Field label="E-mail do DPO (Encarregado de Dados)" desc="Responsável pela proteção de dados da plataforma.">
                  <input className={inputCls} defaultValue="dpo@virtulearning.com" />
                </Field>
              </SectionCard>

              <SectionCard title="Solicitações de Dados" desc="Gerencie requisições de usuários sobre seus dados." icon={Lock}>
                <div className="py-4 space-y-3">
                  {[
                    { label: 'Exportar todos os dados de usuários (CSV)', color: 'text-white', bg: 'bg-[#27272a] hover:bg-[#3f3f46]' },
                    { label: 'Anonimizar contas inativas (> 24 meses)',   color: 'text-warning', bg: 'bg-warning/10 hover:bg-warning/20 border border-warning/20' },
                  ].map((b, i) => (
                    <button key={i} className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-lg transition-colors ${b.color} ${b.bg}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </SectionCard>
            </>
          )}

          {/* ── ZONA DE PERIGO ────────────────────────── */}
          {section === 'perigo' && (
            <div className="space-y-4">
              {[
                { title: 'Limpar cache da plataforma', desc: 'Remove arquivos temporários e força recarregamento de assets.', btn: 'Limpar Cache', tone: 'warning' },
                { title: 'Resetar dados de demonstração', desc: 'Remove todos os dados mockados e retorna ao estado inicial.', btn: 'Resetar Demo', tone: 'danger' },
                { title: 'Desativar plataforma permanentemente', desc: 'Desativa a plataforma e bloqueia todos os acessos. Esta ação é irreversível sem suporte técnico.', btn: 'Desativar Plataforma', tone: 'danger' },
              ].map((item, i) => {
                const isDanger = item.tone === 'danger';
                return (
                  <div key={i} className={`rounded-2xl border p-6 flex items-center justify-between gap-6 ${isDanger ? 'bg-[#0d0505] border-danger/20' : 'bg-[#0d0a00] border-warning/20'}`}>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-0.5 flex items-center gap-2">
                        <AlertTriangle size={14} className={isDanger ? 'text-danger' : 'text-warning'} />
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#71717a]">{item.desc}</p>
                    </div>
                    <button className={`shrink-0 text-xs font-bold px-4 py-2 rounded-lg transition-all border ${isDanger ? 'bg-danger/10 border-danger/20 text-danger hover:bg-danger hover:text-white' : 'bg-warning/10 border-warning/20 text-warning hover:bg-warning hover:text-black'}`}>
                      {item.btn}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Save Bar */}
          {section !== 'perigo' && (
            <div className="flex justify-end pt-2">
              <button className="flex items-center gap-2 bg-danger text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <Save size={14} /> Salvar Alterações
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

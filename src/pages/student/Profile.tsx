import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { Camera, User, Lock, Bell, Save, AlertCircle, CheckCircle2, MapPin, Briefcase, Link as LinkIcon, Code, Globe, FileText, Shield, MonitorSmartphone, Palette, Globe2, Eye, Moon, Sun, Loader2 } from 'lucide-react';

import { useProfile, useUpdateProfile } from '../../hooks/useProfile';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

export const Profile = () => {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences'>('personal');
  const [isDirty, setIsDirty] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states — inicializa com dados do backend quando disponíveis
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    avatar: '',
    bio: '',
    cargo: '',
    localizacao: '',
    linkedin: '',
    github: '',
    site: ''
  });

  // Popula o formulário quando os dados chegam do backend
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        nome: profile.nome ?? '',
        email: profile.email ?? '',
        bio: profile.bio ?? '',
        linkedin: profile.linkedin_url ?? '',
        telefone: profile.telefone ?? '',
        avatar: profile.avatar_url ?? '',
      }));
    }
  }, [profile]);

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    marketingEmails: true,
    courseAlerts: true,
    smsNotifications: false,
    theme: 'dark',
    language: 'pt-BR',
    highContrast: false,
    reducedMotion: false,
  });

  // Track unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Required for modern browsers to show the default warning
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsDirty(true);
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSecurityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true);
    setSecurityData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePreferenceToggle = (key: keyof typeof preferences) => {
    setIsDirty(true);
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        nome: formData.nome,
        bio: formData.bio,
        telefone: formData.telefone,
        linkedin_url: formData.linkedin,
        avatar_url: formData.avatar || undefined,
      });
      setIsDirty(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (e: any) {
      alert(`Erro 400: ${JSON.stringify(e.response?.data)}`);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto animate-in fade-in duration-500 pb-10">
      
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">Seu Universo</h1>
          <p className="text-muted text-sm md:text-base">Personalize sua identidade, segurança e preferências na VirtuLearning.</p>
        </div>
        <div className="hidden md:flex w-12 h-12 rounded-full bg-accent/10 items-center justify-center border border-accent/20 shadow-[0_0_15px_rgba(255,215,0,0.15)] animate-pulse">
          <User className="text-accent" size={24} />
        </div>
      </header>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border bg-bg/50">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'personal' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'
            }`}
          >
            <User size={18} /> Dados Pessoais
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'security' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'
            }`}
          >
            <Lock size={18} /> Segurança
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'preferences' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'
            }`}
          >
            <Bell size={18} /> Preferências
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          
          {/* Aba: Dados Pessoais */}
          {activeTab === 'personal' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              
              {/* Header / Cover Photo */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#121214] to-[#1c1c1f] border border-border/50 shadow-xl group">
                {/* Banner Gradient */}
                <div className="h-32 w-full bg-gradient-to-r from-accent/20 via-[#1c1c1f] to-transparent relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
                </div>
                
                <div className="px-6 md:px-8 pb-8 relative flex flex-col md:flex-row gap-6 items-center md:items-end -mt-14">
                  
                  {/* Interactive Avatar */}
                  <div className="relative group/avatar cursor-pointer">
                    <div className="w-28 h-28 rounded-full bg-[#09090b] border-4 border-card overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.15)] ring-2 ring-accent/30 transition-all duration-500 group-hover/avatar:shadow-[0_0_50px_rgba(255,215,0,0.4)] group-hover/avatar:ring-accent group-hover/avatar:scale-105">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                      ) : (
                        <span className="text-4xl font-black text-accent drop-shadow-lg">{formData.nome.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <button 
                      onClick={triggerFileInput}
                      className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Camera size={24} className="text-white mb-1 transform translate-y-2 group-hover/avatar:translate-y-0 transition-transform" />
                      <span className="text-[10px] text-white font-bold uppercase tracking-widest transform translate-y-2 group-hover/avatar:translate-y-0 transition-transform delay-75">Upload</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  
                  {/* User Info & Actions */}
                  <div className="flex-1 text-center md:text-left pb-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">{formData.nome || 'Usuário'}</h2>
                    <p className="text-accent text-sm font-bold uppercase tracking-wider mt-1 flex items-center justify-center md:justify-start gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                      Membro VirtuLearning
                    </p>
                  </div>
                  
                  <div className="pb-2 hidden md:block">
                    <Button variant="outline" onClick={triggerFileInput} className="text-xs h-auto py-2.5 px-4 border-accent/20 hover:border-accent text-white hover:text-black hover:bg-accent transition-all duration-300 shadow-[0_0_15px_rgba(255,215,0,0.1)] rounded-full">
                      <Camera size={14} className="mr-2" />
                      Atualizar Foto
                    </Button>
                  </div>
                </div>
              </div>

              {/* Informações Básicas (Bento Box Style) */}
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Coluna Esquerda - Info Principal */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-gradient-to-br from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl relative overflow-hidden group/card hover:border-accent/30 transition-colors duration-500 shadow-lg">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent to-transparent opacity-50"></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-6 flex items-center gap-2">
                      <User size={16} className="text-accent" />
                      Dados Principais
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-5 relative z-10">
                      <Input 
                        label="Nome Completo" 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleChange} 
                        className="bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                      />
                      <Input 
                        label="Telefone" 
                        name="telefone" 
                        type="tel" 
                        placeholder="(00) 00000-0000"
                        value={formData.telefone} 
                        onChange={handleChange} 
                        className="bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Coluna Direita - Info Sensível */}
                <div className="md:col-span-1">
                  <div className="bg-gradient-to-bl from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl h-full relative overflow-hidden group/card hover:border-accent/30 transition-colors duration-500 shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover/card:bg-accent/20 group-hover/card:scale-150"></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-6 flex items-center gap-2 relative z-10">
                      <Lock size={16} className="text-accent" />
                      Conta
                    </h3>
                    
                    <div className="space-y-5 relative z-10">
                      <Input 
                        label="E-mail de Acesso" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Linha 2 - Sobre Mim */}
                <div className="md:col-span-3">
                  <div className="bg-gradient-to-br from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl relative overflow-hidden group/card hover:border-accent/30 transition-colors duration-500 shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl transition-all duration-700 group-hover/card:bg-accent/10"></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-6 flex items-center gap-2 relative z-10">
                      <FileText size={16} className="text-accent" />
                      Sobre Mim
                    </h3>
                    
                    <div className="space-y-5 relative z-10">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 text-muted z-10 pointer-events-none">
                            <Briefcase size={18} />
                          </div>
                          <Input 
                            label="Cargo / Profissão" 
                            name="cargo" 
                            placeholder="Ex: Desenvolvedor Front-end"
                            value={formData.cargo} 
                            onChange={handleChange} 
                            className="pl-10 bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 text-muted z-10 pointer-events-none">
                            <MapPin size={18} />
                          </div>
                          <Input 
                            label="Localização" 
                            name="localizacao" 
                            placeholder="Ex: São Paulo, SP"
                            value={formData.localizacao} 
                            onChange={handleChange} 
                            className="pl-10 bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                          />
                        </div>
                      </div>
                      <Textarea 
                        label="Biografia" 
                        name="bio" 
                        placeholder="Conte um pouco sobre você, suas experiências e objetivos..."
                        value={formData.bio} 
                        onChange={handleChange} 
                        className="bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Linha 3 - Redes Sociais */}
                <div className="md:col-span-3">
                  <div className="bg-gradient-to-r from-bg/60 to-bg/20 p-6 rounded-3xl border border-border/40 backdrop-blur-xl relative overflow-hidden group/card hover:border-accent/30 transition-colors duration-500 shadow-lg">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-6 flex items-center gap-2 relative z-10">
                      <LinkIcon size={16} className="text-accent" />
                      Links e Redes Sociais
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-5 relative z-10">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 text-muted z-10 pointer-events-none">
                          <LinkIcon size={18} />
                        </div>
                        <Input 
                          label="LinkedIn" 
                          name="linkedin" 
                          placeholder="URL do seu perfil"
                          value={formData.linkedin} 
                          onChange={handleChange} 
                          className="pl-10 bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 text-muted z-10 pointer-events-none">
                          <Code size={18} />
                        </div>
                        <Input 
                          label="GitHub" 
                          name="github" 
                          placeholder="URL do seu perfil"
                          value={formData.github} 
                          onChange={handleChange} 
                          className="pl-10 bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 text-muted z-10 pointer-events-none">
                          <Globe size={18} />
                        </div>
                        <Input 
                          label="Site / Portfólio" 
                          name="site" 
                          placeholder="https://seu-site.com"
                          value={formData.site} 
                          onChange={handleChange} 
                          className="pl-10 bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Aba: Segurança */}
          {activeTab === 'security' && (
            <div className="animate-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-10">
              
              {/* Alterar Senha */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Lock size={18} className="text-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Senha de Acesso</h3>
                </div>
                
                <div className="bg-[#121214] border border-border/50 rounded-2xl overflow-hidden shadow-sm p-5 space-y-4">
                  <Input 
                    label="Senha Atual" 
                    name="currentPassword" 
                    type="password" 
                    value={securityData.currentPassword} 
                    onChange={handleSecurityChange} 
                    className="bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                  />
                  
                  <Input 
                    label="Nova Senha" 
                    name="newPassword" 
                    type="password" 
                    value={securityData.newPassword} 
                    onChange={handleSecurityChange} 
                    className="bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                  />
                  
                  <Input 
                    label="Confirmar Nova Senha" 
                    name="confirmPassword" 
                    type="password" 
                    value={securityData.confirmPassword} 
                    onChange={handleSecurityChange} 
                    className="bg-black/40 border-border/30 focus:border-accent/50 focus:bg-black/60 shadow-inner rounded-xl"
                  />

                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex gap-3 mt-4 shadow-sm">
                    <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-yellow-500/90 leading-relaxed">
                      <strong className="text-yellow-500">Dica:</strong> Recomendamos usar uma senha com pelo menos 8 caracteres, contendo números e símbolos.
                    </p>
                  </div>
                </div>
              </section>

              {/* 2FA */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Shield size={18} className="text-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Autenticação em Duas Etapas</h3>
                </div>
                
                <div className="bg-[#121214] border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Adicione uma camada extra de proteção</p>
                      <p className="text-xs text-muted mt-0.5">Exige um código de verificação além da senha no login.</p>
                    </div>
                    <Button variant="outline" className="shrink-0 border-accent/30 text-accent hover:bg-accent hover:text-black transition-colors rounded-xl">
                      Configurar 2FA
                    </Button>
                  </div>
                </div>
              </section>

              {/* Sessões Ativas */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <MonitorSmartphone size={18} className="text-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Sessões Ativas</h3>
                </div>
                
                <div className="bg-[#121214] border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                  {/* Sessão 1 */}
                  <div className="flex items-center justify-between p-5 border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <MonitorSmartphone size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">Windows • Chrome</p>
                        <p className="text-xs text-success font-medium uppercase tracking-wider mt-0.5">Ativo Agora</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sessão 2 */}
                  <div className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted shrink-0">
                        <MonitorSmartphone size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">iPhone 13 • Safari</p>
                        <p className="text-xs text-muted mt-0.5">Visto há 2 dias</p>
                      </div>
                    </div>
                    <button className="text-xs text-danger font-bold uppercase hover:underline px-2 py-1">
                      Sair
                    </button>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* Aba: Preferências */}
          {activeTab === 'preferences' && (
            <div className="animate-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto space-y-10">
              
              {/* Notificações */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Bell size={18} className="text-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Notificações</h3>
                </div>
                
                <div className="bg-[#121214] border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-5 border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">E-mails Promocionais</p>
                      <p className="text-xs text-muted mt-0.5">Receba ofertas e cupons de desconto.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={preferences.marketingEmails} onChange={() => handlePreferenceToggle('marketingEmails')} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-5 border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Alertas de Novos Cursos</p>
                      <p className="text-xs text-muted mt-0.5">Seja avisado quando novos cursos forem lançados.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={preferences.courseAlerts} onChange={() => handlePreferenceToggle('courseAlerts')} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Notificações por SMS</p>
                      <p className="text-xs text-muted mt-0.5">Atualizações importantes via mensagem de texto.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={preferences.smsNotifications} onChange={() => handlePreferenceToggle('smsNotifications')} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Aparência */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Palette size={18} className="text-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Aparência e Região</h3>
                </div>
                
                <div className="bg-[#121214] border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                  {/* Tema */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-border/50 gap-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Tema da Interface</p>
                      <p className="text-xs text-muted mt-0.5">Escolha o visual que melhor se adapta a você.</p>
                    </div>
                    <div className="flex bg-[#09090b] p-1 rounded-lg border border-border/30 shrink-0">
                      <button 
                        onClick={() => { setIsDirty(true); setPreferences({...preferences, theme: 'dark'}); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${preferences.theme === 'dark' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-white'}`}
                      >
                        <Moon size={14} /> Escuro
                      </button>
                      <button 
                        onClick={() => { setIsDirty(true); setPreferences({...preferences, theme: 'light'}); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${preferences.theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-muted hover:text-white'}`}
                      >
                        <Sun size={14} /> Claro
                      </button>
                    </div>
                  </div>

                  {/* Idioma */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Idioma Principal</p>
                      <p className="text-xs text-muted mt-0.5">Idioma em que o conteúdo será exibido.</p>
                    </div>
                    <div className="relative min-w-[180px]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10 pointer-events-none">
                        <Globe2 size={16} />
                      </div>
                      <select 
                        value={preferences.language}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setIsDirty(true); setPreferences({...preferences, language: e.target.value}); }}
                        className="w-full h-10 pl-9 pr-4 bg-[#09090b] border border-border/50 rounded-lg text-sm text-white focus:border-accent/50 focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Acessibilidade */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Eye size={18} className="text-accent" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Acessibilidade</h3>
                </div>
                
                <div className="bg-[#121214] border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-5 border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Alto Contraste</p>
                      <p className="text-xs text-muted mt-0.5">Aumenta a legibilidade de textos e botões.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={preferences.highContrast} onChange={() => handlePreferenceToggle('highContrast')} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Reduzir Animações</p>
                      <p className="text-xs text-muted mt-0.5">Desativa efeitos visuais e transições de tela.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={preferences.reducedMotion} onChange={() => handlePreferenceToggle('reducedMotion')} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                </div>
              </section>

            </div>
          )}

        </div>
        
        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-bg/30 flex items-center justify-between">
          <div>
            {isDirty && <span className="text-xs font-medium text-warning flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span> Alterações não salvas</span>}
            {showSuccessMessage && <span className="text-sm font-medium text-success flex items-center gap-1.5"><CheckCircle2 size={16} /> Perfil atualizado com sucesso!</span>}
          </div>
          <Button
            onClick={handleSave}
            disabled={!isDirty || updateProfile.isPending}
            className="flex items-center gap-2"
          >
            {updateProfile.isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Salvando...</>
            ) : (
              <><Save size={16} /> Salvar Alterações</>
            )}
          </Button>
        </div>

      </div>

    </div>
  );
};

import { useState, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Camera, Save, User, Globe, Phone, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';

export const TeacherProfile = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nome: user?.nome ?? '',
    bio: user?.bio ?? '',
    nickname: user?.nickname ?? '',
    telefone: user?.telefone ?? '',
    linkedin_url: user?.linkedin_url ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.patch('/users/me', form);
      setUser(res.data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user!, avatar_url: res.data.avatar_url });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    } catch {
      setError('Erro ao enviar foto.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500 pb-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Meu Perfil</h1>
        <p className="text-muted mt-1 text-sm md:text-base">Mantenha seu perfil atualizado para atrair mais alunos.</p>
      </header>

      {/* Avatar */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-3xl font-black text-black overflow-hidden border-4 border-accent/20 mx-auto sm:mx-0">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.nome?.charAt(0).toUpperCase()
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-accentHover transition-colors shadow-lg"
          >
            <Camera size={14} className="text-black" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </div>
        <div className="flex-1 mt-2 sm:mt-0">
          <h2 className="text-xl md:text-2xl font-bold text-white">{user?.nome}</h2>
          <p className="text-muted text-sm mt-1">{user?.email}</p>
          <p className="text-[10px] md:text-xs text-accent font-bold mt-2 uppercase tracking-wider bg-accent/10 px-3 py-1 rounded-full inline-block">Professor</p>
          {uploadingPhoto && <p className="text-xs text-muted mt-2">Enviando foto...</p>}
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-5">
        <div>
          <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <User size={14} className="text-accent" /> Nome Completo
          </label>
          <input
            value={form.nome}
            onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <User size={14} className="text-accent" /> Apelido (Nickname)
          </label>
          <input
            value={form.nickname}
            onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            placeholder="@seunickname"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <FileText size={14} className="text-accent" /> Bio / Apresentação
          </label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={4}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors resize-none"
            placeholder="Conte sobre sua experiência e especialidades..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Phone size={14} className="text-accent" /> Telefone
            </label>
            <input
              value={form.telefone}
              onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="(11) 99999-9999"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Globe size={14} className="text-accent" /> LinkedIn
            </label>
            <input
              value={form.linkedin_url}
              onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="https://linkedin.com/in/seuperfil"
            />
          </div>
        </div>

        {error && <p className="text-danger text-sm font-medium">{error}</p>}
        {success && <p className="text-success text-sm font-medium">✓ Perfil salvo com sucesso!</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-accent text-black font-bold py-3.5 rounded-xl hover:bg-accentHover transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm mt-2"
        >
          <Save size={16} />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
};

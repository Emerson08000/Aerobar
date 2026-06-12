import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, User, Loader2, Eye, EyeOff, Flame } from 'lucide-react';

const ADMIN_USER = 'foguinho';
const ADMIN_PASS = 'aerobar2026';
const TOKEN_KEY = 'aerobar_admin_token';
const FAKE_TOKEN = 'foguinho-admin-authenticated';

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError('');

    await new Promise((res) => setTimeout(res, 400));

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(TOKEN_KEY, FAKE_TOKEN);
      navigate('/admin/pedidos');
    } else {
      setError('Usuário ou senha incorretos.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Flame size={28} className="text-primary-foreground" />
          </div>
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Foguinho Admin
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Painel de gerenciamento</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Usuário</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="foguinho"
                disabled={loading}
                className="w-full pl-9 pr-4 py-3 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Senha</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-9 pr-10 py-3 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-3 py-2.5 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-base"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Entrando…
              </>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

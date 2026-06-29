import React, { useState, useEffect } from 'react';

function App() {
  // Récupération dynamique de l'URL de l'API (Railway / Render en production ou localhost)
  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

  // Gestion des onglets
  const [activeTab, setActiveTab] = useState('posts');

  // États pour la Connexion / Authentification
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [authError, setAuthError] = useState('');

  // États pour la Gestion des Rapports / Posts
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [postMessage, setPostMessage] = useState({ text: '', isError: false });
  const [dashboardPosts, setDashboardPosts] = useState([]); // 👈 Ajout : État pour l'historique des notes

  // États pour la Gestion des Stocks
  const [stocks, setStocks] = useState([]);
  const [stockName, setStockName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockUnit, setStockUnit] = useState('kg');
  const [stockMinQuantity, setStockMinQuantity] = useState('0');
  const [stockCategory, setStockCategory] = useState('SEMENCE');
  const [stockMessage, setStockMessage] = useState({ text: '', isError: false });

  // Charger les données de l'exploitation dès que l'utilisateur possède un jeton valide
  useEffect(() => {
    if (token) {
      fetchStocks();
      fetchDashboardPosts(); // 👈 Ajout : Récupération des notes au démarrage
    }
  }, [token]);

  // Récupération sécurisée anti-cache des notes techniques
  const fetchDashboardPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts?_t=${new Date().getTime()}`);
      if (response.ok) {
        const data = await response.json();
        const actualPosts = Array.isArray(data) ? data : (data.posts || data.data || []);
        setDashboardPosts(actualPosts);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des notes sur le dashboard:", err);
    }
  };

  // Récupération sécurisée anti-cache des intrants
  const fetchStocks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stock?_t=${new Date().getTime()}`);
      if (response.ok) {
        const data = await response.json();
        // Sécurité de dépaquetage des données du tableau
        const actualStocks = Array.isArray(data) ? data : (data.stocks || data.data || []);
        setStocks(actualStocks);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des stocks:", err);
    }
  };

  // Gestion de la Connexion à l'Espace Admin
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Échec de la connexion');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  // Déconnexion de la session de contrôle
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  // Publication d'une Note de Suivi Agronomique
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setPostMessage({ text: '', isError: false });

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erreur de création");

      setPostMessage({ text: "🦅 Note technique publiée avec succès sur le site public !", isError: false });
      setTitle('');
      setContent('');
      setCategory('GENERAL');
      fetchDashboardPosts(); // 👈 Ajout : Force la mise à jour immédiate de la liste sur le tableau de bord
    } catch (err) {
      setPostMessage({ text: `Erreur : ${err.message}`, isError: true });
    }
  };

  // Enregistrement d'un Intrant ou Outil dans l'Inventaire
  const handleSubmitStock = async (e) => {
    e.preventDefault();
    setStockMessage({ text: '', isError: false });

    try {
      const response = await fetch(`${API_URL}/api/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          name: stockName,
          quantity: parseFloat(stockQuantity),
          unit: stockUnit,
          minQuantity: parseFloat(stockMinQuantity),
          category: stockCategory
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erreur lors de l'ajout au stock");

      setStockMessage({ text: "📦 Article ajouté à l'inventaire avec succès !", isError: false });
      setStockName('');
      setStockQuantity('');
      setStockMinQuantity('0');
      fetchStocks();
    } catch (err) {
      setStockMessage({ text: `Erreur : ${err.message}`, isError: true });
    }
  };

  // Ajustement à chaud des volumes (Incrémentation / Décrémentation)
  const handleAdjustQuantity = async (id, currentQty, amount) => {
    const newQty = Math.max(0, currentQty + amount);
    try {
      const response = await fetch(`${API_URL}/api/stock/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (response.ok) fetchStocks();
    } catch (err) {
      console.error("Erreur de mise à jour du stock :", err);
    }
  };

  // Composant d'Arrière-plan : Image Thématique & Dégradé de Prestige
  const BackgroundImage = () => (
    <div className="fixed inset-0 -z-20 h-full w-full overflow-hidden bg-slate-900">
      <img
        src="/papaye.jpg"
        alt="Papayes Calina IPB9 L'AIGLE ROYAL"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a1e]/90 via-[#112211]/85 to-slate-950/90 -z-10 bg-blend-multiply" />
    </div>
  );

  // --- ÉCRAN D'AUTHENTIFICATION ---
  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 text-slate-800">
        <BackgroundImage />
        
        <div className="max-w-md w-full bg-white/95 rounded-2xl shadow-2xl border border-emerald-200/50 p-8 backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#1e3a1e] tracking-wide">L'AIGLE ROYAL</h1>
            <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold mt-2">Espace Administration</p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4 text-center font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Exploitant</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e] focus:ring-1 focus:ring-[#1e3a1e]" placeholder="agronome@aigleroyal.com" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e] focus:ring-1 focus:ring-[#1e3a1e]" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-[#1e3a1e] hover:bg-[#112211] text-white font-medium p-3 rounded-xl shadow-md transition duration-200 tracking-wide uppercase text-xs font-semibold">
              Se connecter au Domaine
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- INTERFACE PRINCIPALE DU SYSTÈME ---
  return (
    <div className="relative min-h-screen text-slate-800 font-sans pb-12">
      <BackgroundImage />
      
      {/* Barre de navigation supérieure */}
      <header className="bg-white/90 border-b border-emerald-200/40 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🦅</span>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-wide text-[#1e3a1e]">L'AIGLE ROYAL</h1>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">
              Exploitation Agricole de Prestige <span className="text-emerald-700 font-semibold">| Admin : {user?.username}</span>
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-white/80 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 transition duration-200 shadow-sm">
          Déconnexion
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        
        {/* Sélection des onglets */}
        <div className="flex space-x-2 mb-8 bg-white/80 p-1.5 rounded-xl w-fit border border-emerald-200/30 shadow-md backdrop-blur-sm">
          <button onClick={() => setActiveTab('posts')} className={`px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition duration-200 ${activeTab === 'posts' ? 'bg-[#1e3a1e] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}>
            📝 Notes de Culture
          </button>
          <button onClick={() => setActiveTab('stock')} className={`px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition duration-200 ${activeTab === 'stock' ? 'bg-[#1e3a1e] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}>
            📦 Intrants & Stocks
          </button>
        </div>

        {/* --- SECTION : SUIVI AGRONOMIQUE (POSTS) --- */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Formulaire de publication */}
            <div className="bg-white/95 border border-emerald-200/40 rounded-2xl shadow-xl p-6 h-fit backdrop-blur-sm">
              <h2 className="text-xl font-serif font-bold text-slate-800 mb-1">Cahier de Suivi</h2>
              <p className="text-xs text-slate-500 mb-6">Consignez vos données d'évolution pour le verger de papayers Calina IPB9.</p>

              {postMessage.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm border ${postMessage.isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                  {postMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Titre du Rapport</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e] transition" placeholder="Ex: Ajustement de l'irrigation" />
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Secteur / Catégorie</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e] h-[46px] cursor-pointer">
                    <option value="GENERAL">📊 Général</option>
                    <option value="SUIVI_PARCELLE">🌱 Suivi Parcelle</option>
                    <option value="PHYTOSANITAIRE">🛡️ Phytosanitaire</option>
                    <option value="IRRIGATION">💧 Irrigation</option>
                    <option value="RECOLTE_RENDEMENT">🧺 Récolte & Rendement</option>
                    <option value="AGROBUSINESS">💼 Agrobusiness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Observations Techniques</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows="5" className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e] transition" placeholder="Saisissez vos relevés d'arrosage, traitements..."></textarea>
                </div>

                <button type="submit" className="w-full bg-[#1e3a1e] hover:bg-[#112211] text-white font-medium p-3 rounded-xl shadow-md transition duration-150 tracking-wide uppercase text-xs font-semibold">
                  🚀 Diffuser la Note Technique
                </button>
              </form>
            </div>

            {/* Liste de suivi en temps réel */}
            <div className="bg-white/95 border border-emerald-200/40 rounded-2xl shadow-xl p-6 lg:col-span-2 backdrop-blur-sm">
              <h2 className="text-lg font-serif font-bold text-slate-800 mb-1">Dernières Publications</h2>
              <p className="text-xs text-slate-500 mb-6">Historique des notes diffusées sur le Domaine.</p>

              {dashboardPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  Aucune note technique enregistrée pour le moment.
                </div>
              ) : (
                <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
                  {dashboardPosts.map((post) => (
                    <div key={post.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition duration-150">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-bold text-sm text-slate-800">{post.title}</h3>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-medium uppercase tracking-wider whitespace-nowrap">
                          {post.category?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3 whitespace-pre-line">{post.content}</p>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Publié le : {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- SECTION : INVENTAIRE ET STOCKS --- */}
        {activeTab === 'stock' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Formulaire d'ajout aux réserves */}
            <div className="bg-white/95 border border-emerald-200/40 rounded-2xl shadow-xl p-6 h-fit backdrop-blur-sm">
              <h2 className="text-lg font-serif font-bold text-slate-800 mb-1">Mouvement de Stock</h2>
              <p className="text-xs text-slate-500 mb-6">Enregistrer un nouvel intrant noble.</p>

              {stockMessage.text && (
                <div className={`p-3 rounded-xl mb-4 text-xs border ${stockMessage.isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                  {stockMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmitStock} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Désignation</label>
                  <input type="text" value={stockName} onChange={(e) => setStockName(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e]" placeholder="Ex: Engrais Soluble NPK" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Quantité</label>
                    <input type="number" step="any" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e]" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Unité</label>
                    <select value={stockUnit} onChange={(e) => setStockUnit(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e] h-[42px]">
                      <option value="kg">Kilogrammes (kg)</option>
                      <option value="litres">Litres (L)</option>
                      <option value="sacs">Sacs</option>
                      <option value="unités">Unités</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Seuil Alerte</label>
                    <input type="number" step="any" value={stockMinQuantity} onChange={(e) => setStockMinQuantity(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Typologie</label>
                    <select value={stockCategory} onChange={(e) => setStockCategory(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1e3a1e] h-[42px]">
                      <option value="SEMENCE">🌱 Semence</option>
                      <option value="ENGRAIS">🧪 Engrais</option>
                      <option value="PHYTOSANITAIRE">🛡️ Phytosanitaire</option>
                      <option value="IRRIGATION">💧 Irrigation</option>
                      <option value="OUTILLAGE">🛠️ Outillage</option>
                      <option value="AUTRE">📦 Autre</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#1e3a1e] hover:bg-[#112211] text-white font-medium p-2.5 rounded-xl text-xs uppercase tracking-wider transition font-semibold shadow-sm mt-2">
                  Inscrire à l'inventaire
                </button>
              </form>
            </div>

            {/* État de situation des Réserves en temps réel */}
            <div className="bg-white/95 border border-emerald-200/40 rounded-2xl shadow-xl p-6 lg:col-span-2 backdrop-blur-sm">
              <h2 className="text-lg font-serif font-bold text-slate-800 mb-1">État des Réserves</h2>
              <p className="text-xs text-slate-500 mb-6">Aperçu en temps réel des intrants disponibles.</p>

              {stocks.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  Aucun intrant inscrit pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3">Désignation</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3 text-center">Volume</th>
                        <th className="pb-3 text-right">Ajustement</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                      {stocks.map((item) => {
                        const isCritical = item.quantity <= item.minQuantity;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-3.5 font-medium text-slate-800">
                              {item.name}
                              {isCritical && (
                                <span className="ml-2 inline-block bg-amber-50 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider animate-pulse">
                                  ⚠️ Réappro
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 text-xs text-slate-500">{item.category}</td>
                            <td className="py-3.5 text-center font-bold">
                              <span className={isCritical ? 'text-red-600' : 'text-[#1e3a1e]'}>
                                {item.quantity} {item.unit}
                              </span>
                            </td>
                            <td className="py-3.5 text-right space-x-1">
                              <button onClick={() => handleAdjustQuantity(item.id, item.quantity, -1)} className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer">-</button>
                              <button onClick={() => handleAdjustQuantity(item.id, item.quantity, 1)} className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#1e3a1e] px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer">+</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
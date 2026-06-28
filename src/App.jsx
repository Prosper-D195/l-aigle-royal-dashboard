import React, { useState, useEffect } from 'react';

function App() {
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

  // États pour la Gestion des Stocks
  const [stocks, setStocks] = useState([]);
  const [stockName, setStockName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockUnit, setStockUnit] = useState('kg');
  const [stockMinQuantity, setStockMinQuantity] = useState('0');
  const [stockCategory, setStockCategory] = useState('SEMENCE');
  const [stockMessage, setStockMessage] = useState({ text: '', isError: false });

  // Charger les stocks
  useEffect(() => {
    if (token) {
      fetchStocks();
    }
  }, [token]);

  const fetchStocks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stock');
      if (response.ok) {
        const data = await response.json();
        setStocks(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des stocks:", err);
    }
  };

  // Gestion du Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Erreur de connexion');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  // Envoi d'un Rapport Technique
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setPostMessage({ text: '', isError: false });

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erreur lors de la création");

      setPostMessage({ text: "🦅 Note technique publiée avec succès sur le site public !", isError: false });
      setTitle('');
      setContent('');
      setCategory('GENERAL');
    } catch (err) {
      setPostMessage({ text: `Erreur : ${err.message}`, isError: true });
    }
  };

  // Envoi d'un Nouvel Article en Stock
  const handleSubmitStock = async (e) => {
    e.preventDefault();
    setStockMessage({ text: '', isError: false });

    try {
      const response = await fetch('http://localhost:5000/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          name: stockName,
          quantity: stockQuantity,
          unit: stockUnit,
          minQuantity: stockMinQuantity,
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

  // Ajuster rapidement une quantité
  const handleAdjustQuantity = async (id, currentQty, amount) => {
    const newQty = Math.max(0, currentQty + amount);
    try {
      const response = await fetch(`http://localhost:5000/api/stock/${id}`, {
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

  // Composant pour l'arrière-plan vidéo connecté à ton fichier local
  const BackgroundVideo = () => (
    <div className="fixed inset-0 -z-20 h-full w-full overflow-hidden bg-slate-900">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      >
        {/* Appel direct de ton fichier champ.mp4 situé dans public/ */}
        <source src="/champ.mp4" type="video/mp4" />
      </video>
      {/* Superposition dégradée orange transparent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9a3412]/85 via-[#ea580c]/75 to-slate-950/85 -z-10" />
    </div>
  );

  // --- ÉCRAN DE CONNEXION ---
  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 text-slate-800">
        <BackgroundVideo />
        
        <div className="max-w-md w-full bg-white/95 rounded-2xl shadow-2xl border border-orange-200/50 p-8 backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#9a3412] tracking-wide">L'AIGLE ROYAL</h1>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-2">Espace Administration</p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Exploitant</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#9a3412]" placeholder="agronome@aigleroyal.com" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#9a3412]" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-[#9a3412] hover:bg-[#7c2d12] text-white font-medium p-3 rounded-xl shadow-md transition duration-200 tracking-wide uppercase text-xs font-semibold">
              Se connecter au Domaine
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TABLEAU DE BORD PRINCIPAL ---
  return (
    <div className="relative min-h-screen text-slate-800 font-sans pb-12">
      <BackgroundVideo />
      
      {/* Top Header */}
      <header className="bg-white/90 border-b border-orange-200/40 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🦅</span>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-wide text-[#9a3412]">L'AIGLE ROYAL</h1>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">
              Exploitation Agricole de Prestige <span className="text-slate-400">| Admin : {user?.username}</span>
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-white/80 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-medium px-4 py-2 rounded-xl border border-slate-200 transition duration-200 shadow-sm">
          Déconnexion
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        
        {/* Navigation - Onglets */}
        <div className="flex space-x-2 mb-8 bg-white/80 p-1.5 rounded-xl w-fit border border-orange-200/30 shadow-md backdrop-blur-sm">
          <button onClick={() => setActiveTab('posts')} className={`px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition duration-200 ${activeTab === 'posts' ? 'bg-[#9a3412] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}>
            📝 Notes de Culture
          </button>
          <button onClick={() => setActiveTab('stock')} className={`px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition duration-200 ${activeTab === 'stock' ? 'bg-[#9a3412] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}>
            📦 Intrants & Stocks
          </button>
        </div>

        {/* --- ONGLET 1 : RAPPORTS TECHNIQUES --- */}
        {activeTab === 'posts' && (
          <div className="bg-white/95 border border-orange-200/40 rounded-2xl shadow-xl p-8 max-w-3xl backdrop-blur-sm">
            <h2 className="text-xl font-serif font-bold text-slate-800 mb-1">Cahier de Suivi Agronomique</h2>
            <p className="text-xs text-slate-500 mb-6">Consignez vos données d'évolution pour le verger de papayers Calina IPB9.</p>

            {postMessage.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm border ${postMessage.isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                {postMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitPost} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Titre du Rapport</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#9a3412] focus:ring-1 focus:ring-[#9a3412] transition" placeholder="Ex: Ajustement de l'irrigation" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Secteur / Catégorie</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#9a3412] h-[46px] cursor-pointer">
                    <option value="GENERAL">📊 Général</option>
                    <option value="SUIVI_PARCELLE">🌱 Suivi Parcelle</option>
                    <option value="PHYTOSANITAIRE">🛡️ Phytosanitaire</option>
                    <option value="IRRIGATION">💧 Irrigation</option>
                    <option value="RECOLTE_RENDEMENT">🧺 Récolte & Rendement</option>
                    <option value="AGROBUSINESS">💼 Agrobusiness</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Observations Techniques</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows="6" className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#9a3412] focus:ring-1 focus:ring-[#9a3412] transition" placeholder="Saisissez vos relevés d'arrosage, traitements..."></textarea>
              </div>

              <button type="submit" className="bg-[#9a3412] hover:bg-[#7c2d12] text-white font-medium px-6 py-3 rounded-xl shadow-md transition duration-150 tracking-wide uppercase text-xs font-semibold">
                🚀 Diffuser la Note Technique
              </button>
            </form>
          </div>
        )}

        {/* --- ONGLET 2 : INVENTAIRE & STOCKS --- */}
        {activeTab === 'stock' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Formulaire d'ajout */}
            <div className="bg-white/95 border border-orange-200/40 rounded-2xl shadow-xl p-6 h-fit backdrop-blur-sm">
              <h2 className="text-lg font-serif font-bold text-slate-800 mb-1">Mouvement de Stock</h2>
              <p className="text-xs text-slate-500 mb-6">Enregistrer un nouvel intrant noble.</p>

              {stockMessage.text && (
                <div className={`p-3 rounded-xl mb-4 text-xs border ${stockMessage.isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                  {stockMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmitStock} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Désignation</label>
                  <input type="text" value={stockName} onChange={(e) => setStockName(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#9a3412]" placeholder="Ex: Engrais Organique NPK" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Quantité</label>
                    <input type="number" step="any" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#9a3412]" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Unité</label>
                    <select value={stockUnit} onChange={(e) => setStockUnit(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#9a3412] h-[42px]">
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
                    <input type="number" step="any" value={stockMinQuantity} onChange={(e) => setStockMinQuantity(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#9a3412]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">Typologie</label>
                    <select value={stockCategory} onChange={(e) => setStockCategory(e.target.value)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#9a3412] h-[42px]">
                      <option value="SEMENCE">🌱 Semence</option>
                      <option value="ENGRAIS">🧪 Engrais</option>
                      <option value="PHYTOSANITAIRE">🛡️ Phytosanitaire</option>
                      <option value="IRRIGATION">💧 Irrigation</option>
                      <option value="OUTILLAGE">🛠️ Outillage</option>
                      <option value="AUTRE">📦 Autre</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#9a3412] hover:bg-[#7c2d12] text-white font-medium p-2.5 rounded-xl text-xs uppercase tracking-wider transition font-semibold shadow-sm mt-2">
                  Inscrire à l'inventaire
                </button>
              </form>
            </div>

            {/* Tableau d'affichage */}
            <div className="bg-white/95 border border-orange-200/40 rounded-2xl shadow-xl p-6 lg:col-span-2 backdrop-blur-sm">
              <h2 className="text-lg font-serif font-bold text-slate-800 mb-1">État des Réserves</h2>
              <p className="text-xs text-slate-500 mb-6">Aperçu en temps réel des intrants.</p>

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
                                <span className="ml-2 inline-block bg-orange-100 text-[#9a3412] text-[9px] font-bold px-2 py-0.5 rounded border border-orange-200 uppercase tracking-wider">
                                  ⚠️ Réappro
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 text-xs text-slate-500">{item.category}</td>
                            <td className="py-3.5 text-center font-bold">
                              <span className={isCritical ? 'text-red-600' : 'text-[#9a3412]'}>
                                {item.quantity} {item.unit}
                              </span>
                            </td>
                            <td className="py-3.5 text-right space-x-1">
                              <button onClick={() => handleAdjustQuantity(item.id, item.quantity, -1)} className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold transition">-</button>
                              <button onClick={() => handleAdjustQuantity(item.id, item.quantity, 1)} className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#9a3412] px-2.5 py-1 rounded-lg text-xs font-bold transition">+</button>
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
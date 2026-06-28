import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Leaf, 
  Package, 
  Plus, 
  Minus, 
  AlertTriangle, 
  LogOut, 
  User, 
  FileText, 
  Calendar,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('agronomie');
  
  // États pour le Cahier de Culture
  const [cultureReport, setCultureReport] = useState({
    type: 'Suivi de parcelle',
    observation: '',
    date: new Date().toISOString().split('T')[0]
  });

  // États fictifs pour les stocks (Papayes Calina IPB9 & Intrants)
  const [stocks, setStocks] = useState([
    { id: 1, name: 'Engrais Organique NPK', category: 'Intrant', quantity: 15, unit: 'Sacs', minLimit: 5 },
    { id: 2, name: 'Caisses d\'emballage Export', category: 'Logistique', quantity: 120, unit: 'Unités', minLimit: 30 },
    { id: 3, name: 'Produits de traitement bio', category: 'Phytosanitaire', quantity: 3, unit: 'Litres', minLimit: 5 }, // En alerte
  ]);

  // Gestion de l'ajustement rapide des stocks
  const handleStockChange = (id, amount) => {
    setStocks(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + amount);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    alert(`Rapport enregistré avec succès pour la catégorie : ${cultureReport.type}`);
    setCultureReport({ ...cultureReport, observation: '' });
  };

  return (
    <div className="relative min-h-screen text-slate-800 font-sans antialiased">
      {/* 📸 IMAGE D'ARRIÈRE-PLAN : Remplacement de la vidéo par la photo de papaye */}
      <img 
        src="/papaye.jpg" 
        alt="Papayes Calina IPB9 L'AIGLE ROYAL" 
        className="fixed inset-0 w-full h-full object-cover -z-20"
      />
      
      {/* Voile translucide pour garantir la lisibilité et l'effet de luxe */}
      <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm -z-10" />

      {/* 🦅 BARRE DE NAVIGATION SUPÉRIEURE */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-orange-100 px-6 py-4 flex justify-between items-center z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🦅</span>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-amber-900">L'AIGLE ROYAL</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Édition Prestige — Admin</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-stone-700 bg-stone-100 py-1.5 px-3 rounded-full font-medium">
            <User size={16} className="text-orange-600" />
            <span>Exploitant</span>
          </div>
          <button className="text-stone-500 hover:text-red-600 transition-colors flex items-center space-x-1 text-sm font-medium">
            <LogOut size={16} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* EN-TÊTE DU PANNEAU DE CONTRÔLE */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">Tableau de bord agronomique</h2>
            <p className="text-stone-600 mt-1">Supervision de l'exploitation et du verger de 1 250 Papayers Calina IPB9</p>
          </div>
          
          {/* SÉLECTEUR D'ONGLETS SANS RECHARGEMENT */}
          <div className="flex bg-stone-200/80 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('agronomie')}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'agronomie' ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
            >
              <Leaf size={16} />
              <span>Suivi Culture</span>
            </button>
            <button 
              onClick={() => setActiveTab('stocks')}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'stocks' ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
            >
              <Package size={16} />
              <span>Stocks & Intrants</span>
            </button>
          </div>
        </div>

        {/* CONTENU DE L'ONGLET : SUIVI AGRONOMIQUE */}
        {activeTab === 'agronomie' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire de consignation */}
            <div className="lg:col-span-1 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-stone-100">
                  <FileText className="text-orange-600" size={20} />
                  <h3 className="text-lg font-bold text-stone-900">Nouvelle Note Technique</h3>
                </div>
                
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Type d'intervention</label>
                    <select 
                      value={cultureReport.type}
                      onChange={(e) => setCultureReport({...cultureReport, type: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    >
                      <option>Suivi de parcelle</option>
                      <option>Traitement Phytosanitaire</option>
                      <option>Irrigation & Fertilisation</option>
                      <option>Rendement & Récolte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Date du relevé</label>
                    <input 
                      type="date"
                      value={cultureReport.date}
                      onChange={(e) => setCultureReport({...cultureReport, date: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Observations agronomiques</label>
                    <textarea 
                      rows="4"
                      value={cultureReport.observation}
                      onChange={(e) => setCultureReport({...cultureReport, observation: e.target.value})}
                      placeholder="Décrivez l'état végétatif des papayers, l'avancement de la floraison ou les actions menées..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder-stone-400"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-2"
                  >
                    <CheckCircle size={18} />
                    <span>Diffuser le rapport</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Historique ou graphiques */}
            <div className="lg:col-span-2 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="text-orange-600" size={20} />
                  <h3 className="text-lg font-bold text-stone-900">Courbe de suivi d'activité</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full">Temps Réel</span>
              </div>
              <div className="h-64 sm:h-80 w-full mt-6">
                <p className="text-sm text-stone-500 mb-4 font-medium">Visualisation de la régularité des relevés de culture (Données de simulation) :</p>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={[
                    { name: 'Lun', rapports: 2 },
                    { name: 'Mar', rapports: 1 },
                    { name: 'Mer', rapports: 4 },
                    { name: 'Jeu', rapports: 2 },
                    { name: 'Ven', rapports: 3 },
                    { name: 'Sam', rapports: 5 },
                    { name: 'Dim', rapports: 1 }
                  ]}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} />
                    <YAxis stroke="#78716c" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="rapports" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU DE L'ONGLET : GESTION DES STOCKS */}
        {activeTab === 'stocks' && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Package className="text-orange-600" size={20} />
                <h3 className="text-lg font-bold text-stone-900">Inventaire et Matériel Critique</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-4">Nom de la ressource</th>
                    <th className="pb-4">Catégorie</th>
                    <th className="pb-4 text-center">Quantité actuelle</th>
                    <th className="pb-4">Statut / Alertes</th>
                    <th className="pb-4 text-right">Actions rapides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm font-medium">
                  {stocks.map(item => {
                    const isLow = item.quantity <= item.minLimit;
                    return (
                      <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 font-bold text-stone-900">{item.name}</td>
                        <td className="py-4 text-stone-600">{item.category}</td>
                        <td className="py-4 text-center font-mono text-base font-bold text-stone-800">
                          {item.quantity} <span className="text-xs text-stone-500 font-sans font-medium">{item.unit}</span>
                        </td>
                        <td className="py-4">
                          {isLow ? (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                              <AlertTriangle size={12} />
                              <span>Seuil critique dépassé</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                              <span>Stock optimal</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="inline-flex items-center space-x-2 bg-stone-100 p-1 rounded-lg">
                            <button 
                              onClick={() => handleStockChange(item.id, -1)}
                              className="p-1.5 bg-white text-stone-700 rounded-md hover:bg-orange-50 hover:text-orange-700 transition-colors shadow-sm"
                              title="Diminuer de 1"
                            >
                              <Minus size={14} />
                            </button>
                            <button 
                              onClick={() => handleStockChange(item.id, 1)}
                              className="p-1.5 bg-white text-stone-700 rounded-md hover:bg-orange-50 hover:text-orange-700 transition-colors shadow-sm"
                              title="Augmenter de 1"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
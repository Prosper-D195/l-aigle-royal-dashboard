# 🦅 L'AIGLE ROYAL - Dashboard Admin

 Dashboard d'Administration** de **L'AIGLE ROYAL**,
 
  Une interface de gestion de prestige conçue sur mesure pour l'exploitation agricole. Ce panneau de contrôle permet de suivre en temps réel le cahier de culture agronomique et de piloter l'inventaire des intrants nobles.

---

## 🎨 Identité Visuelle & Expérience

L'interface arbore un thème de luxe mêlant des teintes de **Terre Cuite**, d'**Orange Cuivré** et de **Blanc Cassé translucide** (effet *Glassmorphism* / verre poli). 
L'arrière-plan intègre une animation vidéo immersive et fluide en boucle montrant le travail humain au cœur des champs, offrant une expérience utilisateur unique et haut de gamme.

---

## 🏗️ Architecture du Projet

Ce Dashboard est une application Single Page Application (SPA) bâtie avec **React** et **Vite**, stylisée via **Tailwind CSS**. Elle s'intègre dans un écosystème à 3 modules :
1. **Dashboard Admin (Ce projet)** : Hébergé sur **Netlify**.
2. **L'AIGLE ROYAL API (Back-end)** : Serveur Node.js / Express hébergé sur **Railway**.
3. **Base de Données** : PostgreSQL hébergé sur **Neon.tech**.

---

## 🛠️ Fonctionnalités Clés

- 🔐 **Espace Sécurisé** : Authentification par jeton de sécurité (JWT) avec persistance de session via `localStorage`.
- 📝 **Suivi Agronomique** : Formulaire de consignation des relevés et notes techniques (Catégories : Suivi de parcelle, Phytosanitaire, Irrigation, Rendements...).
- 📦 **Gestion des Stocks** : Inventaire des intrants (Semences, Engrais, Outillage) avec alertes visuelles automatiques de réapprovisionnement en cas de franchissement du seuil critique.
- ⚡ **Ajustement Rapide** : Incrémentation et décrémentation des volumes en un clic sans rechargement de page.


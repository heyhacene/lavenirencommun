# 📖 L'Avenir en commun — Application Android & Web (Programme 2027)

Application officielle et interactive pour explorer le programme de gouvernement de la Nouvelle France (**L'Avenir en commun** — Jean-Luc Mélenchon 2027, coordination : Clémence Guetté & Hadrien Clouet).

## ✨ Fonctionnalités Clés

- **🗂️ 111 Fiches Thématiques Condensées** : Chaque fiche met en avant sa **Mesure Clé Phare** et un condensé facile à lire.
- **📜 Version Intégrale Déroulante** : En un clic sur une fiche, accédez à l'intégralité du texte officiel et à la liste numérotée de l'ensemble des **1 069 mesures**.
- **🔍 Moteur de Recherche Instantané** : Recherche floue en temps réel sur les titres, sous-catégories, mesures clés et détails.
- **👥 Filtres par Profils Citoyens** : *Salariés*, *Jeunes & Étudiants*, *Retraités*, *Services Publics & Santé*, *Pouvoir d'Achat*, *Écologie & Climat*, *Logement*, *6e République & Démocratie*, *Paix & International*.
- **🔔 Système d'Alertes Programmables (Option C)** :
  - **Notifications natives Android** (via @capacitor/local-notifications) qui sonnent à l'heure choisie chaque jour avec une fiche tirée au sort selon vos thématiques favorites, même quand l'application est fermée.
  - **Notifications flash / Popups In-App** : bandeau d'alerte élégant en haut de l'écran lors de l'utilisation de l'application avec accès direct à la fiche.
- **💶 Chiffrage Budgétaire 2027 & 5 Plans Sectoriels** : Visualisation interactive du budget (+106,4 Md€ de dépenses, +81,7 Md€ de recettes, pôle d'investissement de 100 Md€) et des 5 plans d'urgence (Santé, Ruralités, ESR, BTP & Logement, Automobile).
- **📚 Mode Lecteur Continu** : Lecture fluide du livre de la première à la dernière page avec sommaire interactif et réglage de la taille de texte.

## 🛠️ Stack Technique

- **Framework** : React 19 + TypeScript + Vite
- **Styling** : Tailwind CSS (Palette officielle violet profond #4C0297 & lavande)
- **Mobile Engine** : Capacitor Android 8.5.3 (r.lavenirencommun.app)
- **Notifications** : @capacitor/local-notifications
- **CI/CD** : GitHub Actions (.github/workflows/build-apk.yml) compilant et signant automatiquement l'APK de release Android publié dans GitHub Releases.

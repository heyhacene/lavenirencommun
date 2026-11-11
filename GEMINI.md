# Directives du Projet — L'Avenir en commun

## 1. Priorité absolue à l'application (Aucun contournement imposé à l'utilisateur)
- **Ne jamais suggérer d'éviter ou d'abandonner l'application** : Face à un bogue, un plantage, une difficulté d'installation (ex. blocage constructeur Samsung, permissions Android) ou une incompatibilité sur un modèle d'appareil particulier, il est strictement interdit de proposer à l'utilisateur ou à ses testeurs d'abandonner l'application ou d'utiliser une alternative de repli (ex. : « n'installez pas l'appli, allez sur le navigateur », « faites sans l'application »).
- **Résolution obligatoire à la racine dans l'application** : L'assistant doit systématiquement :
  1. Identifier et corriger le code ou la configuration source (événements tactiles, balises natives, gestion d'historique, signature d'APK, scripts de compilation et de déploiement).
  2. Fournir des explications techniques directes et des étapes de déblocage claires pour que l'application native elle-même s'installe et s'exécute sans friction.
  3. Considérer l'expérience dans l'application native comme l'unique objectif final acceptable.

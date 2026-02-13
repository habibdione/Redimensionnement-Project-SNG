@echo off
REM ═══════════════════════════════════════════════════════════════
REM  HELPER - DÉPLOIEMENT RAILWAY
REM ═══════════════════════════════════════════════════════════════

cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║  🚀 GUIDE DÉPLOIEMENT - RAILWAY + GITHUB PAGES              ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo.
echo  ARCHITECTURE FINALE
echo  ═══════════════════════════════════════════════════════════════
echo.
echo   GitHub Pages (Frontend)
echo   https://habibdione.github.io/Redimensionnement-Project-SNG/
echo            ↓
echo            ↓ CORS Enabled
echo            ↓
echo   Railway (Backend API)
echo   https://your-app-name-production.up.railway.app/api
echo            ↓
echo   PostgreSQL (sur Railway)
echo.
echo.
echo  ✅ CHECKLIST PRÉ-DÉPLOIEMENT
echo  ═══════════════════════════════════════════════════════════════
echo.
echo   [ ] 1. Vérifier que .env est dans .gitignore
echo   [ ] 2. Créer un compte Railway (railway.app)
echo   [ ] 3. Connecter votre repo GitHub à Railway
echo   [ ] 4. Ajouter PostgreSQL au projet Railway
echo   [ ] 5. Configurer les variables d'environnement
echo   [ ] 6. Lancer le déploiement
echo   [ ] 7. Copier l'URL publique
echo   [ ] 8. Mettre à jour config.js
echo   [ ] 9. Commit et push GitHub
echo   [ ] 10. Tester depuis GitHub Pages
echo.
echo.
echo  COMMANDOS GIT POUR DÉPLOYER
echo  ═══════════════════════════════════════════════════════════════
echo.
echo   git add .
echo   git commit -m "Déploiement Railway - Config mise à jour"
echo   git push origin main
echo.
echo   Railway déplie automatiquement après le push!
echo.
echo.
echo  FICHIERS CRÉÉS POUR VOUS
echo  ═══════════════════════════════════════════════════════════════
echo.
echo   ✓ RAILWAY_DEPLOYMENT.md  - Guide complet
echo   ✓ config.js               - Configuré pour Railway
echo   ✓ .railwayignore         - Fichiers à ignorer
echo   ✓ Procfile                - Configuration déploiement
echo   ✓ .gitignore              - .env exclu (sécurité)
echo.
echo.
echo  LIENS UTILES
echo  ═══════════════════════════════════════════════════════════════
echo.
echo   Railway Dashboard: https://railway.app
echo   Documentation:     https://docs.railway.app
echo   Troubleshooting:   https://docs.railway.app/troubleshooting
echo.
echo.
echo  APRÈS DÉPLOIEMENT
echo  ═══════════════════════════════════════════════════════════════
echo.
echo   1. Accédez: http://localhost:5000/test-connection.html
echo   2. Changez API_URL dans la console browser
echo   3. Ou modifiez config.js et relancez
echo   4. GitHub Pages utilisera automatiquement la nouvelle URL
echo.
echo.
echo Appuyez sur une touche pour continuer...
pause > nul

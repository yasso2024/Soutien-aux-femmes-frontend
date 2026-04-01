# My-App - Frontoffice Utilisateur

React frontoffice utilisateur application for public visitors and authenticated platform roles (admin, femme malade, association, benevole, donateur).

## Tech Stack

- React 19
- Vite
- React Router
- Ant Design
- Axios
- OpenAI SDK (chatbot-related integration)

## Main Features

- Public pages (home, quiz, traitements, events)
- Authentication (login/signup/forgot/reset password)
- Shared authenticated pages (profile, change password, notifications)
- Role-based dashboards and pages:
	- Admin
	- Femme malade
	- Association
	- Benevole
	- Donateur
- Embedded chatbot component

## Tableaux de bord par acteur

Ce projet `my-app` correspond au frontoffice utilisateur avec une vue personnalisee selon le role.

Association :
- organiser des actions solidaires ;
- proposer des aides en reponse aux besoins publies.

Femme beneficiaire :
- deposer des demandes d'aide ;
- recevoir des propositions d'aide ;
- suivre les affectations liees a ses demandes.

Benevole :
- participer aux actions solidaires ;
- suivre ses affectations.

Donateur :
- effectuer des dons ;
- contribuer au financement des demandes ;
- consulter les propositions associees aux contributions.

Administrateur :
- acceder a un dashboard de supervision globale (selon permissions).

## Project Structure

```text
my-app/
	src/
		api/                        # API service modules per domain
		components/
			guards/ProtectedRoute.jsx # Role-based route guard
			common/RoleHomeRouter.jsx # Redirect by role
			chatbot/ChatBot.jsx
		contexts/
			AuthContext.jsx           # Token/user session management
		layouts/
			PublicLayout.jsx
			ClientLayout.jsx
		pages/
			public/
			shared/
			admin/
			femme/
			association/
			benevole/
			donateur/
		utils/
			axiosClient.js
```

## Routing Overview

Public:
- `/`
- `/quiz`
- `/traitements`
- `/events`
- `/login`
- `/signup` and `/inscription`
- `/forgot-password`
- `/reset-password/:token`

Protected (all authenticated users):
- `/redirect-by-role`
- `/profile`
- `/change-password`
- `/notifications`

Role-specific protected routes:
- `ADMINISTRATEUR`: `/admin/dashboard`
- `FEMME MALADE`: `/femme/dashboard`, `/femme/demandes`, `/femme/add-demande`, `/femme/propositions`
- `ASSOCIATION`: `/association/dashboard`, `/association/actions-solidaires`, `/association/actions-solidaires/add`, `/association/propositions-aide`, `/association/add-proposition-aide`
- `BENEVOLE`: `/benevole/dashboard`, `/benevole/affectations`
- `DONATEUR` (or `DONTEUR` depending on backend data): `/donateur/dashboard`, `/donateur/dons`, `/donateur/add-don`, `/donateur/demandes-financees`

## Environment Variables

Create `.env` in `my-app/`:

```env
VITE_API_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
```

## Install and Run

```bash
cd my-app
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Authentication Behavior

- Token key used by this app: `token`
- Token is injected automatically by Axios interceptor
- On `401`, token is removed and user is redirected to `/login`

## Notes

- This app and `frontend` both default to Vite port `5173`; run one app on another port when needed.
- Role names must match backend values exactly.

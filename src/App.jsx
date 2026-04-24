import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";

import PublicLayout from "./layouts/PublicLayout";
import ClientLayout from "./layouts/ClientLayout";

import ProtectedRoute from "./components/guards/ProtectedRoute";
import RoleHomeRouter from "./components/common/RoleHomeRouter";
import ChatBot from "./components/chatbot/ChatBot";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import Quiz from "./pages/public/Quiz";
import Traitements from "./pages/public/Traitements";
import Events from "./pages/public/Events";
import SignUp from "./pages/public/SignUp";

import Profile from "./pages/shared/Profile";
import ChangePassword from "./pages/shared/ChangePassword";
import NotificationsList from "./pages/shared/NotificationsList";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUtilisateurs from "./pages/admin/AdminUtilisateurs";
import AdminActionsSolidaires from "./pages/admin/AdminActionsSolidaires";

import FemmeDashboard from "./pages/femme/FemmeDashboard";
import DemandesList from "./pages/femme/DemandesList";
import AddDemande from "./pages/femme/AddDemande";
import PropositionsList from "./pages/femme/PropositionsList";
import AffectationsListFemme from "./pages/femme/AffectationsList";

import AssociationDashboard from "./pages/association/AssociationDashboard";
import ActionsSolidairesList from "./pages/association/ActionsSolidairesList";
import AddActionSolidaire from "./pages/association/AddActionSolidaire";
import PropositionsAideList from "./pages/association/PropositionsAideList";
import AddPropositionAide from "./pages/association/AddPropositionAide";

import BenevoleDashboard from "./pages/benevole/BenevoleDashboard";
import AffectationsList from "./pages/benevole/AffectationsList";
import ActionsSolidairesBenevole from "./pages/benevole/ActionsSolidairesBenevole";

import DonateurDashboard from "./pages/donateur/DonateurDashboard";
import AddDon from "./pages/donateur/AddDon";
import DonsList from "./pages/donateur/DonsList";
import DemandesFinanceesList from "./pages/donateur/DemandesFinanceesList";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f7078b",
          colorInfo: "#f7078b",
        },
      }}
    >
      <AntdApp>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/traitements" element={<Traitements />} />
              <Route path="/events" element={<Events />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/inscription" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<ClientLayout />}>
                <Route path="/redirect-by-role" element={<RoleHomeRouter />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/notifications" element={<NotificationsList />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMINISTRATEUR"]} />}>
              <Route element={<ClientLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/demandes" element={<AdminDashboard />} />
                <Route path="/admin/propositions-aide" element={<AdminDashboard />} />
                <Route path="/admin/dons" element={<AdminDashboard />} />
                <Route path="/admin/affectations" element={<AdminDashboard />} />
                <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
                <Route path="/admin/actions-solidaires" element={<AdminActionsSolidaires />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["FEMME MALADE"]} />}>
              <Route element={<ClientLayout />}>
                <Route path="/femme/dashboard" element={<FemmeDashboard />} />
                <Route path="/femme/demandes" element={<DemandesList />} />
                <Route path="/femme/add-demande" element={<AddDemande />} />
                <Route path="/femme/propositions" element={<PropositionsList />} />
                <Route path="/femme/affectations" element={<AffectationsListFemme />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ASSOCIATION"]} />}>
              <Route element={<ClientLayout />}>
                <Route
                  path="/association/dashboard"
                  element={<AssociationDashboard />}
                />
                <Route
                  path="/association/actions-solidaires"
                  element={<ActionsSolidairesList />}
                />
                <Route
                  path="/association/actions-solidaires/add"
                  element={<AddActionSolidaire />}
                />
                <Route
                  path="/association/propositions-aide"
                  element={<PropositionsAideList />}
                />
                <Route
                  path="/association/add-proposition-aide"
                  element={<AddPropositionAide />}
                />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["BENEVOLE"]} />}>
              <Route element={<ClientLayout />}>
                <Route path="/benevole/dashboard" element={<BenevoleDashboard />} />
                <Route path="/benevole/actions-solidaires" element={<ActionsSolidairesBenevole />} />
                <Route
                  path="/benevole/affectations"
                  element={<AffectationsList />}
                />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["DONTEUR", "DONATEUR"]} />}>
              <Route element={<ClientLayout />}>
                <Route path="/donateur/dashboard" element={<DonateurDashboard />} />
                <Route path="/donateur/dons" element={<DonsList />} />
                <Route path="/donateur/add-don" element={<AddDon />} />
                <Route
                  path="/donateur/demandes-financees"
                  element={<DemandesFinanceesList />}
                />
              </Route>
            </Route>
          </Routes>

          <ChatBot />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
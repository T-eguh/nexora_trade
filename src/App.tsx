import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { TradingPage } from './pages/public/TradingPage';
import { AccountsPage } from './pages/public/AccountsPage';
import { PlatformsPage } from './pages/public/PlatformsPage';
import { MarketsPage } from './pages/public/MarketsPage';
import { ToolsPage } from './pages/public/ToolsPage';
import { EducationPage } from './pages/public/EducationPage';
import { ArticleDetailPage } from './pages/public/ArticleDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { FaqPage } from './pages/public/FaqPage';

// Legal Pages
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { RiskDisclosurePage } from './pages/legal/RiskDisclosurePage';
import { AmlPage } from './pages/legal/AmlPage';
import { CookiesPage } from './pages/legal/CookiesPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Client Dashboard Pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { TradingAccountsPage } from './pages/dashboard/TradingAccountsPage';
import { DashboardMarketsPage } from './pages/dashboard/DashboardMarketsPage';
import { PositionsPage } from './pages/dashboard/PositionsPage';
import { OrdersPage } from './pages/dashboard/OrdersPage';
import { DepositPage } from './pages/dashboard/DepositPage';
import { WithdrawalPage } from './pages/dashboard/WithdrawalPage';
import { TransactionsPage } from './pages/dashboard/TransactionsPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { SecurityPage } from './pages/dashboard/SecurityPage';
import { SupportPage } from './pages/dashboard/SupportPage';
import { VerificationPage } from './pages/dashboard/VerificationPage';

// Admin Portal Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAccountsPage } from './pages/admin/AdminAccountsPage';
import { AdminMarketsPage } from './pages/admin/AdminMarketsPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { AdminFaqPage } from './pages/admin/AdminFaqPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// 404
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/trading" element={<TradingPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/platforms" element={<PlatformsPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/education/:slug" element={<ArticleDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/risk-disclosure" element={<RiskDisclosurePage />} />
          <Route path="/aml" element={<AmlPage />} />
          <Route path="/cookies" element={<CookiesPage />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Dedicated Standalone Client & Admin Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Client Dashboard Routes (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverviewPage />} />
          <Route path="accounts" element={<TradingAccountsPage />} />
          <Route path="markets" element={<DashboardMarketsPage />} />
          <Route path="positions" element={<PositionsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdrawal" element={<WithdrawalPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="verification" element={<VerificationPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="settings" element={<SecurityPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* Admin Portal Routes (Admin Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="accounts" element={<AdminAccountsPage />} />
          <Route path="markets" element={<AdminMarketsPage />} />
          <Route path="transactions" element={<AdminTransactionsPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="faq" element={<AdminFaqPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;

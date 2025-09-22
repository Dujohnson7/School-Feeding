import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'

// Import pages
import LandingPage from '@/components/landing/landing-page'
import Login from '@/pages/login/page'
import ForgotPassword from '@/pages/forgot-password/page'
import Profile from '@/pages/profile/page'

// Admin pages
import AdminDashboard from '@/components/admin/dashboard'
import AdminUsers from '@/pages/admin-users/page'
import AdminLogs from '@/pages/admin-logs/page'
import AdminSettings from '@/pages/admin-settings/page'

// District pages
import DistrictDashboard from '@/components/district/dashboard'
import DistrictApprovals from '@/pages/district-approvals/page'
import DistrictBudget from '@/pages/district-budget/page'
import DistrictReports from '@/pages/district-reports/page'
import AddSupplier from '@/components/district/add-supplier'
import ManageSuppliers from '@/pages/manage-suppliers/page'

// Government pages
import GovDashboard from '@/components/government/dashboard'
import GovAnalytics from '@/pages/gov-analytics/page'
import GovBudget from '@/pages/gov-budget/page'
import GovReports from '@/pages/gov-reports/page'

// Parent pages
import ParentPay from '@/pages/parent-pay/page'
import ParentReceipts from '@/pages/parent-receipts/page'

// School pages
import SchoolDashboard from '@/components/school/dashboard'
import SchoolReports from '@/pages/school-reports/page'
import RequestFood from '@/pages/request-food/page'
import TrackDelivery from '@/pages/track-delivery/page'
import ManageStockManagers from '@/pages/manage-stock-managers/page'

// Stock pages
import StockDashboard from '@/components/stock/dashboard'
import StockDistribution from '@/pages/stock-distribution/page'
import StockInventory from '@/pages/stock-inventory/page'
import StockReceiving from '@/pages/stock-receiving/page'
import StockReports from '@/pages/stock-reports/page'

// Supplier pages
import SupplierDashboard from '@/components/supplier/dashboard'
import SupplierDeliveries from '@/pages/supplier-deliveries/page'
import SupplierOrders from '@/pages/supplier-orders/page'
import SupplierReports from '@/pages/supplier-reports/page'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-logs" element={<AdminLogs />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          
          {/* District Routes */}
          <Route path="/district-dashboard" element={<DistrictDashboard />} />
          <Route path="/district-approvals" element={<DistrictApprovals />} />
          <Route path="/district-budget" element={<DistrictBudget />} />
          <Route path="/district-reports" element={<DistrictReports />} />
          <Route path="/add-supplier" element={<AddSupplier />} />
          <Route path="/manage-suppliers" element={<ManageSuppliers />} />
          
          {/* Government Routes */}
          <Route path="/gov-dashboard" element={<GovDashboard />} />
          <Route path="/gov-analytics" element={<GovAnalytics />} />
          <Route path="/gov-budget" element={<GovBudget />} />
          <Route path="/gov-reports" element={<GovReports />} />
          
          {/* Parent Routes */}
          <Route path="/parent-pay" element={<ParentPay />} />
          <Route path="/parent-receipts" element={<ParentReceipts />} />
          
          {/* School Routes */}
          <Route path="/school-dashboard" element={<SchoolDashboard />} />
          <Route path="/school-reports" element={<SchoolReports />} />
          <Route path="/request-food" element={<RequestFood />} />
          <Route path="/track-delivery" element={<TrackDelivery />} />
          <Route path="/manage-stock-managers" element={<ManageStockManagers />} />
          
          {/* Stock Routes */}
          <Route path="/stock-dashboard" element={<StockDashboard />} />
          <Route path="/stock-distribution" element={<StockDistribution />} />
          <Route path="/stock-inventory" element={<StockInventory />} />
          <Route path="/stock-receiving" element={<StockReceiving />} />
          <Route path="/stock-reports" element={<StockReports />} />
          
          {/* Supplier Routes */}
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier-deliveries" element={<SupplierDeliveries />} />
          <Route path="/supplier-orders" element={<SupplierOrders />} />
          <Route path="/supplier-reports" element={<SupplierReports />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import RoleLayout from '@/components/shared/role-layout'

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
          <Route path="/admin-dashboard" element={<RoleLayout role="admin"><AdminDashboard /></RoleLayout>} />
          <Route path="/admin-profile" element={<RoleLayout role="admin"><Profile /></RoleLayout>} />
          <Route path="/admin-users" element={<RoleLayout role="admin"><AdminUsers /></RoleLayout>} />
          <Route path="/admin-logs" element={<RoleLayout role="admin"><AdminLogs /></RoleLayout>} />
          <Route path="/admin-settings" element={<RoleLayout role="admin"><AdminSettings /></RoleLayout>} />
          
          {/* District Routes */}
          <Route path="/district-dashboard" element={<RoleLayout role="district"><DistrictDashboard /></RoleLayout>} />
          <Route path="/district-profile" element={<RoleLayout role="district"><Profile /></RoleLayout>} />
          <Route path="/district-approvals" element={<RoleLayout role="district"><DistrictApprovals /></RoleLayout>} />
          <Route path="/district-budget" element={<RoleLayout role="district"><DistrictBudget /></RoleLayout>} />
          <Route path="/district-reports" element={<RoleLayout role="district"><DistrictReports /></RoleLayout>} />
          <Route path="/add-supplier" element={<RoleLayout role="district"><AddSupplier /></RoleLayout>} />
          <Route path="/manage-suppliers" element={<RoleLayout role="district"><ManageSuppliers /></RoleLayout>} />
          
          {/* Government Routes */}
          <Route path="/gov-dashboard" element={<RoleLayout role="government"><GovDashboard /></RoleLayout>} />
          <Route path="/gov-profile" element={<RoleLayout role="government"><Profile /></RoleLayout>} />
          <Route path="/gov-analytics" element={<RoleLayout role="government"><GovAnalytics /></RoleLayout>} />
          <Route path="/gov-budget" element={<RoleLayout role="government"><GovBudget /></RoleLayout>} />
          <Route path="/gov-reports" element={<RoleLayout role="government"><GovReports /></RoleLayout>} />
           
          
          {/* School Routes */}
          <Route path="/school-dashboard" element={<RoleLayout role="school"><SchoolDashboard /></RoleLayout>} />
          <Route path="/school-profile" element={<RoleLayout role="school"><Profile /></RoleLayout>} />
          <Route path="/school-reports" element={<RoleLayout role="school"><SchoolReports /></RoleLayout>} />
          <Route path="/request-food" element={<RoleLayout role="school"><RequestFood /></RoleLayout>} />
          <Route path="/track-delivery" element={<RoleLayout role="school"><TrackDelivery /></RoleLayout>} />
          <Route path="/manage-stock-managers" element={<RoleLayout role="school"><ManageStockManagers /></RoleLayout>} />
          
          {/* Stock Routes */}
          <Route path="/stock-dashboard" element={<RoleLayout role="stock"><StockDashboard /></RoleLayout>} />
          <Route path="/stock-profile" element={<RoleLayout role="stock"><Profile /></RoleLayout>} />
          <Route path="/stock-distribution" element={<RoleLayout role="stock"><StockDistribution /></RoleLayout>} />
          <Route path="/stock-inventory" element={<RoleLayout role="stock"><StockInventory /></RoleLayout>} />
          <Route path="/stock-receiving" element={<RoleLayout role="stock"><StockReceiving /></RoleLayout>} />
          <Route path="/stock-reports" element={<RoleLayout role="stock"><StockReports /></RoleLayout>} />
          
          {/* Supplier Routes */}
          <Route path="/supplier-dashboard" element={<RoleLayout role="supplier"><SupplierDashboard /></RoleLayout>} />
          <Route path="/supplier-profile" element={<RoleLayout role="supplier"><Profile /></RoleLayout>} />
          <Route path="/supplier-deliveries" element={<RoleLayout role="supplier"><SupplierDeliveries /></RoleLayout>} />
          <Route path="/supplier-orders" element={<RoleLayout role="supplier"><SupplierOrders /></RoleLayout>} />
          <Route path="/supplier-reports" element={<RoleLayout role="supplier"><SupplierReports /></RoleLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
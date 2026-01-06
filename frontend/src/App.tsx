import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import RoleLayout from '@/components/shared/role-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Toaster } from '@/components/ui/sonner'

// Import pages
import LandingPage from '@/components/landing/landing-page'
import Login from '@/pages/login/page'
import ForgotPassword from '@/pages/forgot-password/page'
import ResetPassword from '@/pages/reset-password/page'
import OTPPage from '@/pages/otp/page'
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
import DistrictDeliveries from '@/pages/district-deliveries/page'

// Government pages
import GovDashboard from '@/components/government/dashboard'
import GovAnalytics from '@/pages/gov-analytics/page'
import GovBudget from '@/pages/gov-budget/page'
import GovReports from '@/pages/gov-reports/page'
import GovSchools from '@/components/government/schools'
import GovDistricts from '@/components/government/districts'
import GovItems from '@/components/government/items'

// School pages
import SchoolDashboard from '@/components/school/dashboard'
import SchoolReports from '@/pages/school-reports/page'
import RequestFood from '@/pages/request-food/page'
import RequestFoodList from '@/pages/request-food-list/page'
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
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute><RoleLayout role="admin"><AdminDashboard /></RoleLayout></ProtectedRoute>} />
          <Route path="/admin-profile" element={<ProtectedRoute><RoleLayout role="admin"><Profile /></RoleLayout></ProtectedRoute>} />
          <Route path="/admin-users" element={<ProtectedRoute><RoleLayout role="admin"><AdminUsers /></RoleLayout></ProtectedRoute>} />
          <Route path="/admin-logs" element={<ProtectedRoute><RoleLayout role="admin"><AdminLogs /></RoleLayout></ProtectedRoute>} />
          <Route path="/admin-settings" element={<ProtectedRoute><RoleLayout role="admin"><AdminSettings /></RoleLayout></ProtectedRoute>} />

          {/* District Routes */}
          <Route path="/district-dashboard" element={<ProtectedRoute><RoleLayout role="district"><DistrictDashboard /></RoleLayout></ProtectedRoute>} />
          <Route path="/district-profile" element={<ProtectedRoute><RoleLayout role="district"><Profile /></RoleLayout></ProtectedRoute>} />
          <Route path="/district-approvals" element={<ProtectedRoute><RoleLayout role="district"><DistrictApprovals /></RoleLayout></ProtectedRoute>} />
          <Route path="/district-budget" element={<ProtectedRoute><RoleLayout role="district"><DistrictBudget /></RoleLayout></ProtectedRoute>} />
          <Route path="/district-reports" element={<ProtectedRoute><RoleLayout role="district"><DistrictReports /></RoleLayout></ProtectedRoute>} />
          <Route path="/add-supplier" element={<ProtectedRoute><RoleLayout role="district"><AddSupplier /></RoleLayout></ProtectedRoute>} />
          <Route path="/manage-suppliers" element={<ProtectedRoute><RoleLayout role="district"><ManageSuppliers /></RoleLayout></ProtectedRoute>} />
          <Route path="/district-deliveries" element={<ProtectedRoute><RoleLayout role="district"><DistrictDeliveries /></RoleLayout></ProtectedRoute>} />

          {/* Government Routes */}
          <Route path="/gov-dashboard" element={<ProtectedRoute><RoleLayout role="government"><GovDashboard /></RoleLayout></ProtectedRoute>} />
          <Route path="/gov-profile" element={<ProtectedRoute><RoleLayout role="government"><Profile /></RoleLayout></ProtectedRoute>} />
          <Route path="/gov-schools" element={<ProtectedRoute><RoleLayout role="government"><GovSchools /></RoleLayout></ProtectedRoute>} />
          <Route path="/gov-districts" element={<ProtectedRoute><RoleLayout role="government"><GovDistricts /></RoleLayout></ProtectedRoute>} />
          <Route path="/gov-items" element={<ProtectedRoute><RoleLayout role="government"><GovItems /></RoleLayout></ProtectedRoute>} />
          <Route path="/gov-analytics" element={<ProtectedRoute><RoleLayout role="government"><GovAnalytics /></RoleLayout></ProtectedRoute>} />
          <Route path="/gov-budget" element={<ProtectedRoute><RoleLayout role="government"><GovBudget /></RoleLayout></ProtectedRoute>} />
          <Route path="/gov-reports" element={<ProtectedRoute><RoleLayout role="government"><GovReports /></RoleLayout></ProtectedRoute>} />


          {/* School Routes */}
          <Route path="/school-dashboard" element={<ProtectedRoute><RoleLayout role="school"><SchoolDashboard /></RoleLayout></ProtectedRoute>} />
          <Route path="/school-profile" element={<ProtectedRoute><RoleLayout role="school"><Profile /></RoleLayout></ProtectedRoute>} />
          <Route path="/school-reports" element={<ProtectedRoute><RoleLayout role="school"><SchoolReports /></RoleLayout></ProtectedRoute>} />
          <Route path="/request-food" element={<ProtectedRoute><RoleLayout role="school"><RequestFood /></RoleLayout></ProtectedRoute>} />
          <Route path="/request-food-list" element={<ProtectedRoute><RoleLayout role="school"><RequestFoodList /></RoleLayout></ProtectedRoute>} />
          <Route path="/track-delivery" element={<ProtectedRoute><RoleLayout role="school"><TrackDelivery /></RoleLayout></ProtectedRoute>} />
          <Route path="/manage-stock-managers" element={<ProtectedRoute><RoleLayout role="school"><ManageStockManagers /></RoleLayout></ProtectedRoute>} />

          {/* Stock Routes */}
          <Route path="/stock-dashboard" element={<ProtectedRoute><RoleLayout role="stock"><StockDashboard /></RoleLayout></ProtectedRoute>} />
          <Route path="/stock-profile" element={<ProtectedRoute><RoleLayout role="stock"><Profile /></RoleLayout></ProtectedRoute>} />
          <Route path="/stock-distribution" element={<ProtectedRoute><RoleLayout role="stock"><StockDistribution /></RoleLayout></ProtectedRoute>} />
          <Route path="/stock-inventory" element={<ProtectedRoute><RoleLayout role="stock"><StockInventory /></RoleLayout></ProtectedRoute>} />
          <Route path="/stock-receiving" element={<ProtectedRoute><RoleLayout role="stock"><StockReceiving /></RoleLayout></ProtectedRoute>} />
          <Route path="/stock-reports" element={<ProtectedRoute><RoleLayout role="stock"><StockReports /></RoleLayout></ProtectedRoute>} />

          {/* Supplier Routes */}
          <Route path="/supplier-dashboard" element={<ProtectedRoute><RoleLayout role="supplier"><SupplierDashboard /></RoleLayout></ProtectedRoute>} />
          <Route path="/supplier-profile" element={<ProtectedRoute><RoleLayout role="supplier"><Profile /></RoleLayout></ProtectedRoute>} />
          <Route path="/supplier-deliveries" element={<ProtectedRoute><RoleLayout role="supplier"><SupplierDeliveries /></RoleLayout></ProtectedRoute>} />
          <Route path="/supplier-orders" element={<ProtectedRoute><RoleLayout role="supplier"><SupplierOrders /></RoleLayout></ProtectedRoute>} />
          <Route path="/supplier-reports" element={<ProtectedRoute><RoleLayout role="supplier"><SupplierReports /></RoleLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
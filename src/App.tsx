import { lazy, Suspense, type ComponentType } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { ProgramsConversational } from './pages/ProgramsConversational'
import { ProgramsIGCSE } from './pages/ProgramsIGCSE'
import { ProgramsUAE } from './pages/ProgramsUAE'
import { BookTrial } from './pages/BookTrial'
import { Contact } from './pages/Contact'
import { FAQs } from './pages/FAQs'
import { PlaceholderPage } from './pages/Placeholder'
import { RequireAuth } from './auth/RequireAuth'
import { PageLoader } from './components/ui/Spinner'

// Auth and dashboard screens are split out so the marketing pages stay light.
// `any` only bounds the props; each lazy component keeps its own prop types.
function lazyNamed<M extends Record<K, ComponentType<any>>, K extends keyof M>(load: () => Promise<M>, name: K) {
  return lazy(async () => ({ default: (await load())[name] }))
}

const Tutors = lazyNamed(() => import('./pages/Tutors'), 'Tutors')
const Login = lazyNamed(() => import('./pages/auth/Login'), 'Login')
const Register = lazyNamed(() => import('./pages/auth/Register'), 'Register')
const VerifyEmail = lazyNamed(() => import('./pages/auth/VerifyEmail'), 'VerifyEmail')
const ForgotPassword = lazyNamed(() => import('./pages/auth/ForgotPassword'), 'ForgotPassword')
const ResetPassword = lazyNamed(() => import('./pages/auth/ResetPassword'), 'ResetPassword')
const DashboardLayout = lazyNamed(() => import('./components/dashboard/DashboardLayout'), 'DashboardLayout')
const Profile = lazyNamed(() => import('./pages/account/Profile'), 'Profile')
const Classes = lazyNamed(() => import('./pages/account/Classes'), 'Classes')
const Billing = lazyNamed(() => import('./pages/account/Billing'), 'Billing')
const TaCourses = lazyNamed(() => import('./pages/ta/Courses'), 'TaCourses')
const TaCourseDetail = lazyNamed(() => import('./pages/ta/CourseDetail'), 'TaCourseDetail')
const TaOfferings = lazyNamed(() => import('./pages/ta/Offerings'), 'TaOfferings')
const TaSessions = lazyNamed(() => import('./pages/ta/Sessions'), 'TaSessions')
const TaStudents = lazyNamed(() => import('./pages/ta/Students'), 'TaStudents')
const TaEarnings = lazyNamed(() => import('./pages/ta/Earnings'), 'TaEarnings')
const AdminUsers = lazyNamed(() => import('./pages/admin/Users'), 'AdminUsers')
const AdminUserDetail = lazyNamed(() => import('./pages/admin/UserDetail'), 'AdminUserDetail')
const AdminPrograms = lazyNamed(() => import('./pages/admin/Programs'), 'AdminPrograms')
const AdminProgramDetail = lazyNamed(() => import('./pages/admin/ProgramDetail'), 'AdminProgramDetail')
const AdminOfferings = lazyNamed(() => import('./pages/admin/Offerings'), 'AdminOfferings')
const AdminTrials = lazyNamed(() => import('./pages/admin/Trials'), 'AdminTrials')
const AdminPayments = lazyNamed(() => import('./pages/admin/Payments'), 'AdminPayments')
const AdminZoomLicenses = lazyNamed(() => import('./pages/admin/ZoomLicenses'), 'AdminZoomLicenses')

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs/conversational" element={<ProgramsConversational />} />
            <Route path="/programs/igcse" element={<ProgramsIGCSE />} />
            <Route path="/programs/uae" element={<ProgramsUAE />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/about" element={<PlaceholderPage title="About" />} />
            <Route path="/book-trial" element={<BookTrial />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
            <Route path="/contact" element={<Contact />} />

            {/* Paths must match the links the API emails (AuthService.BuildLink). */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<RequireAuth />}>
              <Route element={<DashboardLayout />}>
                <Route path="/account" element={<Profile />} />
                <Route element={<RequireAuth roles={['Student']} />}>
                  <Route path="/account/classes" element={<Classes />} />
                  <Route path="/account/billing" element={<Billing />} />
                </Route>
                <Route element={<RequireAuth roles={['TA']} />}>
                  <Route path="/ta/courses" element={<TaCourses />} />
                  <Route path="/ta/courses/:id" element={<TaCourseDetail />} />
                  <Route path="/ta/offerings" element={<TaOfferings />} />
                  <Route path="/ta/sessions" element={<TaSessions />} />
                  <Route path="/ta/students" element={<TaStudents />} />
                  <Route path="/ta/earnings" element={<TaEarnings />} />
                </Route>
                <Route element={<RequireAuth roles={['Admin']} />}>
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/users/:id" element={<AdminUserDetail />} />
                  <Route path="/admin/programs" element={<AdminPrograms />} />
                  <Route path="/admin/programs/:id" element={<AdminProgramDetail />} />
                  <Route path="/admin/offerings" element={<AdminOfferings />} />
                  <Route path="/admin/trials" element={<AdminTrials />} />
                  <Route path="/admin/payments" element={<AdminPayments />} />
                  <Route path="/admin/zoom" element={<AdminZoomLicenses />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<PlaceholderPage title="404" />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App

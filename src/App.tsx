import { Route, Routes } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { ProgramsConversational } from './pages/ProgramsConversational'
import { ProgramsIGCSE } from './pages/ProgramsIGCSE'
import { BookTrial } from './pages/BookTrial'
import { Contact } from './pages/Contact'
import { PlaceholderPage } from './pages/Placeholder'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs/conversational" element={<ProgramsConversational />} />
          <Route path="/programs/igcse" element={<ProgramsIGCSE />} />
          <Route path="/about" element={<PlaceholderPage title="About" />} />
          <Route path="/book-trial" element={<BookTrial />} />
          <Route path="/faqs" element={<PlaceholderPage title="FAQs" />} />
          <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

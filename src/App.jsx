
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './pages/home/Home'
import { Login } from './pages/login/Login'
import { Register } from './pages/register/Register'
import { Admin } from './pages/admin/Admin'
import { MovieList } from './pages/admin/movie/MovieList'

function App() {

  return (
    <>
       <BrowserRouter>
      <Routes>
        {/* Public routes without Sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes with Sidebar */}
        <Route
          path="/*"
          element={
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/admin" element={<Admin/>} />
                <Route path="/movieList" element={<MovieList/>} />
                <Route path="/admin" element={<Admin/>} />
              </Routes>
          }
        />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

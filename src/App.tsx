// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import AcademiaSelection from './pages/Academia/AcademiaSelection';
import Workout1 from './pages/Workout1/Workout1';
import Workout2 from './pages/Workout2/Workout2';
import Workout3 from './pages/Workout3/Workout3';
import SwimmingRegistration from './pages/Swimming/SwimmingRegistration';
import PilatesRegistration from './pages/Pilates/PilatesRegistration';
import EsteiraRegistration from './pages/Esteira/EsteiraRegistration';
import SpinningRegistration from './pages/Spinning/SpinningRegistration';
import History from './pages/History/History';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/academia" element={
            <ProtectedRoute>
              <AcademiaSelection />
            </ProtectedRoute>
          } />
                 
          {/* Treinos de 3 dias */}
          <Route path="/workout-1" element={
            <ProtectedRoute>
              <Workout1 />
            </ProtectedRoute>
          } />
          <Route path="/workout-2" element={
            <ProtectedRoute>
              <Workout2 />
            </ProtectedRoute>
          } />
          <Route path="/workout-3" element={
            <ProtectedRoute>
              <Workout3 />
            </ProtectedRoute>
          } />
          
          {/* Outros treinos */}
          <Route path="/swimming" element={
            <ProtectedRoute>
              <SwimmingRegistration />
            </ProtectedRoute>
          } />
          <Route path="/pilates" element={
            <ProtectedRoute>
              <PilatesRegistration />
            </ProtectedRoute>
          } />
          <Route path="/esteira" element={
            <ProtectedRoute>
              <EsteiraRegistration />
            </ProtectedRoute>
          } />
          <Route path="/spinning" element={
            <ProtectedRoute>
              <SpinningRegistration />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
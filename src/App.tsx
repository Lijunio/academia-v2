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
import WorkoutA from './pages/WorkoutA/WorkoutA';
import WorkoutB from './pages/WorkoutB/WorkoutB';
import SwimmingRegistration from './pages/Swimming/SwimmingRegistration';
import PilatesRegistration from './pages/Pilates/PilatesRegistration';
import History from './pages/History/History';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota pública - não precisa de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas - precisam de login */}
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
          <Route path="/workout-a" element={
            <ProtectedRoute>
              <WorkoutA />
            </ProtectedRoute>
          } />
          <Route path="/workout-b" element={
            <ProtectedRoute>
              <WorkoutB />
            </ProtectedRoute>
          } />
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
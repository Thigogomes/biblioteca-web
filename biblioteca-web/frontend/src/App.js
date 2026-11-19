import React from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AutorList from './components/AutorList';
import AutorForm from './components/AutorForm';
import LivroList from './components/LivroList';
import LivroForm from './components/LivroForm';

export default function App() {
  return (
    <div className="app">
      <header className="topo">
        <h1>Biblioteca Web</h1>
        <nav>
          <NavLink to="/autores">Autores</NavLink>
          <NavLink to="/livros">Livros</NavLink>
        </nav>
      </header>

      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Navigate to="/livros" replace />} />
          <Route path="/autores" element={<AutorList />} />
          <Route path="/autores/novo" element={<AutorForm />} />
          <Route path="/autores/editar/:id" element={<AutorForm />} />
          <Route path="/livros" element={<LivroList />} />
          <Route path="/livros/novo" element={<LivroForm />} />
          <Route path="/livros/editar/:id" element={<LivroForm />} />
        </Routes>
      </main>
    </div>
  );
}

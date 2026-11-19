import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { livroService } from '../services/api';

export default function LivroList() {
  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      const { data } = await livroService.listar();
      setLivros(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar os livros. O backend está rodando?');
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const excluir = async (livro) => {
    if (!window.confirm(`Excluir o livro "${livro.titulo}"?`)) return;
    try {
      await livroService.deletar(livro.id);
      carregar();
    } catch {
      setErro('Não foi possível excluir o livro.');
    }
  };

  return (
    <section>
      <div className="cabecalho">
        <h2>Livros</h2>
        <Link className="btn primario" to="/livros/novo">Novo livro</Link>
      </div>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <div className="tabela-wrap">
        <table>
          <thead>
            <tr><th>Título</th><th>Autor</th><th>Ano</th><th>Gênero</th><th>ISBN</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {livros.map((l) => (
              <tr key={l.id}>
                <td>{l.titulo}</td>
                <td>{l.autor ? l.autor.nome : '-'}</td>
                <td>{l.anoPublicacao ?? '-'}</td>
                <td>{l.genero || '-'}</td>
                <td>{l.isbn || '-'}</td>
                <td className="acoes">
                  <Link className="btn" to={`/livros/editar/${l.id}`}>Editar</Link>
                  <button className="btn perigo" onClick={() => excluir(l)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {livros.length === 0 && !erro && (
          <p className="vazio">Nenhum livro cadastrado. Clique em “Novo livro” para começar.</p>
        )}
      </div>
    </section>
  );
}

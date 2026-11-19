import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { autorService, livroService } from '../services/api';

const VAZIO = { titulo: '', isbn: '', anoPublicacao: '', genero: '', autorId: '' };

export default function LivroForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livro, setLivro] = useState(VAZIO);
  const [autores, setAutores] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    autorService.listar()
      .then(({ data }) => setAutores(data))
      .catch(() => setErro('Não foi possível carregar os autores.'));
  }, []);

  useEffect(() => {
    if (!id) return;
    livroService.buscar(id)
      .then(({ data }) => setLivro({
        titulo: data.titulo || '',
        isbn: data.isbn || '',
        anoPublicacao: data.anoPublicacao ?? '',
        genero: data.genero || '',
        autorId: data.autor ? String(data.autor.id) : '',
      }))
      .catch(() => setErro('Livro não encontrado.'));
  }, [id]);

  const alterar = (e) => setLivro({ ...livro, [e.target.name]: e.target.value });

  const salvar = async (e) => {
    e.preventDefault();
    // O autor vai só com o id: "autor": {"id": 1}
    const payload = {
      titulo: livro.titulo,
      isbn: livro.isbn || null,
      anoPublicacao: livro.anoPublicacao === '' ? null : Number(livro.anoPublicacao),
      genero: livro.genero || null,
      autor: { id: Number(livro.autorId) },
    };
    try {
      if (id) await livroService.atualizar(id, payload);
      else await livroService.criar(payload);
      navigate('/livros');
    } catch {
      setErro('Não foi possível salvar. Confira os campos e tente de novo.');
    }
  };

  return (
    <section>
      <h2>{id ? 'Editar livro' : 'Novo livro'}</h2>
      <form className="formulario" onSubmit={salvar}>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <div className="campo">
          <label htmlFor="titulo">Título *</label>
          <input id="titulo" name="titulo" value={livro.titulo} onChange={alterar}
                 maxLength={200} required />
        </div>
        <div className="campo">
          <label htmlFor="autorId">Autor *</label>
          <select id="autorId" name="autorId" value={livro.autorId} onChange={alterar} required>
            <option value="">Selecione um autor</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="isbn">ISBN</label>
          <input id="isbn" name="isbn" value={livro.isbn} onChange={alterar} maxLength={20} />
        </div>
        <div className="campo">
          <label htmlFor="anoPublicacao">Ano de publicação</label>
          <input id="anoPublicacao" name="anoPublicacao" type="number"
                 value={livro.anoPublicacao} onChange={alterar} />
        </div>
        <div className="campo">
          <label htmlFor="genero">Gênero</label>
          <input id="genero" name="genero" value={livro.genero} onChange={alterar} maxLength={50} />
        </div>
        <div className="botoes">
          <button type="submit" className="btn primario">Salvar livro</button>
          <Link className="btn" to="/livros">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}

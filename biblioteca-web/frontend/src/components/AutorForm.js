import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { autorService } from '../services/api';

const VAZIO = { nome: '', nacionalidade: '', dataNascimento: '' };

export default function AutorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [autor, setAutor] = useState(VAZIO);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    autorService.buscar(id)
      .then(({ data }) => setAutor({
        nome: data.nome || '',
        nacionalidade: data.nacionalidade || '',
        dataNascimento: data.dataNascimento || '',
      }))
      .catch(() => setErro('Autor não encontrado.'));
  }, [id]);

  const alterar = (e) => setAutor({ ...autor, [e.target.name]: e.target.value });

  const salvar = async (e) => {
    e.preventDefault();
    const payload = {
      ...autor,
      nacionalidade: autor.nacionalidade || null,
      dataNascimento: autor.dataNascimento || null,
    };
    try {
      if (id) await autorService.atualizar(id, payload);
      else await autorService.criar(payload);
      navigate('/autores');
    } catch {
      setErro('Não foi possível salvar. Confira os campos e tente de novo.');
    }
  };

  return (
    <section>
      <h2>{id ? 'Editar autor' : 'Novo autor'}</h2>
      <form className="formulario" onSubmit={salvar}>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <div className="campo">
          <label htmlFor="nome">Nome *</label>
          <input id="nome" name="nome" value={autor.nome} onChange={alterar}
                 maxLength={100} required />
        </div>
        <div className="campo">
          <label htmlFor="nacionalidade">Nacionalidade</label>
          <input id="nacionalidade" name="nacionalidade" value={autor.nacionalidade}
                 onChange={alterar} maxLength={50} />
        </div>
        <div className="campo">
          <label htmlFor="dataNascimento">Data de nascimento</label>
          <input id="dataNascimento" name="dataNascimento" type="date"
                 value={autor.dataNascimento} onChange={alterar} />
        </div>
        <div className="botoes">
          <button type="submit" className="btn primario">Salvar autor</button>
          <Link className="btn" to="/autores">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}

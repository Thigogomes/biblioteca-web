import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { autorService } from '../services/api';
import { formatarData } from '../utils/formatarData';

export default function AutorList() {
  const [autores, setAutores] = useState([]);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      const { data } = await autorService.listar();
      setAutores(data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar os autores. O backend está rodando?');
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const excluir = async (autor) => {
    if (!window.confirm(`Excluir o autor "${autor.nome}"?`)) return;
    try {
      await autorService.deletar(autor.id);
      carregar();
    } catch (e) {
      setErro(e.response?.status === 409
        ? 'Este autor tem livros cadastrados. Exclua os livros antes.'
        : 'Não foi possível excluir o autor.');
    }
  };

  return (
    <section>
      <div className="cabecalho">
        <h2>Autores</h2>
        <Link className="btn primario" to="/autores/novo">Novo autor</Link>
      </div>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <div className="tabela-wrap">
        <table>
          <thead>
            <tr><th>Nome</th><th>Nacionalidade</th><th>Nascimento</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {autores.map((a) => (
              <tr key={a.id}>
                <td>{a.nome}</td>
                <td>{a.nacionalidade || '-'}</td>
                <td>{formatarData(a.dataNascimento)}</td>
                <td className="acoes">
                  <Link className="btn" to={`/autores/editar/${a.id}`}>Editar</Link>
                  <button className="btn perigo" onClick={() => excluir(a)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {autores.length === 0 && !erro && (
          <p className="vazio">Nenhum autor cadastrado. Clique em “Novo autor” para começar.</p>
        )}
      </div>
    </section>
  );
}

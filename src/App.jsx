import React, { useState } from 'react';

const ConsultaCNPJ = () => {
  const [cnpj, setCnpj] = useState('');
  const [dadosEmpresa, setDadosEmpresa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const buscarCNPJ = async (e) => {
    e.preventDefault(); 
    setErro('');
    setDadosEmpresa(null);

    const cnpjLimpo = cnpj.replace(/\D/g, '');

    if (cnpjLimpo.length !== 14) {
      setErro('O CNPJ deve conter exatamente 14 números.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      
      if (response.ok) {
        const dados = await response.json();
        setDadosEmpresa(dados);
      } else if (response.status === 404) {
        setErro('CNPJ não encontrado. Verifique os números digitados.');
      } else {
        setErro('Erro ao consultar o CNPJ. Tente novamente mais tarde.');
      }
    } catch (error) {
      setErro('Erro de conexão. Verifique sua internet.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', fontFamily: 'sans-serif' }}>
      <h2>Consulta de CNPJ</h2>
      
      <form onSubmit={buscarCNPJ} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Digite o CNPJ..."
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Buscando...' : 'Consultar'}
        </button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {dadosEmpresa && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h3>Dados da Empresa</h3>
          <p><strong>Razão Social:</strong> {dadosEmpresa.razao_social}</p>
          <p><strong>Nome Fantasia:</strong> {dadosEmpresa.nome_fantasia || 'Não possui'}</p>
          <p><strong>Situação Cadastral:</strong> {dadosEmpresa.descricao_situacao_cadastral}</p>
          <p><strong>CNPJ:</strong> {dadosEmpresa.cnpj}</p>
          <p><strong>Endereço:</strong> {dadosEmpresa.logradouro}, {dadosEmpresa.numero}</p>
          <p><strong>Cidade/UF:</strong> {dadosEmpresa.municipio} - {dadosEmpresa.uf}</p>
        </div>
      )}
    </div>
  );
};

export default ConsultaCNPJ;
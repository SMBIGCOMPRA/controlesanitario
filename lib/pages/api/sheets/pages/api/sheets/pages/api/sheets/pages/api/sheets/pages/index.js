import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Filtros from '../components/Filtros';
import ListaEquipamentos from '../components/ListaEquipamentos';
import ModalCriacao from '../components/ModalCriacao';
import ModalEdicao from '../components/ModalEdicao';
import ModalManutencao from '../components/ModalManutencao';
import Toast from '../components/Toast';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

export default function Home() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentosFiltrados, setEquipamentosFiltrados] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [setores, setSetores] = useState([]);
  const [tiposServico, setTiposServico] = useState([]);
  const [filtroItem, setFiltroItem] = useState([]);
  const [filtroLoja, setFiltroLoja] = useState([]);
  const [filtroSetor, setFiltroSetor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCriacaoAberto, setModalCriacaoAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalManutencaoAberto, setModalManutencaoAberto] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [equipamentos, filtroItem, filtroLoja, filtroSetor]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sheets/equipamentos');
      
      if (response.data.sucesso) {
        setEquipamentos(response.data.equipamentos);
        setEquipamentosFiltrados(response.data.equipamentos);
        setLojas(response.data.lojas);
        setSetores(response.data.setores);
        setTiposServico(response.data.tiposServico);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...equipamentos];
    
    if (filtroItem.length > 0) {
      filtrados = filtrados.filter(eq => filtroItem.includes(eq.item));
    }
    
    if (filtroLoja.length > 0) {
      filtrados = filtrados.filter(eq => filtroLoja.includes(eq.loja));
    }
    
    if (filtroSetor.length > 0) {
      filtrados = filtrados.filter(eq => filtroSetor.includes(eq.setor));
    }
    
    setEquipamentosFiltrados(filtrados);
  };

  const abrirEdicao = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    setModalEdicaoAberto(true);
  };

  const abrirManutencao = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    setModalManutencaoAberto(true);
  };

  return (
    <Layout>
      <Head>
        <title>Controle Sanitário</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes" />
        <meta name="description" content="Sistema de Controle Sanitário" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#0b3b4c',
            borderRadius: '50px',
            padding: '16px 24px',
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#f5f9fc] to-[#e9f0f5]">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Header onNovoClick={() => setModalCriacaoAberto(true)} />

          <Filtros
            equipamentos={equipamentos}
            lojas={lojas}
            setores={setores}
            filtroItem={filtroItem}
            filtroLoja={filtroLoja}
            filtroSetor={filtroSetor}
            onFiltroItemChange={setFiltroItem}
            onFiltroLojaChange={setFiltroLoja}
            onFiltroSetorChange={setFiltroSetor}
            totalResultados={equipamentosFiltrados.length}
          />

          <ListaEquipamentos
            equipamentos={equipamentosFiltrados}
            loading={loading}
            onEditar={abrirEdicao}
            onNovaManutencao={abrirManutencao}
          />
        </div>
      </div>

      <ModalCriacao
        isOpen={modalCriacaoAberto}
        onClose={() => setModalCriacaoAberto(false)}
        lojas={lojas}
        setores={setores}
        onSuccess={() => {
          carregarDados();
          setModalCriacaoAberto(false);
          toast.success('Equipamento criado com sucesso!');
        }}
      />

      <ModalEdicao
        isOpen={modalEdicaoAberto}
        onClose={() => setModalEdicaoAberto(false)}
        equipamento={equipamentoSelecionado}
        lojas={lojas}
        setores={setores}
        onSuccess={() => {
          carregarDados();
          setModalEdicaoAberto(false);
          toast.success('Equipamento atualizado com sucesso!');
        }}
      />

      <ModalManutencao
        isOpen={modalManutencaoAberto}
        onClose={() => setModalManutencaoAberto(false)}
        equipamento={equipamentoSelecionado}
        tiposServico={tiposServico}
        onSuccess={() => {
          carregarDados();
          setModalManutencaoAberto(false);
          toast.success('Manutenção registrada com sucesso!');
        }}
      />
    </Layout>
  );
}

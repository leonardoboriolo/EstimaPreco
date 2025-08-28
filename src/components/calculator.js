import { useState, useEffect } from 'react';
import InsumosList from './insumosList';
import { calcularLucroSobreProduto } from '../utils/calculo';
import { layout } from '../styles/classes';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function Calculator() {
  const [insumos, setinsumos] = useState([
    { id: Date.now(), nome: '', valor: '', quantidade: 1 }
  ]);
  const [porcentagem, setPorcentagem] = useState(20);
  const [qtdProdutos, setQtdProdutos] = useState(10);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nomeInsumoCotacao, setnomeInsumoCotacao] = useState('');
  const [cotacoesSalvas, setCotacoesSalvas] = useState([]);
  const [cotacaoEmEdicaoId, setCotacaoEmEdicaoId] = useState(null);
  const [cotacaoCarregada, setCotacaoCarregada] = useState(false);
  const [modoSomenteLeitura, setModoSomenteLeitura] = useState(false);

  useEffect(() => {
    try {
      const listaMap = new Map();

      insumos.forEach(i => {
        const nome = i.nome?.trim();
        const valorUnitario = Number(i.valor?.toString().replace(',', '.'));
        const quantidade = Number(i.quantidade);

        if (nome && !isNaN(valorUnitario) && valorUnitario >= 0 && !isNaN(quantidade) && quantidade >= 1) {
          const valorTotalInsumo = valorUnitario * quantidade;
          listaMap.set(nome, valorTotalInsumo);
        }
      });

      const valorInvestidoTotal = Array.from(listaMap.values()).reduce((acc, valor) => acc + valor, 0);

      const res = calcularLucroSobreProduto(
        listaMap,
        Number(porcentagem),
        Number(qtdProdutos),
        valorInvestidoTotal
      );

      setResultado({
        ...res,
        valorInvestidoTotal
      });

      setErro('');
    } catch (e) {
      setErro(e.message);
      setResultado(null);
    }
  }, [insumos, porcentagem, qtdProdutos]);


  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem('cotações')) || [];
    setCotacoesSalvas(salvas);
  }, []);

  const handleChange = (id, campo, valor) => {
    setinsumos(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        if (campo === 'quantidade') {
          const quantidade = Number(valor);
          if (isNaN(quantidade) || quantidade < 1 || !Number.isInteger(quantidade)) {
            return item; // Ignora valores inválidos
          }
          return { ...item, quantidade };
        }

        return { ...item, [campo]: valor };
      })
    );
  };


  const handleAdd = () => {
    const hasInvalidField = insumos.some(item => {
      const valorNumerico = Number(item.valor?.toString().replace(',', '.'));
      const quantidadeNumerica = Number(item.quantidade);

      return (
        item.nome.trim() === '' ||
        item.valor === '' ||
        isNaN(valorNumerico) || valorNumerico < 0 ||
        isNaN(quantidadeNumerica) || quantidadeNumerica < 1
      );
    });

    if (hasInvalidField) {
      setErrorMessage('Todos os campos de insumos devem ser preenchidos corretamente!');
      return;
    }

    setinsumos(prev => [
      ...prev,
      { id: Date.now(), nome: '', valor: '', quantidade: 1 }
    ]);

    setErrorMessage('');
  };

  const handleRemove = id => {
    setinsumos(prev => prev.filter(item => item.id !== id));
  };

  const limparCotacao = () => {
    setinsumos([{ id: Date.now(), nome: '', valor: '', quantidade: 1 }]);
    setPorcentagem(20);
    setQtdProdutos(10);
    setResultado(null);
    setErro('');
    setErrorMessage('');
    setnomeInsumoCotacao('');
  };

  const salvarCotacao = () => {
    if (!resultado || nomeInsumoCotacao.trim() === '') {
      alert('Preencha o nome do insumo e calcule os dados antes de salvar.');
      return;
    }

    const novaCotacao = {
      id: cotacaoEmEdicaoId ?? Date.now(),
      nome: nomeInsumoCotacao,
      insumos,
      porcentagem,
      qtdProdutos,
      resultado
    };

    const cotacoesSalvas = JSON.parse(localStorage.getItem('cotações')) || [];

    let novasCotacoes;
    if (cotacaoEmEdicaoId) {
      const cotacaoOriginal = cotacoesSalvas.find(c => c.id === cotacaoEmEdicaoId);

      if (cotacaoOriginal && saoCotacoesIguais(novaCotacao, cotacaoOriginal)) {
        console.log('Nenhuma alteração detectada. Nada será salvo.');
        return;
      }

      // Atualizar cotação existente
      novasCotacoes = cotacoesSalvas.map(c =>
        c.id === cotacaoEmEdicaoId ? novaCotacao : c
      );
    } else {
      // Adicionar nova
      novasCotacoes = [...cotacoesSalvas, novaCotacao];
    }

    console.log( 'Salvando cotações:', novasCotacoes);

    localStorage.setItem('cotações', JSON.stringify(novasCotacoes));

    alert(cotacaoEmEdicaoId ? 'Cotação atualizada com sucesso!' : 'Cotação salva com sucesso!');
    setnomeInsumoCotacao('');
    setCotacaoEmEdicaoId(null);
    limparCotacao();
    atualizarListaCotacoes();
  };

  const editarCotacao = (id) => {
    setModoSomenteLeitura(false);
    const cotacoesSalvas = JSON.parse(localStorage.getItem('cotações')) || [];
    const cotacao = cotacoesSalvas.find(c => c.id === id);
    if (!cotacao) return;

    setnomeInsumoCotacao(cotacao.nome);
    setinsumos(cotacao.insumos);
    setPorcentagem(cotacao.porcentagem);
    setQtdProdutos(cotacao.qtdProdutos);
    setCotacaoEmEdicaoId(id); // Agora estamos em modo edição
    setCotacaoCarregada(false);
  };

  const carregarCotacao = (cotacao) => {
    setnomeInsumoCotacao(cotacao.nome);
    setinsumos(cotacao.insumos);
    setPorcentagem(cotacao.porcentagem);
    setQtdProdutos(cotacao.qtdProdutos);
    setResultado(cotacao.resultado);
    setModoSomenteLeitura(true);
    setCotacaoCarregada(true);
  };

  const saoCotacoesIguais = (a, b) => {
    if (!a || !b) return false;
    if (a.nome !== b.nome) return false;
    if (a.porcentagem !== b.porcentagem) return false;
    if (a.qtdProdutos !== b.qtdProdutos) return false;
    if (a.insumos.length !== b.insumos.length) return false;

    for (let i = 0; i < a.insumos.length; i++) {
      if (
        a.insumos[i].nome !== b.insumos[i].nome ||
        a.insumos[i].valor !== b.insumos[i].valor ||
        a.insumos[i].quantidade !== b.insumos[i].quantidade
      ) {
        return false;
      }
    }

    return true;
  };

  const atualizarListaCotacoes = () => {
    const atualizadas = JSON.parse(localStorage.getItem('cotações')) || [];
    setCotacoesSalvas(atualizadas);
  };

  const excluirCotacao = (id) => {
    const novas = cotacoesSalvas.filter(c => c.id !== id);
    setCotacoesSalvas(novas);
    localStorage.setItem('cotações', JSON.stringify(novas));
  };

  function exportarParaPDF(cotacao) {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Cotação: ${cotacao.nome}`, 10, 10);



    // Tabela
    const dados = cotacao.insumos.map((insumo, index) => [
      index + 1,
      insumo.nome,
      `R$ ${Number(insumo.valor.toString().replace(',', '.')).toFixed(2).replace('.', ',')}`,
    ]);

    autoTable(doc, {
      head: [['#', 'Insumo', 'Valor']],
      body: dados,
      startY: 20
    });

    // Posição abaixo da tabela
    const yFinal = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes da Cotação:', 14, yFinal);

    doc.setFont('helvetica', 'normal');
    doc.text(`• Quantidade de Produtos: ${cotacao.qtdProdutos}`, 16, yFinal + 8);
    doc.text(`• % de Lucro: ${cotacao.porcentagem}%`, 16, yFinal + 16);

    if (cotacao.resultado) {
      doc.text(
        `• Valor Investido Total: R$ ${cotacao.resultado.valorInvestidoTotal.toFixed(2).replace('.', ',')}`,
        16,
        yFinal + 24
      );
      doc.text(
        `• Custo Total com Lucro: R$ ${cotacao.resultado.custoTotalComLucro.replace('.', ',')}`,
        16,
        yFinal + 32
      );
    }

    // Rodapé com data/hora
    const dataAtual = new Date().toLocaleString('pt-BR');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Exportado em: ${dataAtual}`, 14, 290); // 290 fica perto da margem inferior da página A4

    // Salvar
    doc.save(`${cotacao.nome}.pdf`);
  }

  async function exportarParaExcelEstilizado(cotacao) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Cotação');

    // Cores e estilos base
    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    const headerFont = { color: { argb: 'FFFFFFFF' }, bold: true };
    const borderStyle = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Título
    sheet.mergeCells('A1', 'C1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `Cotação: ${cotacao.nome}`;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

    // Cabeçalho da tabela
    sheet.addRow(['#', 'Insumo', 'Valor (R$)']);
    const headerRow = sheet.getRow(2);
    headerRow.eachCell(cell => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.border = borderStyle;
      cell.alignment = { horizontal: 'center' };
    });

    // Dados dos insumos
    cotacao.insumos.forEach((insumo, index) => {
      const row = sheet.addRow([
        index + 1,
        insumo.nome,
        Number(insumo.valor.toString().replace(',', '.')).toFixed(2).replace('.', ',')
      ]);
      row.eachCell(cell => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle' };
      });
    });

    // Espaço
    sheet.addRow([]);

    // Detalhes da Cotação
    sheet.addRow(['Detalhes da Cotação']).font = { bold: true };

    const detalhes = [
      ['Quantidade de Produtos', cotacao.qtdProdutos],
      ['% de Lucro', `${cotacao.porcentagem}%`]
    ];

    if (cotacao.resultado) {
      detalhes.push(
        ['Valor Investido Total', `R$ ${cotacao.resultado.valorInvestidoTotal.toFixed(2).replace('.', ',')}`],
        ['Custo Total com Lucro', `R$ ${cotacao.resultado.custoTotalComLucro.replace('.', ',')}`]
      );
    }

    detalhes.forEach(par => {
      const row = sheet.addRow(par);
      row.getCell(1).font = { bold: true };
    });

    // Rodapé com data de exportação
    sheet.addRow([]);
    const dataHora = new Date().toLocaleString('pt-BR');
    const footerRow = sheet.addRow(['Exportado em:', dataHora]);
    footerRow.getCell(1).font = { italic: true };
    footerRow.getCell(2).font = { italic: true };

    // Largura das colunas
    sheet.columns = [
      { width: 6 },
      { width: 40 },
      { width: 20 }
    ];

    // Gerar e salvar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${cotacao.nome}.xlsx`);
  }

  return (
    <div className={`${layout.container} min-w-[320px] w-full max-w-3xl mx-auto p-4`}>
      <div className={layout.card}>

        <InsumosList
          insumos={insumos}
          onChange={handleChange}
          onAdd={handleAdd}
          onRemove={handleRemove}
          readOnly={modoSomenteLeitura}
        />

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <div className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Valor Investido Total (R$)</label>
            <input
              type="text"
              value={
                resultado?.valorInvestidoTotal != null
                  ? resultado.valorInvestidoTotal.toFixed(2).replace('.', ',')
                  : ''
              }
              className={`${layout.input} bg-gray-100 cursor-not-allowed`}
              readOnly
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Quantidade de Produtos</label>
            <input
              type="number"
              value={qtdProdutos}
              onChange={e => setQtdProdutos(e.target.value)}
              className={layout.input}
              readOnly={modoSomenteLeitura}
              min="0"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">% de Lucro Desejado</label>
            <input
              type="number"
              value={porcentagem}
              onChange={e => setPorcentagem(e.target.value)}
              className={layout.input}
              readOnly={modoSomenteLeitura}
              min="0"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Nome da Cotação</label>
            <input
              type="text"
              value={nomeInsumoCotacao}
              onChange={e => setnomeInsumoCotacao(e.target.value)}
              className={layout.input}
              placeholder="Ex: Cotação de materiais"
              readOnly={modoSomenteLeitura}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={salvarCotacao}
              className={`px-4 py-2 rounded-lg text-white transition ${modoSomenteLeitura ? layout.disabledButton : layout.savedButton}`}
              disabled={modoSomenteLeitura}
            >
              {cotacaoEmEdicaoId ? 'Atualizar Cotação' : 'Salvar Cotação'}
            </button>

            <button
              onClick={limparCotacao}
              className={`px-4 py-2 rounded-lg text-white transition ${modoSomenteLeitura ? layout.disabledButton : layout.cleanButton}`}
              disabled={modoSomenteLeitura}
            >
              Limpar Cotação
            </button>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { limparCotacao(); setModoSomenteLeitura(false); setCotacaoEmEdicaoId(null); }}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              + Nova Cotação
            </button>

            {cotacaoCarregada && (
              <button
                onClick={() => {
                  setCotacaoEmEdicaoId(null);
                  setnomeInsumoCotacao(nomeInsumoCotacao + ' (Cópia)');
                  setModoSomenteLeitura(false);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Duplicar Cotação
              </button>
            )}
          </div>

          {/* Lista de cotações salvas */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Cotações Salvas</h2>
            {cotacoesSalvas.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma cotação salva.</p>
            ) : (
              <ul className="space-y-2">
                {cotacoesSalvas.map(cotacao => (
                  <li
                    key={cotacao.id}
                    className="border p-3 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium break-words">{cotacao.nome}</p>
                      <p className="text-sm text-gray-500">
                        {cotacao.insumos.length} itens • {cotacao.qtdProdutos} produtos
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                      <button
                        type="button"
                        onClick={() => carregarCotacao(cotacao)}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Carregar
                      </button>
                      <button
                        type="button"
                        onClick={() => editarCotacao(cotacao.id)}
                        className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Alterar
                      </button>
                      <button
                        type="button"
                        onClick={() => excluirCotacao(cotacao.id)}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
                      <button
                        type="button"
                        onClick={() => exportarParaPDF(cotacao)}
                        className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                      >
                        PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => exportarParaExcelEstilizado(cotacao)}
                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Excel
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>


        </div>

        {erro && <p className={layout.error}>Erro: {erro}</p>}

        {resultado && (
          <div className={layout.resultBox}>
            <p><strong>Valor Investido Total:</strong> R$ {resultado.valorInvestidoTotal.toFixed(2).replace('.', ',')}</p>
            <p><strong>Custo total com lucro de ({porcentagem}%):</strong> R$ {resultado.custoTotalComLucro.replace('.', ',')}</p>
            <p className="text-sm text-gray-500">(Considerando {qtdProdutos} unidades)</p>
          </div>
        )}

      </div>
    </div>
  );
}
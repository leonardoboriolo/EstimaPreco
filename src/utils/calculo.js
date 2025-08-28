export function calcularPrecoBaseUnidadePorValorInvestido(valorInvestido, qtdProdutos) {
  if (typeof valorInvestido !== 'number' || typeof qtdProdutos !== 'number') {
    throw new Error('Ambos os parâmetros devem ser do tipo Number.');
  }
  return valorInvestido / qtdProdutos;
}

export function calcularLucroSobreProduto(listainsumos, porcentagemLucro, qtdProdutos) {
  if (!(listainsumos instanceof Map) || typeof porcentagemLucro !== 'number') {
    throw new Error('O primeiro parâmetro deve ser um Map e o segundo deve ser um Number.');
  }
  const porcentagem = porcentagemLucro / 100;
  let custoTotal = 0;
  listainsumos.forEach(valor => (custoTotal += valor));

  const custoUnitario = calcularPrecoBaseUnidadePorValorInvestido(custoTotal, qtdProdutos);
  const custoTotalComLucro = custoUnitario * (1 + porcentagem);

  return {
    custoTotalComLucro: custoTotalComLucro.toFixed(2),
    valorInvestidoTotal: custoTotal.toFixed(2)
  };
}

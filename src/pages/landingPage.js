// src/components/LandingPage.js
export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold text-indigo-600">EstimaPreço</h1>
        <button
          onClick={onStart}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Acessar App
        </button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-indigo-50">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">
          Transforme seus custos em lucros com clareza e agilidade.
        </h2>
        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          Calcule o custo de qualquer produto ou serviço, defina seu preço ideal e visualize o lucro em reais e porcentagem — tudo direto no navegador.
        </p>
        <button
          onClick={() => window.location.href = '/app'}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-indigo-700 transition"
        >
          Comece agora
        </button>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid gap-12 md:grid-cols-3">
        <div className="text-center">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">Para qualquer produto ou serviço</h3>
          <p>
            Estime preços com base no custo real, seja você artesão, confeiteiro, designer ou revendedor.
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">💸</div>
          <h3 className="text-xl font-semibold mb-2">Lucro claro e instantâneo</h3>
          <p>
            Insira seus custos, defina a margem de lucro e veja o preço de venda e o retorno esperado.
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">100% no navegador</h3>
          <p>
            Seus dados ficam salvos localmente, com segurança e sem precisar criar conta.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16 px-6 bg-indigo-100">
        <h2 className="text-3xl font-bold text-indigo-800 mb-4">
          Pronto para descobrir o preço ideal do que você vende?
        </h2>
        <button
          onClick={() => window.location.href = '/app'}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-indigo-700 transition"
        >
          Usar gratuitamente
        </button>
      </section>

       {/* Pricing Section */}
      <section className="py-16 px-6 bg-white text-center" id="precos">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6">Planos para todos os perfis</h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto">
          Comece grátis e evolua conforme o seu negócio cresce.
        </p>

        <div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-2">
          {/* Plano Grátis */}
          <div className="border rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Grátis</h3>
            <p className="text-4xl font-bold text-indigo-600 mb-4">R$ 0</p>
            <ul className="text-left space-y-2 mb-6 text-gray-700">
              <li>✅ Salvar até 5 cotações</li>
              <li>✅ Cálculo de custo e lucro</li>
              <li>✅ Exportar em PDF</li>
              <li>🚫 Backup na nuvem</li>
              <li>🚫 Exportar para Excel</li>
            </ul>
            <button
              onClick={() => window.location.href = '/app'}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Começar grátis
            </button>
          </div>

          {/* Plano Pro */}
          <div className="border-2 border-indigo-600 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-4xl font-bold text-indigo-600 mb-1">R$ 19</p>
            <span className="text-gray-500 text-sm">por mês</span>
            <ul className="text-left space-y-2 mt-4 mb-6 text-gray-700">
              <li>✅ Salvar cotações ilimitadas</li>
              <li>✅ Cálculo de custo e lucro</li>
              <li>✅ Exportar em PDF e Excel</li>
              <li>✅ Backup automático no navegador</li>
              <li>✅ Suporte prioritário</li>
            </ul>
            <button
              onClick={() => window.location.href = '/checkout'}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Assinar Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} EstimaPreço. Todos os direitos reservados.
      </footer>
    </div>
  );
}

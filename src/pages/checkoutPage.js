export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">Assinatura EstimaPreço Pro</h1>
      <p className="text-gray-700 mb-6 text-center max-w-md">
        Aqui você poderá concluir sua assinatura e liberar recursos avançados como exportação Excel, backup e mais.
      </p>
      <button
        onClick={() => alert("Integração com sistema de pagamento")}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-indigo-700 transition"
      >
        Avançar para pagamento
      </button>
    </div>
  );
}
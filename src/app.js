// import { useState, useEffect } from 'react';
// import Calculator from './components/calculator';
// import LandingPage from './pages/landingPage';

// function App() {
//   const [showHelp, setShowHelp] = useState(false);
//   const [showCalculator, setShowCalculator] = useState(false);

//   // Persistir a escolha do usuário no localStorage
//   useEffect(() => {
//     const storedHelpPreference = localStorage.getItem('showHelp');
//     if (storedHelpPreference !== null) {
//       setShowHelp(storedHelpPreference === 'true');
//     }
//   }, []);

//   // Atualizar a escolha no localStorage sempre que mudar
//   useEffect(() => {
//     localStorage.setItem('showHelp', showHelp);
//   }, [showHelp]);

//   if (!showCalculator) {
//     return <LandingPage onStart={() => setShowCalculator(true)} />;
//   }

//   return (
//     <div className="w-full max-w-2xl min-w-[320px] mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Calculadora de Custo e Lucro</h1>

//       <div className="flex justify-center mb-4">
//         <button
//           onClick={() => setShowHelp(!showHelp)}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//         >
//           {showHelp ? 'Ocultar ajuda' : 'Mostrar ajuda'}
//         </button>
//       </div>

//       <div
//         className={`bg-gray-100 p-4 rounded-lg mb-6 transition-all duration-500 ease-in-out w-full ${showHelp ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
//           }`}
//       >
//         <h2 className="text-xl font-semibold mb-2 text-center">📘 Como preencher?</h2>
//         <ul className="list-disc pl-5 space-y-3 text-sm text-gray-700">
//           <li>
//             <strong>Nome do insumo:</strong> É qualquer item usado na produção do seu produto.
//             <br />
//             <span className="text-gray-500">Ex: farinha, essência, embalagem, etiqueta.</span>
//           </li>
//           <li>
//             <strong>Valor:</strong> Quanto você pagou por esse item (em reais).
//             <br />
//             <span className="text-gray-500">Ex: R$ 2,50</span>
//           </li>
//           <li>
//             <strong>Quantidade de produtos:</strong> Quantas unidades essa receita rende.
//             <br />
//             <span className="text-gray-500">Ex: 10 bolos, 20 sabonetes, 15 potes.</span>
//           </li>
//           <li>
//             <strong>Porcentagem de lucro:</strong> Quanto de lucro você deseja obter.
//             <br />
//             <span className="text-gray-500">Ex: 30% = você quer ganhar 30% acima do custo.</span>
//           </li>
//         </ul>
//       </div>

//       <Calculator />
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Calculator from './components/calculator';
import CheckoutPage from './pages/checkoutPage';
import { useState } from 'react';

function App() {
  const [, setStartApp] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage onStart={() => setStartApp(true)} />}
        />
        <Route path="/app" element={<Calculator />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;

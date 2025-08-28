import { layout } from '../styles/classes';

export default function InsumosList({ insumos, onChange, onAdd, onRemove, readOnly }) {
  return (
    <div className="space-y-4">
      {insumos.map(item => (
        <div key={item.id} className="flex flex-wrap gap-2 items-center">
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Qtd."
            value={item.quantidade}
            onChange={e => {
              const value = Number(e.target.value);
              if (!isNaN(value) && value >= 1) {
                onChange(item.id, 'quantidade', value);
              }
            }}
            className={`!w-12 px-2 py-2 text-sm ${layout.smallInput}`}
            readOnly={readOnly}
          />
           <span className="font-semibold text-gray-700">UN</span>
          <input
            type="text"
            placeholder="Insumo"
            value={item.nome}
            onChange={e => onChange(item.id, 'nome', e.target.value)}
            className={`flex-1 ${layout.input}`}
            readOnly={readOnly}
          />
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            placeholder="Valor (R$)"
            value={item.valor}
            onChange={e => {
              const rawValue = e.target.value;
              const numericValue = Number(rawValue.replace(',', '.'));
              if ((!isNaN(numericValue) && numericValue >= 0) || rawValue === '') {
                onChange(item.id, 'valor', rawValue);
              }
            }}
            className={`w-32 ${layout.input}`}
            readOnly={readOnly}
          />
        </div>
      ))}

      {/* Botões agrupados */}
      <div className="flex gap-2">
        <button
          onClick={onAdd}
          className={`px-4 py-2 rounded-lg text-white transition ${readOnly ? layout.disabledButton : layout.addButton}`}
          disabled={readOnly}
        >
          + Adicionar Insumos
        </button>

        {/* Botão de remover o último item */}
        {insumos.length > 1 && (
          <button
            onClick={() => onRemove(insumos[insumos.length - 1].id)}
            className={`px-4 py-2 rounded-lg text-white transition ${readOnly ? layout.disabledButton : layout.removeButton}`}
            disabled={readOnly}
          >
            - Remover
          </button>
        )}
      </div>
    </div>
  );
}

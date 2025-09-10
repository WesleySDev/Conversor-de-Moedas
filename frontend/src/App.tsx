import React, { useEffect, useState } from "react";
import "./App.css";

type Currency = {
  code: string;
  name: string;
  flag: string;
};

const currencies: Currency[] = [
  { code: "USD", name: "Dólar Americano", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "BRL", name: "Real Brasileiro", flag: "🇧🇷" },
];

function App() {
  const [amount, setAmount] = useState<number>(1); // Valor padrão 1
  const [from, setFrom] = useState<string>("USD"); // Valor padrão USD
  const [to, setTo] = useState<string>("BRL"); // Valor padrão BRL
  const [result, setResult] = useState<number | null>(null); // Resultado da conversão
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
  const [error, setError] = useState<string>(""); // Mensagem de erro

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `https://localhost:8080/convert?from=${from}&to=${to}&amount=${amount}`
      );
      if (!res.ok) throw new Erro("Erro ao buscar conversão");
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError("Erro ao converter moeda. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return;
  <div className="app-container">
    <div className="converter-card">
      <div className="header">
        <h1 className="title">
          <span className="icon">💱</span>
          Conversor de Moedas
        </h1>
        <p className="subtitle">
          Converta valores entre diferentes moedas em tempo real
        </p>
      </div>

      <form onSubmit={handleConvert} className="converter-form">
        <div className="input-group">
          <label className="input-label">Valor</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))} // Atualiza o estado do valor
            className="amount-input"
            placeholder="Digite o valor"
          />
        </div>

        <div className="currency-selector">
          <div className="currency-group">
            <label className="input-label">De</label>
            <select className="currency-select"></select>
          </div>

          <button type="button" className="swap-button" title="Trocar moedas">
            ⇄
          </button>

          <div className="currency-group">
            <label className="input-label">Para</label>
            <select></select>
          </div>
        </div>

        <button type="submit" className="convert-button"></button>
      </form>
    </div>
    <div className="result-container">
      <div className="result-card">
        <div className="result-from"></div>
        <div className="result-equals">=</div>
        <div className="result-to"></div>
      </div>
    </div>
  </div>;
}

export default App;

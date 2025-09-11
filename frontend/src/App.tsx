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
  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("BRL");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setResult(null);
    setError("");
  }, [amount, from, to]);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `http://localhost:8080/convert?from=${from}&to=${to}&amount=${amount}`
      );
      if (!res.ok) throw new Error("Erro ao buscar conversão");
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError("Não foi possível converter. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
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
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="amount-input"
              placeholder="Digite o valor"
            />
          </div>

          <div className="currency-selector">
            <div className="currency-group">
              <label className="input-label">De</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="currency-select"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swapCurrencies}
              className="swap-button"
              title="Trocar moedas"
            >
              ⇄
            </button>

            <div className="currency-group">
              <label className="input-label">Para</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="currency-select"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`convert-button ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Convertendo...
              </>
            ) : (
              "Converter"
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {result !== null && (
          <div className="result-container">
            <div className="result-card">
              <div className="result-from">
                {currencies.find((c) => c.code === from)?.flag} {amount} {from}
              </div>
              <div className="result-equals">=</div>
              <div className="result-to">
                {currencies.find((c) => c.code === to)?.flag}{" "}
                {result.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {to}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

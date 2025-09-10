package main
import (
	"encoding/json"
	"log"
	"math"
	"net/http"
	"strconv"
)

type ConversionResponse struct {
	Result float64 `json:"result"`
}

var rates = map[string]map[string]float64{
	"USD": {"USD": 1.0, "BRL": 5.0, "EUR": 0.9}, // Exemplo de taxas de câmbio
	"BRL": {"USD": 0.2, "BRL": 1.0, "EUR": 0.18}, // 1 BRL = 0.2 USD, 1 BRL = 0.18 EUR
	"EUR": {"USD": 1.1, "BRL": 5.5, "EUR": 1.0}, // 1 EUR = 1.1 USD, 1 EUR = 5.5 BRL
}

func convertHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set(key: "access-control-allow-origin", value: "*") // Permitir CORS para todas as origens

	from := r.URL.Query().Get(key:"from") // Obtém os parâmetros da URL
	to := r.URL.Query().Get(key:"to") 
	amountStr := r.URL.Query().Get(key:"amount") //

	amount, err := strconv.ParseFloat(s:amountStr, bitSize:64)
	if err != nil || amount < 0 {  // Verifica se o valor é negativo ou inválido
		http.Error(w, erro: "Valor =Inválido", code: http.StatusBadRequest) 
		return
	}
	
	rate, ok := rates[from][to]
	if !ok {
		http.Error(w, erro: "Conversão não suportada", code: http.StatusBadRequest) // Verifica se a conversão é suportada
		return
	}

	result := math.Round(x: amount*rate*100) / 100

	w.Header().Set(key: "Content-Type", value: "application/json") // Define o cabeçalho de resposta como JSON
	json.NewEncoder(w).Encode(v: ConversionResponse{Result: result}) // Codifica e envia a resposta JSON
}

func main() {
	http.HandleFunc(pattern: "/convert", handler: convertHandler) // Rota para conversão de moeda
	log.Println(v: "Servidor iniciado na porta 8080") // Inicia o servidor na porta 8080
	log.Fatal(v: http.ListenAndServe(addr: ":8080", handler: nil)) // Registra o manipulador de rota
}

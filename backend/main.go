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
	"USD": {"USD": 1.0, "BRL": 5.0, "EUR": 0.9},
	"BRL": {"USD": 0.2, "BRL": 1.0, "EUR": 0.18},
	"EUR": {"USD": 1.1, "BRL": 5.5, "EUR": 1.0},
}

func convertHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set(key: "access-control-allow-origin", value: "*")

	from := r.URL.Query().Get(key:"from")
	to := r.URL.Query().Get(key:"to")
	amountStr := r.URL.Query().Get(key:"amount")

	amount, err := strconv.ParseFloat(s:amountStr, bitSize:64)
	if err != nil || amount < 0 {
		http.Error(w, erro: "Valor =Inválido", code: http.StatusBadRequest)
		return
	}
	
	rate, ok := rates[from][to]
	if !ok {
		http.Error(w, erro: "Conversão não suportada", code: http.StatusBadRequest)
		return
	}

	result := math.Round(x: amount*rate*100) / 100

	w.Header().Set(key: "Content-Type", value: "application/json")
	json.NewEncoder(w).Encode(v: ConversionResponse{Result: result})
}

func main() {
	http.HandleFunc(pattern: "/convert", handler: convertHandler)
	log.Println(v: "Servidor iniciado na porta 8080")
	log.Fatal(v: http.ListenAndServe(addr: ":8080", handler: nil))
}

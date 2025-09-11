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
	w.Header().Set("Access-Control-Allow-Origin", "*")

	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")
	amountStr := r.URL.Query().Get("amount")

	amount, err := strconv.ParseFloat(amountStr, 64)
	if err != nil || amount < 0 {
		http.Error(w, "Valor inválido", http.StatusBadRequest)
		return
	}

	rate, ok := rates[from][to]
	if !ok {
		http.Error(w, "Conversão não suportada", http.StatusBadRequest)
		return
	}

	result := math.Round(amount*rate*100) / 100

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ConversionResponse{Result: result})
}

func main() {
	http.HandleFunc("/convert", convertHandler)
	log.Println("Servidor rodando em http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

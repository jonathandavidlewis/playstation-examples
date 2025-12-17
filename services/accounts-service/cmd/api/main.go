package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/jonathandavidlewis/playstation-examples/services/accounts-service/internal/config"
	"github.com/jonathandavidlewis/playstation-examples/services/accounts-service/internal/handlers"
	"github.com/jonathandavidlewis/playstation-examples/services/accounts-service/internal/repository"
)

func main() {
	// Load environment variables
	godotenv.Load()

	// Initialize configuration
	cfg := config.NewConfig()

	// Initialize DynamoDB repository
	repo := repository.NewDynamoDBRepository(cfg)

	// Initialize handlers
	h := handlers.NewHandler(repo)

	// Setup router
	r := mux.NewRouter()

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"healthy","service":"accounts-service"}`))
	}).Methods("GET")

	// Account endpoints
	r.HandleFunc("/api/accounts", h.CreateAccount).Methods("POST")
	r.HandleFunc("/api/accounts/{id}", h.GetAccount).Methods("GET")
	r.HandleFunc("/api/accounts/{id}", h.UpdateAccount).Methods("PUT")
	r.HandleFunc("/api/accounts/{id}", h.DeleteAccount).Methods("DELETE")
	r.HandleFunc("/api/accounts", h.ListAccounts).Methods("GET")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Accounts Service starting on port %s", port)
	log.Fatal(http.ListenAndServe(addr, r))
}

package repository

import (
	"context"
	"fmt"
	"movie-service-go/config"
	"movie-service-go/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MovieRepository struct {
	collection *mongo.Collection
}

func NewMovieRepository(client *mongo.Client) *MovieRepository {
	db := config.GetDatabase(client)
	collection := db.Collection("movies")

	return &MovieRepository{
		collection: collection,
	}
}

func (r *MovieRepository) Create(movie *models.Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	movie.ID = primitive.NewObjectID()
	movie.CreatedAt = time.Now()
	movie.UpdatedAt = time.Now()

	_, err := r.collection.InsertOne(ctx, movie)
	if err != nil {
		return fmt.Errorf("failed to create movie: %w", err)
	}

	return nil
}

func (r *MovieRepository) GetByID(id string) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid movie ID: %w", err)
	}

	var movie models.Movie
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&movie)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get movie by id: %w", err)
	}

	return &movie, nil
}

func (r *MovieRepository) GetAll() ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{}, options.Find().SetSort(bson.M{"createdAt": -1}))
	if err != nil {
		return nil, fmt.Errorf("failed to get all movies: %w", err)
	}
	defer cursor.Close(ctx)

	var movies []*models.Movie
	for cursor.Next(ctx) {
		var movie models.Movie
		if err := cursor.Decode(&movie); err != nil {
			return nil, fmt.Errorf("failed to decode movie: %w", err)
		}
		movies = append(movies, &movie)
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor error: %w", err)
	}

	return movies, nil
}

func (r *MovieRepository) Update(id string, movie *models.Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid movie ID: %w", err)
	}

	movie.UpdatedAt = time.Now()

	update := bson.M{
		"$set": bson.M{
			"title":       movie.Title,
			"description": movie.Description,
			"posterImage": movie.PosterImage,
			"genre":       movie.Genre,
			"duration":    movie.Duration,
			"rating":      movie.Rating,
			"releaseDate": movie.ReleaseDate,
			"director":    movie.Director,
			"cast":        movie.Cast,
			"updatedAt":   movie.UpdatedAt,
		},
	}

	result, err := r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	if err != nil {
		return fmt.Errorf("failed to update movie: %w", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("movie not found")
	}

	return nil
}

func (r *MovieRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid movie ID: %w", err)
	}

	result, err := r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		return fmt.Errorf("failed to delete movie: %w", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("movie not found")
	}

	return nil
}

func (r *MovieRepository) Search(title, genre string) ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}

	if title != "" {
		filter["title"] = bson.M{"$regex": title, "$options": "i"}
	}

	if genre != "" {
		filter["genre"] = bson.M{"$regex": genre, "$options": "i"}
	}

	cursor, err := r.collection.Find(ctx, filter, options.Find().SetSort(bson.M{"createdAt": -1}))
	if err != nil {
		return nil, fmt.Errorf("failed to search movies: %w", err)
	}
	defer cursor.Close(ctx)

	var movies []*models.Movie
	for cursor.Next(ctx) {
		var movie models.Movie
		if err := cursor.Decode(&movie); err != nil {
			return nil, fmt.Errorf("failed to decode movie: %w", err)
		}
		movies = append(movies, &movie)
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor error: %w", err)
	}

	return movies, nil
}

func (r *MovieRepository) GetAllGenres() ([]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pipeline := []bson.M{
		{"$group": bson.M{"_id": "$genre"}},
		{"$sort": bson.M{"_id": 1}},
	}

	cursor, err := r.collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("failed to get genres: %w", err)
	}
	defer cursor.Close(ctx)

	var genres []string
	for cursor.Next(ctx) {
		var result struct {
			ID string `bson:"_id"`
		}
		if err := cursor.Decode(&result); err != nil {
			return nil, fmt.Errorf("failed to decode genre: %w", err)
		}
		genres = append(genres, result.ID)
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor error: %w", err)
	}

	return genres, nil
}

func (r *MovieRepository) InitializeData() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verificar si ya hay datos
	count, err := r.collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return fmt.Errorf("failed to count documents: %w", err)
	}

	if count > 0 {
		return nil // Ya hay datos, no inicializar
	}

	// Datos de ejemplo
	sampleMovies := []models.Movie{
		{
			ID:          primitive.NewObjectID(),
			Title:       "Avengers: Endgame",
			Description: "Los Vengadores se reúnen una vez más para deshacer las acciones de Thanos y restaurar el equilibrio del universo.",
			PosterImage: "https://example.com/avengers-endgame.jpg",
			Genre:       "Acción",
			Duration:    181,
			Rating:      "PG-13",
			ReleaseDate: "2019-04-26",
			Director:    "Anthony Russo, Joe Russo",
			Cast:        []string{"Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"},
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          primitive.NewObjectID(),
			Title:       "The Batman",
			Description: "En su segundo año luchando contra el crimen, Batman desentraña la corrupción en Gotham City.",
			PosterImage: "https://example.com/the-batman.jpg",
			Genre:       "Acción",
			Duration:    176,
			Rating:      "PG-13",
			ReleaseDate: "2022-03-04",
			Director:    "Matt Reeves",
			Cast:        []string{"Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Jeffrey Wright"},
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ID:          primitive.NewObjectID(),
			Title:       "Spider-Man: No Way Home",
			Description: "Peter Parker busca la ayuda del Doctor Strange cuando su identidad secreta es revelada.",
			PosterImage: "https://example.com/spiderman-no-way-home.jpg",
			Genre:       "Acción",
			Duration:    148,
			Rating:      "PG-13",
			ReleaseDate: "2021-12-17",
			Director:    "Jon Watts",
			Cast:        []string{"Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon"},
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	// Insertar datos de ejemplo
	for _, movie := range sampleMovies {
		_, err := r.collection.InsertOne(ctx, movie)
		if err != nil {
			return fmt.Errorf("failed to insert sample movie: %w", err)
		}
	}

	return nil
}

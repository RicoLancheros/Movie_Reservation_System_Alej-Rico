import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import type { Movie } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useMovieStore } from '../store/movieStore';

interface MovieFormData {
  title: string;
  description: string;
  posterImage: string;
  genre: string;
  duration: string;
  rating: string;
  releaseDate: string;
  director: string;
  cast: string;
}

const emptyFormData: MovieFormData = {
  title: '',
  description: '',
  posterImage: '',
  genre: '',
  duration: '',
  rating: '',
  releaseDate: '',
  director: '',
  cast: ''
};

export function AdminDashboard() {
  const { movies, isLoading, error, fetchMovies } = useMovieStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<MovieFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Cargar películas del backend al montar el componente
    fetchMovies();
  }, [fetchMovies]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const movieData = {
        title: formData.title,
        description: formData.description,
        posterImage: formData.posterImage || 'https://via.placeholder.com/300x450?text=No+Image',
        genre: formData.genre,
        duration: parseInt(formData.duration),
        rating: formData.rating,
        releaseDate: formData.releaseDate,
        director: formData.director,
        cast: formData.cast.split(',').map(actor => actor.trim()).filter(actor => actor)
      };

      const url = editingMovie 
        ? `http://localhost:8082/api/movies/${editingMovie.id}`
        : 'http://localhost:8082/api/movies';
      
      const method = editingMovie ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la película');
      }

      // Recargar las películas del backend
      await fetchMovies();
      handleCloseModal();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la película');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      posterImage: movie.posterImage,
      genre: movie.genre,
      duration: movie.duration.toString(),
      rating: movie.rating,
      releaseDate: movie.releaseDate,
      director: movie.director,
      cast: movie.cast.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (movieId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      try {
        const response = await fetch(`http://localhost:8082/api/movies/${movieId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la película');
        }

        // Recargar las películas del backend
        await fetchMovies();
        
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la película');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
    setFormData(emptyFormData);
  };

  const handleAddNew = () => {
    setEditingMovie(null);
    setFormData(emptyFormData);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando películas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error al cargar las películas: {error}</p>
            <Button onClick={fetchMovies}>Reintentar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Película
        </Button>
      </div>

      {/* Movies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Película
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clasificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-12">
                        <img
                          className="h-16 w-12 object-cover rounded"
                          src={movie.posterImage}
                          alt={movie.title}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                        <div className="text-sm text-gray-500">{movie.director}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {movie.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movie.duration} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movie.rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(movie)}
                      className="mr-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(movie.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay películas registradas</p>
            <Button onClick={handleAddNew} className="mt-4">
              Agregar Primera Película
            </Button>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Movie */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingMovie ? 'Editar Película' : 'Agregar Película'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Título de la película"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar género</option>
                <option value="Acción">Acción</option>
                <option value="Animación">Animación</option>
                <option value="Aventura">Aventura</option>
                <option value="Ciencia Ficción">Ciencia Ficción</option>
                <option value="Comedia">Comedia</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Romance">Romance</option>
                <option value="Suspenso">Suspenso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos) *
              </label>
              <Input
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                required
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clasificación *
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar clasificación</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Estreno *
              </label>
              <Input
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Director *
              </label>
              <Input
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                required
                placeholder="Nombre del director"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la Imagen del Póster
            </label>
            <Input
              name="posterImage"
              value={formData.posterImage}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reparto
            </label>
            <Input
              name="cast"
              value={formData.cast}
              onChange={handleInputChange}
              placeholder="Actor 1, Actor 2, Actor 3..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la película..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Guardando...' : editingMovie ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 
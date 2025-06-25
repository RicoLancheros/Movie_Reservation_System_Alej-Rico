import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import type { Movie } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

// Simulamos un store global para las películas
const getMoviesFromStorage = (): Movie[] => {
  const stored = localStorage.getItem('movies');
  if (stored) {
    return JSON.parse(stored);
  }
  // Películas por defecto
  return [
    {
      id: '1',
      title: 'Avengers: Endgame',
      description: 'Los Vengadores se reúnen una vez más para enfrentar a Thanos y salvar el universo.',
      posterImage: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      genre: 'Acción',
      duration: 181,
      rating: 'PG-13',
      releaseDate: '2019-04-26',
      director: 'Anthony Russo, Joe Russo',
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo']
    },
    {
      id: '2',
      title: 'The Batman',
      description: 'Batman se aventura en las calles de Gotham mientras persigue al Acertijo.',
      posterImage: 'https://image.tmdb.org/t/p/w500/b0PlHJr0f9g7Sv3dCZzKj6OKLa8.jpg',
      genre: 'Acción',
      duration: 176,
      rating: 'PG-13',
      releaseDate: '2022-03-04',
      director: 'Matt Reeves',
      cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano']
    },
    {
      id: '3',
      title: 'Dune',
      description: 'En un futuro lejano, el joven Paul Atreides debe navegar por un mundo peligroso.',
      posterImage: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
      genre: 'Ciencia Ficción',
      duration: 155,
      rating: 'PG-13',
      releaseDate: '2021-10-22',
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac']
    },
    {
      id: '4',
      title: 'Spider-Man: No Way Home',
      description: 'Peter Parker busca la ayuda del Doctor Strange cuando su identidad es revelada.',
      posterImage: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      genre: 'Acción',
      duration: 148,
      rating: 'PG-13',
      releaseDate: '2021-12-17',
      director: 'Jon Watts',
      cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch']
    }
  ];
};

const saveMoviesToStorage = (movies: Movie[]) => {
  localStorage.setItem('movies', JSON.stringify(movies));
  // Disparar un evento personalizado para notificar a otros componentes
  window.dispatchEvent(new CustomEvent('moviesUpdated', { detail: movies }));
};

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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<MovieFormData>(emptyFormData);

  useEffect(() => {
    const loadedMovies = getMoviesFromStorage();
    setMovies(loadedMovies);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const movieData: Movie = {
      id: editingMovie?.id || Date.now().toString(),
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

    let updatedMovies;
    if (editingMovie) {
      updatedMovies = movies.map(movie => 
        movie.id === editingMovie.id ? movieData : movie
      );
    } else {
      updatedMovies = [...movies, movieData];
    }

    setMovies(updatedMovies);
    saveMoviesToStorage(updatedMovies);
    handleCloseModal();
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

  const handleDelete = (movieId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      const updatedMovies = movies.filter(movie => movie.id !== movieId);
      setMovies(updatedMovies);
      saveMoviesToStorage(updatedMovies);
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
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-16 w-12 object-cover rounded"
                        src={movie.posterImage}
                        alt={movie.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                        <div className="text-sm text-gray-500">{movie.director}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {movie.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movie.duration} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movie.rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar/editar película */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMovie ? 'Editar Película' : 'Agregar Nueva Película'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Nombre de la película"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Descripción de la película"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL del Póster</label>
            <Input
              name="posterImage"
              value={formData.posterImage}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/poster.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Género</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar género</option>
                <option value="Acción">Acción</option>
                <option value="Aventura">Aventura</option>
                <option value="Comedia">Comedia</option>
                <option value="Drama">Drama</option>
                <option value="Terror">Terror</option>
                <option value="Ciencia Ficción">Ciencia Ficción</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Animación">Animación</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duración (minutos)</label>
              <Input
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                required
                placeholder="120"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar rating</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Estreno</label>
              <Input
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Director</label>
            <Input
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              required
              placeholder="Nombre del director"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reparto (separado por comas)</label>
            <Input
              name="cast"
              value={formData.cast}
              onChange={handleInputChange}
              placeholder="Actor 1, Actor 2, Actor 3"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {editingMovie ? 'Actualizar' : 'Crear'} Película
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 
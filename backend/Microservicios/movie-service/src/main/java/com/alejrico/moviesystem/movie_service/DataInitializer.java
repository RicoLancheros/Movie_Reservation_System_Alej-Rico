package com.alejrico.moviesystem.movie_service;

import com.alejrico.moviesystem.movie_service.model.Movie;
import com.alejrico.moviesystem.movie_service.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final MovieRepository movieRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (movieRepository.count() == 0) {
            initializeMovies();
        }
    }
    
    private void initializeMovies() {
        List<Movie> movies = Arrays.asList(
                new Movie(null, "Avatar: El Camino del Agua", 
                        "Jake Sully vive con su nueva familia formada en el planeta de Pandora. Una vez que una amenaza familiar regresa para terminar lo que se empezó anteriormente, Jake debe trabajar con Neytiri y el ejército de la raza Na'vi para proteger su planeta.",
                        "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
                        "Acción", 192, "PG-13", "2022-12-16", "James Cameron",
                        Arrays.asList("Sam Worthington", "Zoe Saldana", "Sigourney Weaver")),
                
                new Movie(null, "Top Gun: Maverick",
                        "Después de más de 30 años de servicio como uno de los mejores aviadores de la Armada, Pete 'Maverick' Mitchell se encuentra donde pertenece, empujando los límites como piloto de pruebas valiente y evitando el ascenso de rango que lo pondría en tierra.",
                        "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
                        "Acción", 130, "PG-13", "2022-05-27", "Joseph Kosinski",
                        Arrays.asList("Tom Cruise", "Miles Teller", "Jennifer Connelly")),
                
                new Movie(null, "Black Panther: Wakanda Forever",
                        "La reina Ramonda, Shuri, M'Baku, Okoye y las Dora Milaje luchan para proteger su nación de las potencias mundiales que intervienen tras la muerte del rey T'Challa.",
                        "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
                        "Acción", 161, "PG-13", "2022-11-11", "Ryan Coogler",
                        Arrays.asList("Letitia Wright", "Angela Bassett", "Tenoch Huerta")),
                
                new Movie(null, "Spider-Man: No Way Home",
                        "Con la identidad de Spider-Man ahora revelada, Peter le pide ayuda al Doctor Strange. Cuando un hechizo sale mal, enemigos peligrosos de otros mundos comienzan a aparecer, forzando a Peter a descubrir lo que realmente significa ser Spider-Man.",
                        "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
                        "Acción", 148, "PG-13", "2021-12-17", "Jon Watts",
                        Arrays.asList("Tom Holland", "Zendaya", "Benedict Cumberbatch")),
                
                new Movie(null, "Dune",
                        "Paul Atreides, un joven brillante y talentoso nacido con un gran destino más allá de su comprensión, debe viajar al planeta más peligroso del universo para asegurar el futuro de su familia y su pueblo.",
                        "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
                        "Ciencia Ficción", 155, "PG-13", "2021-10-22", "Denis Villeneuve",
                        Arrays.asList("Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac")),
                
                new Movie(null, "The Batman",
                        "En su segundo año luchando contra el crimen, Batman descubre la corrupción en Gotham City que se conecta con su propia familia mientras se enfrenta a un asesino en serie conocido como el Acertijo.",
                        "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
                        "Acción", 176, "PG-13", "2022-03-04", "Matt Reeves",
                        Arrays.asList("Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright")),
                
                new Movie(null, "Encanto",
                        "La historia de una familia extraordinaria, los Madrigal, que viven escondidos en las montañas de Colombia, en una casa mágica, en un pueblo vibrante, en un lugar maravilloso conocido como un Encanto.",
                        "https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg",
                        "Animación", 102, "PG", "2021-11-24", "Jared Bush",
                        Arrays.asList("Stephanie Beatriz", "María Cecilia Botero", "John Leguizamo")),
                
                new Movie(null, "No Time to Die",
                        "James Bond se ha retirado del servicio activo. Su paz se ve interrumpida cuando Felix Leiter, un viejo amigo de la CIA, aparece pidiendo ayuda, llevando a Bond tras la pista de un villano misterioso armado con una nueva tecnología peligrosa.",
                        "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
                        "Acción", 163, "PG-13", "2021-10-08", "Cary Joji Fukunaga",
                        Arrays.asList("Daniel Craig", "Rami Malek", "Léa Seydoux")),
                
                new Movie(null, "Minions: The Rise of Gru",
                        "En los años 70, Gru crece en los suburbios siendo un gran fan de un supergrupo de villanos conocido como Vicious 6. Cuando Vicious 6 expulsa a su líder, el legendario luchador Wild Knuckles, Gru se entrevista para convertirse en su nuevo miembro.",
                        "https://image.tmdb.org/t/p/w500/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg",
                        "Animación", 87, "PG", "2022-07-01", "Kyle Balda",
                        Arrays.asList("Steve Carell", "Pierre Coffin", "Alan Arkin")),
                
                new Movie(null, "Doctor Strange in the Multiverse of Madness",
                        "El Dr. Stephen Strange continúa su investigación sobre la Gema del Tiempo. Pero un viejo amigo que se ha convertido en enemigo pone fin a sus planes y hace que Strange desate un mal indescriptible.",
                        "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
                        "Acción", 126, "PG-13", "2022-05-06", "Sam Raimi",
                        Arrays.asList("Benedict Cumberbatch", "Elizabeth Olsen", "Chiwetel Ejiofor"))
        );
        
        movieRepository.saveAll(movies);
        System.out.println("Datos de películas inicializados correctamente!");
    }
} 
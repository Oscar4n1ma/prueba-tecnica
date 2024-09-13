import "./app.css";
import { useState } from "react";
import db from "../books.json";
import { useEffect } from "react";

/*
EL ARCHIVO books.json LO USO PARA CARGAR LOS LIBROS EN EL LOCALSTORAGE LA PRIMERA VEZ EN CASO DE QUE NO ESTEN GUARDADOS 
EN EL LOCALSTORAGE ESTO PARA PODER SINCRONIZAR LOS LIBROS TOMADOS Y DISPONIBLES,
 POR LO CUAL LA BASE DE DATOS SIMULADA NO ES books.json SINO EL LOCALSTORAGE
*/

export default function App() {
  const [books, setBooks] = useState([]);
  const [booksSelected, setBooksSelected] = useState([]);
  const [genres, setGenres] = useState([]);


  // ESTA FUNCION FILTRA LOS GENEROS SEGUN LOS GENEROS ACTUALES DE LOS LIBROS DE ARCHIVO books.json
  const filterByGenre = (genre) => {
    const currentBooks = JSON.parse(
      window.localStorage.getItem("current-books")
    );
    const selectedBooks = JSON.parse(
      window.localStorage.getItem("to-read")
    );
    if (genre === "Todos") {
      setBooks(currentBooks ?? []);
      setBooksSelected(selectedBooks ?? []);
    } else {
      setBooks(currentBooks.filter((b) => b.genre === genre));
      setBooksSelected(selectedBooks.filter((b) => b.genre === genre));
    }
  };

  // ESTA FUNCION TOMA UN NUMERO Y FILTRA LOS LIBROS QUE TENGAN UN NUMERO DE PAGINAS INFERIOR O IGUAL AL INGRESADO
  const filterByNumberPages = (pages) => {
    const currentBooks = JSON.parse(
      window.localStorage.getItem("current-books")
    );

    // VALIDO QUE SEA UN NUMERO
    if (pages === '') {
      alert('Porfavor ingresa un numero')
    }
    else {
      setBooks(currentBooks.filter((b) => b.pages <= Number(pages)));
    }

  };

  // ESTA FUNCION SIRVE PARA OBTENER UN LIBRO DE LOS LIBROS DISPONIBLES, GUARDARLO EN LA LISTA DE LECTURA Y EN EL LOCALSTORAGE
  const setBookListSelected = (book) => {
    const currentBooks = JSON.parse(
      window.localStorage.getItem("current-books")
    );
    setBooksSelected([...booksSelected, book]);
    setBooks([...currentBooks.filter((b) => b.ISBN !== book.ISBN)]);

    window.localStorage.setItem(
      "to-read",
      JSON.stringify([...booksSelected, book])
    );
    window.localStorage.setItem(
      "current-books",
      JSON.stringify([...currentBooks.filter((b) => b.ISBN !== book.ISBN)])
    );
  };

  // ESTA FUNCION SIRVE PARA OBTENER UN LIBRO DE LA LISTA DE LECTURA, GUARDARLO EN LIBROS DISPONIBLES Y EN EL LOCALSTORAGE
  const setBookFromListSelected = (book) => {
    const currentBooks = JSON.parse(
      window.localStorage.getItem("current-books")
    );
    setBooksSelected([...booksSelected.filter((b) => b.ISBN !== book.ISBN)]);
    setBooks([...currentBooks, book]);

    window.localStorage.setItem(
      "to-read",
      JSON.stringify([...booksSelected.filter((b) => b.ISBN !== book.ISBN)])
    );
    window.localStorage.setItem(
      "current-books",
      JSON.stringify([...currentBooks, book])
    );
  };

  // ESTA FUNCION VERIFICA LO MODIFICADO EN EL STORAGE Y LO GUARDA EN LOS ESTADOS
  const handleStorageChange = (e) => {
    if (e.key === "to-read") {
      setBooksSelected(JSON.parse(e.newValue));
    }
    if (e.key === "current-books") {
      setBooks(JSON.parse(e.newValue));
    }
  };

  // ESTA FUNCION HACE LA LISTA DE GENEROS CONTENIDA EN LA LISTA DE LIBROS
  useEffect(() => {
    const g = [];
    for (let i = 0; i < db.library.length; i++) {
      const genre = db.library[i].book.genre;
      if (!g.includes(genre)) {
        g.push(genre);
      }
    }
    setGenres(["Todos", ...g]);

    // ALMACENO EN EL LOCAL STORAGE LOS LIBROS EN LA LISTA DE LECTURA
    const saveBooks = window.localStorage.getItem("to-read");

    // ALMACENO EN EL LOCAL STORAGE LOS LIBROS ACTUALES DISPONIBLES
    const currentBooks = window.localStorage.getItem("current-books");

    if (saveBooks) {
      setBooksSelected(JSON.parse(saveBooks));
    }
    if (currentBooks) {
      setBooks(JSON.parse(currentBooks));
    } else {
      const booksMapper = db.library.map((b) => b.book);
      window.localStorage.setItem("current-books", JSON.stringify(booksMapper));
      setBooks(booksMapper);
    }


    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  return (
    <div className="container-main">
      <div className="container-books">
        <div className="menu">
          <p className="text-book-available">
            Libros disponibles {books.length}
          </p>
          <input className="search-by-page"

            // ESTA FUNCION PERMITE APLICAR EL FILTRO POR NUMERO DE PAGINAS UNA VEZ PRESIONADA LA TECLA ENTER
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                filterByNumberPages(e.target.value);
              }
            }}
            type="number"
            placeholder="Filtrar por paginas"
          />



          <div className="list-genre" onClick={() => {

            /* OBTENGO LA LISTA DE GENEROS Y VERIFICO SI ESTA EN PANTALLA O NO
              EN  CASO DE QUE NO ESTE LO MUESTRA Y EN CASO DE QUE YA ESTE LO OCULTA
            */
            const element = document.getElementById('list-items-genre')
            element.style.display = element.style.display === 'none' ? 'flex': 'none'
          }}>
            Generos
            <ul id="list-items-genre">
            {genres.map((g, i) => (
                <li
                  onClick={(e) => {
                    filterByGenre(g);
                  }}
                  key={i}
                >
                  {g}
                </li>
              ))}
            </ul>

          </div>
        </div>
        <div

          // CONTENEDOR DE LIROS ACTUALES DISPONIBLES
          className="current-library"

          // ESTA FUNCION PERMITE DEJAR DE ARRASTRAR SOBRE EL CONTENEDOR PARA ALMACENARLO NUEVAMENTE EN LIBROS DISPONIBLES
          onDrop={(e) => {
            e.preventDefault();
            setBookFromListSelected(JSON.parse(e.dataTransfer.getData("book")));
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}

        >
          {books.map((b, i) => (
            <div
              key={i}
              className="card-book"

              // ESTA FUNCION PERMITE AGREGAR LIBROS DISPONIBLES A LA LISTA DE LECTURA MEDIANTE UN CLICK (TANTO PARA MOVIL COMO PC)
              onClick={(e) => {
                setBookListSelected(b)
              }}

              // ESTA FUNCION PERMITE EMPEZAR A ARRASTRAR UN LIBRO DESDE EL CONTENEDOR DE LIBROS DISPONIBLES
              onDragStart={(e) => {
                e.dataTransfer.setData("book", JSON.stringify(b));
              }}
            >
              <img className="image-book" src={b.cover} alt="" />

              <div className="text-info-book">
                <p> {b.title}</p>
                <p>{b.author.name}</p>
                <p>{b.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container-selected">
        <p className="text-list">Lista de lectura</p>
        <p className="text-list-inside">
          En la lista de lectura {booksSelected.length}
        </p>
        <div

          //CONTENEDOR DE LIBROS EN LA LISTA DE LECTURA
          className="cards-books card-books-selected"

          //ESTA FUNCION PERMITE DEJAR DE ARRASTRAR SOBRE EL CONTENEDOR PARA ALMACENARLO EN LA LISTA DE LECTURA
          onDrop={(e) => {
            e.preventDefault();
            setBookListSelected(JSON.parse(e.dataTransfer.getData("book")));
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          {booksSelected.map((b, i) => (
            <div
              key={i}
              className="card-book"
              draggable

              //ESTA FUNCION PERMITE QUITAR UN LIBRO QUE ESTE EN LA LISTA DE LECTURA MEDIANTE UN CLICK
              onClick={
                (e) => {
                  setBookFromListSelected(b)
                }
              }

              // ESTA FUNCION PERMITE EMPEZAR A ARRASTRAR UN LIBRO DESDE EL CONTENEDOR DE LA LISTA DE LECTURA
              onDragStart={(e) => {
                e.dataTransfer.setData("book", JSON.stringify(b));
              }}
            >
              <img className="image-book" src={b.cover} alt="" />
              <div className="text-info-book">
                <p> {b.title}</p>
                <p>{b.author.name}</p>
                <p>{b.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

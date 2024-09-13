# Prueba tecnica para contento (Gestion de libros)

Aplicación que permite gestionar una biblioteca de libros

## Características principales

1. **Carga inicial de libros**: Cuando inicias la app, los libros se cargan desde `books.json` al `localStorage` si aún no están guardados.

2. **Filtrar libros**:
   - **Por género**: Puedes filtrar los libros disponibles por su género.
   - **Por número de páginas**: También puedes buscar libros que tengan menos o igual cantidad de páginas a la que indiques.

3. **Gestión de libros**:
   - **Agregar a la "Lista de lectura"**: Puedes arrastrar o hacer clic en un libro disponible para moverlo a tu lista de lectura.
   - **Quitar de la "Lista de lectura"**: Los libros que ya no quieras en tu lista de lectura pueden devolverse a los libros disponibles, también con un clic o arrastrando.

4. **Sincronización con `localStorage`**: Todos los cambios en las listas de libros disponibles y de lectura se guardan automáticamente en el `localStorage`, manteniendo la app siempre actualizada entre pestañas.

## Cómo usarla

- Filtra los libros por género o por número de páginas.
- Arrastra o haz clic en un libro para agregarlo o quitarlo de la lista de lectura.

## Instalación

1. clonar repositorio con `git clone https://github.com/Oscar4n1ma/prueba-tecnica.git`.
2. Instala las dependencias con `npm install`.
3. Ejecuta la aplicación con `npm run dev`.
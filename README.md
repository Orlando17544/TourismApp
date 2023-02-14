# App Turismo - Hackademy

React Native application to help users interested in traveling to satisfy their needs during their stay in the place where they are, facilitating the search for restaurants, hotels, museums, theaters, etc.

## Description

Create an application to visualize different touristic destinations. The user can search for information about different places like restaurants, hotels, museums, theaters, etc. The user can also contact the places using WhatsApp, phone, .
The user can obtain relevant information such as schedules, contact, qualification, and prices.

### Features

1. The app has 227 songs from 16 artists (Ariana Grande, Daft Punk, Eminem, Jimi Hendrix, John Lennon, Led Zeppelin, Luis Fonsi, Michael Jackson, Nirvana, Pink Floyd, Queen, Taylor Swift, Jimi Hendrix, The plastic Ono Band, The Rolling Stones, Wisin & Yandel)
2. The songs are only samples.
3. Each artist has different number of songs.
4. Each song can be downloaded, listened and deleted by the user.
5. Can be created a playlist to store the songs the user wants.
6. Each song and each playlist can be edited.
7. Each song can be played, stopped or changed by another one.

## Preview

<img src="https://github.com/Orlando17544/Portfolio/blob/main/src/assets/musicPlayer.gif" alt="Simplefolio" width="900px" />

## Stack

- Android SDK
- Kotlin
- Architecture components (ViewModel and LiveData)
- Room (SQLite)
- RecyclerView
- Retrofit
- MediaPlayer
- Google Cloud Storage

## Install

Just download the app on this [url](https://github.com/Orlando17544/Portfolio/raw/main/musicPlayer.apk) and install it in an android phone.

---

### If you want to run the project in a computer with Android Studio, you should follow this steps:

1. Clone the project
```
git clone https://github.com/Orlando17544/MusicPlayer.git
```

2. Start Android Studio

3. Open the project

4. Start the app

# **App Turismo - Hackademy**

## General

-   El cliente mencionó como referencia la Plataforma de Chihuahua Capital, Página Oficial.

-   Cada lugar deberá tener un "tour digital" donde el usuario podrá navegar en 3D (ejemplo: google street view)

-   Cada categoría (Sitios culturales, Gastronomía, Recreación, etc.) tendrá una lista de sub categorías (Restaurantes, cafeterías, etc.) donde se encontrarán las localizaciones.

## _**Entregables (03/02/2020)**_

-   Implementar la activación del gps y seleccionar la ciudad más cercana de acuerdo a la ubicación. (En pantalla de "ubicacion o ciudad")

-   Funcionalidad de ordenar los destinos por reputación (En pantalla de destinos turísticos destacados)

-   Implementar la funcionalidad en el mapa de mostrar destinos turísticos con diferentes iconos según su subcategoría y mostrar la actual ubicación del usuario. (En pantalla de mapa)

-   Verificar que el usuario reservo en el destino turístico antes de permitirle calificar al destino turístico. (En pantalla de review)

## Pendientes

-   Van a haber categorías y subcategorías para los destinos turísticos.
-   Cada destino turístico en su pantalla tiene que tener esta información:

    -   Imágen (o imágenes) del destino turístico
    -   Nombre del destino turístico
    -   Subcategoría del destino turístico
    -   Estado del destino turístico (Abierto/Cerrado)
    -   Precio del destino turístico
    -   Ranking (Puntuación)
    -   Horario
    -   Precios
    -   Servicios
        -   Contacto:
            -   Botón para llamar al destino turístico
            -   Botón para visitar el sitio web
            -   Botón para hacer un tour en línea con Google StreetView
        -   Botón para enviar un mensaje por WhatsApp al destino turístico
        -   Botón para hacer una reservación en línea con OpenTable

-   El usuario va a tener que hacer login
-   El usuario no puede añadir destinos turísticos, es el administrador el único que los puede añadir.
-   Las noticias (también llamadas promociones) serán implementadas como notificaciones push.
-   Se podrá compartir una noticia (también llamada evento) por redes sociales.

## Información importante

-   [Diseño anterior](https://drive.google.com/drive/folders/1FR4rS1hqF70ah5zAZNhCJgb4U80jhvEz)

-   [Historias de usuario](https://docs.google.com/spreadsheets/d/1Yu3K4S_1CE_w4ja2yqMxrcnMazLbR5_noL9SVxWIiFo/edit#gid=1607209987)

## Preview

<img src="https://github.com/Orlando17544/Portfolio/blob/main/src/assets/tourismApp.gif" alt="Simplefolio" width="900px" />

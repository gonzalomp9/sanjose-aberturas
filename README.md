# San José Aberturas

Sitio de San José Aberturas, distribuidores de puertas, ventanas y portones de
aluminio y PVC en Buenos Aires.

Proyecto final del curso. Hecho con HTML, SASS y Bootstrap.

## Carpetas

- `index.html` - la home (es la unica que va en la raiz)
- `pages/` - las otras 4 paginas: menu, galeria, nosotros y contacto
- `sass/` - todos los estilos en scss, separados en carpetas
- `styles/style.css` - lo que sale de compilar el sass (no tocar a mano)
- `assets/` - imagenes y logos

Dentro de `sass/` estan:
- `utilities/` - variables, mixins y el reset
- `components/` - header, footer, botones y tarjetas
- `pages/` - un archivo por cada pagina

## Como compilar el sass

Instalar sass una vez:

```
npm install -g sass
```

Y despues, mientras trabajo, dejo esto corriendo asi se actualiza solo:

```
sass --watch sass/main.scss styles/style.css
```

## Cosas para acordarme

- El formulario de contacto usa Formspree. Hay que poner el ID real donde dice
  `TU-ID-DE-FORMSPREE` en `pages/contacto.html`, sino no manda nada.
- Facebook, X y YouTube estan comentados en el footer. Cuando tenga esas redes,
  descomento el bloque.
- Las imagenes son SVG por ahora. Cuando tenga fotos reales las cambio, dejando
  el mismo nombre de archivo asi no toco el html.
- Antes de subir, cambiar el dominio de ejemplo por el real (esta en los meta y en
  el sitemap).

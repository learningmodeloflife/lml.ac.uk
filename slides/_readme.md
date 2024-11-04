# Building

Keep images in the root '/img' directory - they can be used in other parts of the site. 
Use quarto render <file> to build.
Always build from the website root '/' directory.
The build calls a script to make quarto share the same libraries for every page. Don't change this.
If you are running a local web server, eg. with 'bundle exec jekyll build' or 'python3 -m http.server' then make sure you do it from the website root directory '/'.


# SHORTCUTS

M - show menu
F - fullscreen
O - overview
S - speaker view
E - print view
N, rightarrow, space - next slide
P, leftarrow - next slide
esc - exit fullscreen
alt-rightarrow - navigate without fragments
alt-leftarrow - navigate without fragments
SHIFT-rightarrow - jump to end
SHIFT-leftarrow - jump to beginning
Alt - zoom on click

# Notes canvas and chalkboard SHORTCUTS

C - Toggle notes canvas
B - Toggle chalkboard
E - Reset all drawings  BACKSPAC
L - Clear drawings on slide DE
X - Cycle colors forward
Y - Cycle colors backward
D - Download drawings

# Custom SHORTCUTS

G -
H -
J -
K -

# Trigger javascript in slide

From nasa.qmd

```html

<script>
Reveal.on( 'fragmentshown', event => {
  if(event.fragment.id === 'astro1'){
    show_astronauts();
    console.log("fraggle_shown");
  }
} );
Reveal.on( 'fragmenthidden', event => {
  if(event.fragment.id === 'astro1'){
    hide_astronauts();
    console.log("fraggle_hidden");
  }
} );
</script>

```


# Embed d3 in slide

See _includes/central_dogma.qmd













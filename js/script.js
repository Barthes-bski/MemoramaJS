class Memorama {

    constructor() {
        this.totalTarjetas = [];
        this.numeroTarjetas = 0;
        this.verificarTarjetas = [];
        this.errores = 0;
        this.imagenesCorrectas = [];
        this.agregarTarjetas = [];
        this.numIntentos = 0;
        this.nivelDificultad = '';

        this.$contenedorGeneral = document.querySelector('.contenedor-general');
        this.$contenedorTarjetas = document.querySelector('.contenedor-tarjetas');
        this.$pantallaBloqueada = document.querySelector('.pantalla-bloqueada');
        this.$mensaje = document.querySelector('h2.mensaje');
        this.$errorContenedor = document.createElement('div');
        this.$nivelDificultad = document.createElement('div');
        this.eventListener();

    }

    eventListener() {
        window.addEventListener('DOMContentLoaded', () => {
            this.seleccionarDificultad();
            this.cargarPantalla()
            // window.addEventListener('contextmenu', e => {
            //     e.preventDefault();
            // }, false);
        })
    }


    seleccionarDificultad() {
        const mensaje = prompt('Selecciona el nivel de dificultad (fácil, intermedio o difícil). El nivel intermedio es el predeterminado')
        if (!mensaje) {
            this.numIntentos = 5;
            this.nivelDificultad = 'Intermedio';
        } else {
            if (mensaje.toLocaleLowerCase() === 'facil' || mensaje.toLocaleLowerCase === 'fácil') {
                this.numIntentos = 7;
                this.nivelDificultad = 'Fácil';
            } else if (mensaje.toLocaleLowerCase() === 'intermedio') {
                this.numIntentos = 5;
                this.nivelDificultad = 'Intermedio';
            } else if (mensaje.toLocaleLowerCase() === 'dificil' || mensaje.toLocaleLowerCase === 'difícil') {
                this.numIntentos = 3;
                this.nivelDificultad = 'Difícil';
            } else {
                this.numIntentos = 5;
                this.nivelDificultad = 'Intermedio';
            }
        }
        this.contenedorError();
        this.mensajeIntentos();
    }

    async cargarPantalla() {
        const rspt = await fetch('../memo.json');
        const data = await rspt.json();
        this.totalTarjetas = data;
        if (this.totalTarjetas.length > 0) {
            this.totalTarjetas.sort(orden);
            function orden(a, b) {
                return Math.random() - 0.5;
            }
        }

        this.numeroTarjetas = this.totalTarjetas.length;

        let html = '';
        this.totalTarjetas.forEach(card => {
            html += `<div class="tarjeta">
                        <img class="tarjeta-img" src="${card.src}" alt="imagen memorama">
                    </div>`
        })

        this.$contenedorTarjetas.innerHTML = html;
        this.comienzaJuego();
        this.contenedorError();
    }

    comienzaJuego() {
        const tarjetas = document.querySelectorAll('.tarjeta')
        tarjetas.forEach(tarjeta => {
            tarjeta.addEventListener('click', e => {
                if (!e.target.classList.contains('acertada') && !e.target.classList.contains('tarjeta-img')) {
                    this.clickTarjeta(e)
                }

            })
        })
    }

    clickTarjeta(e) {
        this.fxVoltearTarjeta(e);
        let sourceImage = e.target.childNodes[1].attributes[1].value;
        this.verificarTarjetas.push(sourceImage);
        let tarjeta = e.target;
        this.agregarTarjetas.unshift(tarjeta);
        this.comparadorTarjetas();
    }

    fxVoltearTarjeta(e) {
        e.target.style.backgroundImage = "none";
        e.target.style.backgroundColor = "white";
        e.target.childNodes[1].style.display = "block";
    }

    fxReverso(arrTarjetas) {
        arrTarjetas.forEach(tarjeta => {
            setTimeout(() => {
                tarjeta.style.backgroundImage = 'url(../img/cover.jpg)';
                tarjeta.childNodes[1].style.display = 'none';
            }, 1000);
        })
    }

    comparadorTarjetas() {
        if (this.verificarTarjetas.length == 2) {
            if (this.verificarTarjetas[0] === this.verificarTarjetas[1]) {
                this.parAcertado(this.agregarTarjetas);
            } else {
                this.fxReverso(this.agregarTarjetas);
                this.errores++;
                this.incrementaError();
                this.derrotaJuego();
            }

            this.verificarTarjetas.splice(0);
            this.agregarTarjetas.splice(0);
        }
    }

    parAcertado(arrTarjetasAcertadas) {
        arrTarjetasAcertadas.forEach(tarjeta => {
            tarjeta.classList.add('acertada');
            this.imagenesCorrectas.push(tarjeta);
            this.victoriaJuego();
        })
    }

    victoriaJuego() {
        if (this.imagenesCorrectas.length == this.numeroTarjetas) {
            setTimeout(() => {
                this.$pantallaBloqueada.style.display = 'block';
                this.$mensaje.innerText = '¡Felicidades! Has ganado el juego';
            }, 1000);
            setTimeout(() => {
                location.reload();
            }, 4000)
        }
    }

    derrotaJuego() {
        if (this.errores === this.numIntentos) {
            setTimeout(() => {
                this.$pantallaBloqueada.style.display = 'block';
                this.$mensaje.innerText = '¡Haz perdido! Intentalo nuevamente';
            }, 2000)
            setTimeout(() => {
                location.reload();
            }, 5000)
        }
    }

    incrementaError() {
        this.$errorContenedor.innerText = `Errores: ${this.errores}`;
    }

    contenedorError() {
        this.$errorContenedor.classList.add('error');
        this.incrementaError();
        this.$contenedorGeneral.appendChild(this.$errorContenedor);
    }

    mensajeIntentos() {
        this.$nivelDificultad.classList.add('nivel-dificultad');
        this.$nivelDificultad.innerHTML = `Nivel de Dificultad: ${this.nivelDificultad}`;
        this.$contenedorGeneral.appendChild(this.$nivelDificultad);
    }


}



new Memorama();

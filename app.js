"use strict";
const canvas = document.createElement("canvas");
// criando elemento canvas

const ctx = canvas.getContext("2d");
// pegando o context do canvas

const screenX = Math.round(innerWidth / 2);
const screenY = Math.round(innerHeight / 2);
// armazenando e arredondando o valor da resolução da tela

let x = screenX;
let y = screenY;
// cordenadas iniciais do sprite (circulo)

let colidiu = false;
// inicializando variável que retorna true caso colidiu
// e false se não colidir

Math.TAU = Math.PI * 2;
// adicionando a propriedade TAU ao objeto Math. TAU = PI * 2;

Object.freeze(Math);
// congelando o objeto Math para torná-lo imutável

const worldSize = 404;
// definindo resolução do world

const inserirEstiloNaPagina = () => {
  const link = document.createElement("link");
  // criando elemento link

  link.rel = "stylesheet";
  link.href = "styles.css";
  // adicionando atributos ao elemento link

  document.head.appendChild(link);
  // adicionando ele ao head
};

const inserirCanvasNaTela = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  // fazendo a largura e a altura ocupar o tamanho da tela

  document.body.appendChild(canvas);
  // inserindo canvas ao body;
};

const quadrado = () => {
  ctx.beginPath();
  // inicializando path do sprite canvas

  ctx.strokeStyle = colidiu ? "#ff0000" : "#ffffff";
  // definindo cor da linha

  ctx.lineWidth = 3;
  // definindo largura da linha

  ctx.rect(
    canvas.width / 2 - worldSize,
    canvas.height / 2 - worldSize,
    worldSize * 2,
    worldSize * 2
  );
  // aqui é feito um cálculo para que o quadrado cresça no
  // centro da tela proporcionalmente

  ctx.stroke();
  // desenhando a linha

  requestAnimationFrame(quadrado);
  // renderizando frames
};

const circulo = () => {
  const sizeCircle = 100;
  // definindo raio do circulo

  ctx.beginPath();
  // inicializando path do sprite canvas

  ctx.strokeStyle = colidiu ? "#ffff00" : "#000000";

  ctx.clearRect(x - sizeCircle, y - sizeCircle, sizeCircle * 2, sizeCircle * 2);
  // área que está sendo limpa a cada frame. A resolução
  // da área é proporcional ao raio do circulo

  ctx.clearRect(
    canvas.width / 2 - worldSize,
    canvas.height / 2 - worldSize,
    worldSize * 2,
    worldSize * 2
  );
  // a cada frame, ele deve limpar a sena anterior. Para que isso seja
  // proporcional ao raio do circulo, é feito este calculo.

  ctx.fillStyle = "#00ff00";

  ctx.strokeRect(
    x - sizeCircle,
    y - sizeCircle,
    sizeCircle * 2,
    sizeCircle * 2
  );
  // definindo do cor sprite

  ctx.arc(x, y, sizeCircle, 0, Math.TAU);
  // definindo as cordenadas e raio do circulo

  ctx.fill();

  requestAnimationFrame(circulo);
  // renderizando frames
};

const movimentarCirculo = {
  alertarColisao() {
    const verificarSeColidiu =
      this.verificarSeColidiu.x1 ||
      this.verificarSeColidiu.x2 ||
      this.verificarSeColidiu.y1 ||
      this.verificarSeColidiu.y2;
    return verificarSeColidiu;
    // irá retornar true se houver colisão e
    // false se não houver colisão
  },
  ArrowUp() {
    this.verificarSeColidiu.x1 ? y : (y -= this.velocidade);
    /*
     * se o valor de y for igual ao (tamanho do world - 105) - 1,
     * significa que colidiu. Se colidir, o valor permanece,
     * se não, pode ser decrementado
     */
  },
  ArrowRight() {
    this.verificarSeColidiu.x2 ? x : (x += this.velocidade);
    /*
     * se o valor de x for igual ao (tamanho do world - 105),
     * significa que colidiu. Se colidir, o valor permanece,
     * se não, pode ser incrementado
     */
  },
  ArrowDown() {
    this.verificarSeColidiu.y1 ? y : (y += this.velocidade);
    /*
     * se o valor de y for igual ao (tamanho do world - 105),
     * significa que colidiu. Se colidiu, o valor permanece,
     * se não, pode ser incrementado
     */
  },
  ArrowLeft() {
    this.verificarSeColidiu.y2 ? x : (x -= this.velocidade);
    /*
     * se o valor de x for igual ao (tamanho do world - 105) - 1,
     * significa que colidiu. Se colidiu, o valor permanece,
     * se não, pode ser decrementado
     */
  },
  // truque para aplicar colisão

  /*
   * [FÓRMULA PARA MANTER AS COLISÕES PROPORCIONALMENTE AO TAMNHO DO WORLD]
   * tw = tamanho do world
   * tw - 105 -> para subida
   * tw - 105 * -1 -> para descida
   */
};

const mostrarCordenada = () => {
  console.log(
    `Cordenada atual do círculo: x: ${x - screenX} y: ${y - screenY}`
  );
};

const desenharNoCanvas = () => {
  quadrado();
  circulo();
  // desenhando sprites na tela

  mostrarCordenada();
  // mostrando cordenada inicial do sprite

  document.onkeydown = ({ code }) => {
    if (movimentarCirculo[code]) {
      // verificando se propriedade existe no objeto movimentarCirculo

      this.velocidade = 5;
      // definindo velocidade do circulo a cada movimento

      this.verificarSeColidiu = {
        x1: y - screenY <= (worldSize - 105) * -1,
        x2: x - screenX >= worldSize - 105,
        y1: y - screenY >= worldSize - 105,
        y2: x - screenX <= (worldSize - 105) * -1,
      };

      const movimentar = movimentarCirculo[code].bind(this);
      const alertarColisao = movimentarCirculo.alertarColisao.call(this);
      // Aplicando Design Pattern para evitar ifs

      colidiu = alertarColisao;
      // atribuindo o valor da função que retorna
      // true caso colidir e false caso não colidir

      mostrarCordenada();
      // chamando função para mostrar cordenada atual
      // do sprite

      movimentar();
      // chamando função para movimentar sprite
    }
  };
};

const init = () => {
  inserirCanvasNaTela();
  inserirEstiloNaPagina();
  desenharNoCanvas();
  // inicializando as funções
};

init();

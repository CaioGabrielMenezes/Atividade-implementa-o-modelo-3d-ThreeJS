# Dodge Charger SRT 3D Experience

Pagina web interativa feita com **HTML**, **CSS**, **JavaScript** e **Three.js** para visualizar um modelo 3D `.glb` de um Dodge Charger SRT em uma cena urbana noturna.

O modelo 3D ja esta incluido no projeto em:

```text
models/dodge-charger-srt.glb
```

## Preview

O projeto apresenta:

- Modelo 3D interativo de um Dodge Charger SRT.
- Controles de rotacao, zoom e movimento com `OrbitControls`.
- Cena com asfalto urbano noturno.
- Painel informativo com cards sobre o veiculo e o projeto.
- Layout responsivo para desktop e telas menores.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Three.js via CDN/importmap
- GLTFLoader
- OrbitControls

## Estrutura do Projeto

```text
.
|-- index.html
|-- style.css
|-- main.js
|-- README.md
`-- models/
    `-- dodge-charger-srt.glb
```

## Como Executar com Live Server

Este projeto deve ser executado em um servidor local, porque ele usa modulos JavaScript e carrega um arquivo `.glb`.

### 1. Instale a extensao Live Server

No Visual Studio Code:

1. Abra a aba **Extensions**.
2. Pesquise por **Live Server**.
3. Instale a extensao **Live Server**.

### 2. Abra o projeto no VS Code

Abra a pasta do projeto no Visual Studio Code.

### 3. Inicie o servidor local

Clique com o botao direito no arquivo `index.html` e selecione:

```text
Open with Live Server
```

O navegador sera aberto automaticamente com um endereco parecido com:

```text
http://127.0.0.1:5500/
```

A porta pode variar. Use sempre o endereco aberto pelo Live Server.

## Controles do Visualizador

- Arraste com o mouse para girar o carro.
- Use o scroll para aproximar ou afastar.
- Use o botao direito do mouse para mover a camera.
- Em dispositivos touch, use gestos de toque para interagir.

## Funcionamento do Projeto

- `index.html`: estrutura a pagina, importa o Three.js por importmap e define o canvas 3D.
- `style.css`: cria o visual grafite noturno, o painel lateral, os cards e o layout responsivo.
- `main.js`: inicializa a cena 3D, camera, renderer, luzes, controles, asfalto, carregamento do modelo e animacao.

## Principais Funcões

- `carregarModeloDodge()`: carrega `./models/dodge-charger-srt.glb` com `GLTFLoader`.
- `prepararModelo(modeloCarro)`: ativa sombras e ajusta texturas do modelo.
- `enquadrarModelo(modeloCarro)`: centraliza e escala o carro na cena.
- `criarChaoUrbano()`: cria o asfalto escuro com textura procedural e faixas discretas.
- `ajustarTamanhoDaCena()`: atualiza camera e renderer quando a janela muda de tamanho.
- `animarCena()`: executa o loop de renderizacao com `requestAnimationFrame`.

## Observação

Evite abrir o `index.html` diretamente pelo navegador usando `file://`. Use o Live Server para garantir que o Three.js e o modelo `.glb` sejam carregados corretamente.

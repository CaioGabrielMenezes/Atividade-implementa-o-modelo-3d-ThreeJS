import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('#canvas-3d');
const mensagemCarregamento = document.querySelector('#mensagem-carregamento');

const cena = new THREE.Scene();
cena.fog = new THREE.Fog(0x06070a, 12, 36);

const dimensoesIniciais = obterDimensoesCanvas();
const camera = new THREE.PerspectiveCamera(
  45,
  dimensoesIniciais.largura / dimensoesIniciais.altura,
  0.1,
  100
);
camera.position.set(5.5, 3.2, 7.5);

const renderizador = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderizador.setSize(dimensoesIniciais.largura, dimensoesIniciais.altura, false);
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
renderizador.outputColorSpace = THREE.SRGBColorSpace;

const controles = new OrbitControls(camera, renderizador.domElement);
controles.enableDamping = true;
controles.dampingFactor = 0.06;
controles.enablePan = true;
controles.enableZoom = true;
controles.minDistance = 3;
controles.maxDistance = 14;
controles.target.set(0, 1, 0);
controles.update();

const luzAmbiente = new THREE.AmbientLight(0xffead8, 1.18);
cena.add(luzAmbiente);

const luzDirecional = new THREE.DirectionalLight(0xfff2df, 2.05);
luzDirecional.position.set(3.5, 7, 4.5);
luzDirecional.castShadow = true;
luzDirecional.shadow.mapSize.set(2048, 2048);
luzDirecional.shadow.camera.near = 0.5;
luzDirecional.shadow.camera.far = 24;
luzDirecional.shadow.camera.left = -8;
luzDirecional.shadow.camera.right = 8;
luzDirecional.shadow.camera.top = 8;
luzDirecional.shadow.camera.bottom = -8;
luzDirecional.shadow.radius = 4;
luzDirecional.shadow.bias = -0.0002;
luzDirecional.shadow.normalBias = 0.025;
cena.add(luzDirecional);

const chao = criarChaoUrbano();
cena.add(chao);

carregarModeloDodge();
window.addEventListener('resize', ajustarTamanhoDaCena);
animarCena();

function criarChaoUrbano() {
  // Monta um piso de asfalto noturno com textura procedural e faixas discretas.
  const grupoChao = new THREE.Group();
  const geometriaAsfalto = new THREE.PlaneGeometry(34, 34);
  const texturaAsfalto = criarTexturaAsfalto();
  const materialAsfalto = new THREE.MeshStandardMaterial({
    color: 0x101216,
    map: texturaAsfalto,
    roughness: 0.86,
    metalness: 0.04
  });
  const asfalto = new THREE.Mesh(geometriaAsfalto, materialAsfalto);

  asfalto.rotation.x = -Math.PI / 2;
  asfalto.receiveShadow = false;
  grupoChao.add(asfalto);

  adicionarFaixasDaPista(grupoChao);

  return grupoChao;
}

function criarTexturaAsfalto() {
  // Gera pequenos pontos claros e escuros para lembrar a granulação do asfalto.
  const tamanhoTextura = 512;
  const canvasTextura = document.createElement('canvas');
  const contexto = canvasTextura.getContext('2d');

  canvasTextura.width = tamanhoTextura;
  canvasTextura.height = tamanhoTextura;
  contexto.fillStyle = '#111318';
  contexto.fillRect(0, 0, tamanhoTextura, tamanhoTextura);

  for (let indice = 0; indice < 8500; indice += 1) {
    const brilho = 22 + Math.random() * 42;
    const opacidade = 0.18 + Math.random() * 0.36;
    contexto.fillStyle = `rgba(${brilho}, ${brilho}, ${brilho + 4}, ${opacidade})`;
    contexto.fillRect(
      Math.random() * tamanhoTextura,
      Math.random() * tamanhoTextura,
      1 + Math.random() * 1.8,
      1 + Math.random() * 1.8
    );
  }

  const texturaAsfalto = new THREE.CanvasTexture(canvasTextura);
  texturaAsfalto.wrapS = THREE.RepeatWrapping;
  texturaAsfalto.wrapT = THREE.RepeatWrapping;
  texturaAsfalto.repeat.set(7, 7);
  texturaAsfalto.colorSpace = THREE.SRGBColorSpace;

  return texturaAsfalto;
}

function adicionarFaixasDaPista(grupoChao) {
  const materialFaixaCentral = new THREE.MeshBasicMaterial({
    color: 0xffb36b,
    transparent: true,
    opacity: 0.38,
    depthWrite: false
  });
  const materialFaixaLateral = new THREE.MeshBasicMaterial({
    color: 0xf0e5d3,
    transparent: true,
    opacity: 0.24,
    depthWrite: false
  });

  for (let z = -14; z <= 14; z += 4) {
    grupoChao.add(criarFaixaPista(0, z, 0.12, 2.2, materialFaixaCentral));
  }

  grupoChao.add(criarFaixaPista(-3.6, 0, 0.08, 30, materialFaixaLateral));
  grupoChao.add(criarFaixaPista(3.6, 0, 0.08, 30, materialFaixaLateral));
}

function criarFaixaPista(posicaoX, posicaoZ, largura, comprimento, material) {
  const geometriaFaixa = new THREE.PlaneGeometry(largura, comprimento);
  const faixa = new THREE.Mesh(geometriaFaixa, material);

  faixa.rotation.x = -Math.PI / 2;
  faixa.position.set(posicaoX, 0.018, posicaoZ);

  return faixa;
}

function carregarModeloDodge() {
  // Carrega o arquivo GLB local indicado no enunciado.
  const carregadorGLTF = new GLTFLoader();

  carregadorGLTF.load(
    './models/dodge-charger-srt.glb',
    (gltf) => {
      const modeloCarro = gltf.scene;

      prepararModelo(modeloCarro);
      cena.add(modeloCarro);
      enquadrarModelo(modeloCarro);
      atualizarMensagem('');
    },
    (progresso) => {
      if (!progresso.total) {
        return;
      }

      const porcentagem = Math.round((progresso.loaded / progresso.total) * 100);
      atualizarMensagem(`Carregando modelo 3D... ${porcentagem}%`);
    },
    () => {
      atualizarMensagem(
        'Modelo não encontrado. Importe o arquivo dodge-charger-srt.glb para a pasta models.'
      );
    }
  );
}

function prepararModelo(modeloCarro) {
  // Habilita sombras e garante materiais com cores corretas no renderizador.
  modeloCarro.traverse((objeto) => {
    if (!objeto.isMesh) {
      return;
    }

    objeto.castShadow = true;
    objeto.receiveShadow = true;

    if (objeto.material?.map) {
      objeto.material.map.colorSpace = THREE.SRGBColorSpace;
    }
  });
}

function enquadrarModelo(modeloCarro) {
  // Centraliza o modelo e ajusta a escala para caber bem no showroom.
  const caixaModelo = new THREE.Box3().setFromObject(modeloCarro);
  const centroModelo = caixaModelo.getCenter(new THREE.Vector3());
  const tamanhoModelo = caixaModelo.getSize(new THREE.Vector3());
  const maiorMedida = Math.max(tamanhoModelo.x, tamanhoModelo.y, tamanhoModelo.z);
  const escalaDesejada = 4.8 / maiorMedida;

  modeloCarro.position.sub(centroModelo);
  modeloCarro.scale.setScalar(escalaDesejada);

  const caixaAjustada = new THREE.Box3().setFromObject(modeloCarro);
  modeloCarro.position.y -= caixaAjustada.min.y;

  controles.target.set(0, 1, 0);
  controles.update();
}

function ajustarTamanhoDaCena() {
  // Mantem a proporcao correta quando a area do canvas muda de tamanho.
  const { largura, altura } = obterDimensoesCanvas();

  camera.aspect = largura / altura;
  camera.updateProjectionMatrix();
  renderizador.setSize(largura, altura, false);
}

function animarCena() {
  // Atualiza os controles com suavizacao e desenha a cena a cada frame.
  requestAnimationFrame(animarCena);
  controles.update();
  renderizador.render(cena, camera);
}

function atualizarMensagem(texto) {
  mensagemCarregamento.textContent = texto;
  mensagemCarregamento.classList.toggle('oculta', texto.length === 0);
}

function obterDimensoesCanvas() {
  return {
    largura: Math.max(canvas.clientWidth, 1),
    altura: Math.max(canvas.clientHeight, 1)
  };
}

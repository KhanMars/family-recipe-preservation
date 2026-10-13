// === VARIABLES GLOBALES ===
let recetas = [];

// === CARGAR RECETAS AL INICIAR ===
function cargarRecetas() {
  const guardadas = localStorage.getItem('recetas');
  if (guardadas) {
    recetas = JSON.parse(guardadas);
    recetas.forEach(receta => agregarTarjetaReceta(receta));
  }
}

// === GUARDAR EN LOCALSTORAGE ===
function guardarEnLocalStorage() {
  localStorage.setItem('recetas', JSON.stringify(recetas));
}

// === AGREGAR TARJETA (MODIFICADA) ===
function agregarTarjetaReceta(receta) {
  const contenedor = document.querySelector('.recetas');

  const div = document.createElement('div');
  div.className = 'receta-card';
  div.dataset.id = receta.id;

  div.innerHTML = `
    <h3>${receta.titulo}</h3>
    <p><strong>Autor:</strong> ${receta.autor}</p>
    <p><strong>Categoría:</strong> ${receta.categoria}</p>
    <p><strong>Tiempo:</strong> ${receta.tiempoPreparacion} min | <strong>Porciones:</strong> ${receta.porciones}</p>
    <div class="etiquetas">
      ${receta.etiquetas.map(etq => `<span>${etq}</span>`).join('')}
    </div>
  `;

  div.addEventListener('click', () => abrirModal(div, receta));
  contenedor.appendChild(div);
}

// === FORMULARIO AÑADIR RECETA ===
const btnAgregar = document.getElementById('btnAgregar');
const modalFormulario = document.getElementById('modalFormulario');
const cerrarFormulario = document.getElementById('cerrarFormulario');
const formReceta = document.getElementById('formReceta');
const listaIngredientes = document.getElementById('listaIngredientes');
const btnAgregarIngrediente = document.getElementById('btnAgregarIngrediente');

btnAgregar.onclick = () => {
  modalFormulario.style.display = 'block';
  listaIngredientes.innerHTML = '';
};

cerrarFormulario.onclick = () => modalFormulario.style.display = 'none';

btnAgregarIngrediente.onclick = () => {
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.gap = '8px';
  div.style.marginBottom = '6px';

  div.innerHTML = `
    <input type="text" placeholder="Ingrediente" class="ingrediente" required>
    <input type="text" placeholder="Cantidad" class="cantidad" required>
    <button type="button" class="eliminar">×</button>
  `;

  div.querySelector('.eliminar').onclick = () => div.remove();
  listaIngredientes.appendChild(div);
};

formReceta.onsubmit = (e) => {
  e.preventDefault();

  const ingredientes = [];
  document.querySelectorAll('#listaIngredientes > div').forEach(div => {
    const ing = div.querySelector('.ingrediente').value;
    const cant = div.querySelector('.cantidad').value;
    ingredientes.push({ ingrediente: ing, cantidad: cant });
  });

  const nuevaReceta = {
    id: Date.now(),
    titulo: document.getElementById('titulo').value,
    autor: document.getElementById('autor').value,
    tiempoPreparacion: document.getElementById('tiempo').value,
    porciones: document.getElementById('porciones').value,
    dificultad: document.getElementById('dificultad').value,
    categoria: document.getElementById('categoria').value,
    ingredientes: ingredientes,
    instrucciones: document.getElementById('instrucciones').value,
    etiquetas: document.getElementById('etiquetas').value.split(',').map(e => e.trim())
  };

  recetas.push(nuevaReceta);
  guardarEnLocalStorage();
  agregarTarjetaReceta(nuevaReceta);

  modalFormulario.style.display = 'none';
  formReceta.reset();
  listaIngredientes.innerHTML = '';
};

// === MODAL DE DETALLE ===
const modal = document.getElementById('modal');
const btnCerrar = document.getElementById('btnCerrarModal');
const spanCerrar = document.querySelector('.cerrar');

function cerrarModal() {
  modal.style.display = 'none';
}

spanCerrar.onclick = cerrarModal;
btnCerrar.onclick = cerrarModal;

// === ASIGNAR EVENTOS A TARJETAS EXISTENTES AL CARGAR ===
function inicializarTarjetasExistentes() {
  const tarjetas = document.querySelectorAll('.receta-card');
  tarjetas.forEach(tarjeta => {
    // Evitar duplicar eventos
    tarjeta.replaceWith(tarjeta.cloneNode(true));
  });

  // Volver a seleccionarlas después del clon
  document.querySelectorAll('.receta-card').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
      abrirModal(tarjeta);
    });
  });
}

// === FUNCIÓN ABRIR MODAL ===
function abrirModal(tarjeta, receta = null) {
  const modal = document.getElementById('modal');

  if (receta) {
    // Receta guardada (del formulario)
    document.getElementById('modal-titulo').textContent = receta.titulo;
    document.getElementById('modal-autor').textContent = receta.autor;
    document.getElementById('modal-categoria').textContent = receta.categoria;
    document.getElementById('modal-tiempo').textContent = receta.tiempoPreparacion;
    document.getElementById('modal-porciones').textContent = receta.porciones;
    document.getElementById('modal-dificultad').textContent = receta.dificultad || 'No especificada';
    document.getElementById('modal-instrucciones').textContent = receta.instrucciones || 'Sin instrucciones';

    // Ingredientes
    const listaIngredientes = document.getElementById('modal-ingredientes');
    listaIngredientes.innerHTML = '';
    if (receta.ingredientes && receta.ingredientes.length > 0) {
      receta.ingredientes.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.ingrediente} - ${item.cantidad}`;
        listaIngredientes.appendChild(li);
      });
    } else {
      listaIngredientes.innerHTML = '<li>No hay ingredientes registrados</li>';
    }

    // Etiquetas
    const contenedorEtiquetas = document.getElementById('modal-etiquetas');
    contenedorEtiquetas.innerHTML = '';
    receta.etiquetas.forEach(etq => {
      const span = document.createElement('span');
      span.textContent = etq;
      contenedorEtiquetas.appendChild(span);
    });

  } else {
    // Tarjetas existentes del HTML (datos limitados)
    document.getElementById('modal-titulo').textContent = tarjeta.querySelector('h3').textContent;
    document.getElementById('modal-autor').textContent = tarjeta.querySelector('p:nth-child(2)').textContent.replace('Autor: ', '');
    document.getElementById('modal-categoria').textContent = tarjeta.querySelector('p:nth-child(3)').textContent.replace('Categoría: ', '');

    const tiempoPorciones = tarjeta.querySelector('p:nth-child(4)').textContent;
    document.getElementById('modal-tiempo').textContent = tiempoPorciones.split('|')[0].replace('Tiempo: ', '').trim();
    document.getElementById('modal-porciones').textContent = tiempoPorciones.split('|')[1].replace('Porciones: ', '').trim();

    document.getElementById('modal-dificultad').textContent = 'No disponible';
    document.getElementById('modal-instrucciones').textContent = 'Detalles completos no disponibles en esta tarjeta.';

    const listaIngredientes = document.getElementById('modal-ingredientes');
    listaIngredientes.innerHTML = '<li>Ingredientes no disponibles</li>';

    const contenedorEtiquetas = document.getElementById('modal-etiquetas');
    contenedorEtiquetas.innerHTML = '';
    const etiquetas = tarjeta.querySelectorAll('.etiquetas span');
    etiquetas.forEach(etq => {
      const span = document.createElement('span');
      span.textContent = etq.textContent;
      contenedorEtiquetas.appendChild(span);
    });
  }

  modal.style.display = 'block';
}

// === ELIMINAR RECETA (TEMPORAL) ===
let recetaActual = null; // Guardamos la receta que está abierta en el modal

// Modificamos la función abrirModal para guardar la receta actual
const abrirModalOriginal = abrirModal;
abrirModal = function(tarjeta, receta = null) {
  recetaActual = receta || null;
  abrirModalOriginal(tarjeta, receta);
};

document.getElementById('btnEliminarReceta').onclick = () => {
  if (!recetaActual) {
    alert("Esta receta no se puede eliminar porque es de los datos de ejemplo.");
    return;
  }

  if (confirm(`¿Estás seguro de eliminar "${recetaActual.titulo}"?`)) {
    // Eliminar del array
    recetas = recetas.filter(r => r.id !== recetaActual.id);
    guardarEnLocalStorage();

    // Eliminar la tarjeta del DOM
    const tarjetaDOM = document.querySelector(`.receta-card[data-id="${recetaActual.id}"]`);
    if (tarjetaDOM) tarjetaDOM.remove();

    // Cerrar modal
    document.getElementById('modal').style.display = 'none';
    recetaActual = null;
  }
};

// === IMPORTAR RECETAS DESDE JSON (TEMPORAL) ===
const btnImportar = document.getElementById('btnImportar');
const modalImportar = document.getElementById('modalImportar');
const cerrarImportar = document.getElementById('cerrarImportar');
const btnCargarJSON = document.getElementById('btnCargarJSON');
const textareaJSON = document.getElementById('jsonRecetas');

btnImportar.onclick = () => {
  modalImportar.style.display = 'block';
  textareaJSON.value = '';
};

cerrarImportar.onclick = () => modalImportar.style.display = 'none';

btnCargarJSON.onclick = () => {
  try {
    const datos = JSON.parse(textareaJSON.value);

    if (!Array.isArray(datos)) {
      alert("El JSON debe ser un arreglo de recetas.");
      return;
    }

    datos.forEach(receta => {
      // Asignamos un id si no lo tiene
      if (!receta.id) receta.id = Date.now() + Math.floor(Math.random() * 1000);

      recetas.push(receta);
      agregarTarjetaReceta(receta);
    });

    guardarEnLocalStorage();
    modalImportar.style.display = 'none';
    alert(`${datos.length} receta(s) importada(s) correctamente.`);

  } catch (error) {
    alert("Error: El JSON no es válido. Revisa el formato.");
    console.error(error);
  }
};

// === INICIALIZACIÓN ===
cargarRecetas();
inicializarTarjetasExistentes();
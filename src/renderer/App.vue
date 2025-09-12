

<template>
  <div class="app">
    <header>
      <div class="title">
        <img class="cow" :src="minhaImg" alt="">
        <h1>Cowculator</h1> 
      </div>
      
    </header>

    <main class="card">
      <div class="field">
        <label for="peso">Peso (kg)</label>
        <div class="box-p">
          
        <input
          id="peso"
          v-model.number="pesoKg"
          type="number"
          min="0"
          step="0.01"
        />
        <button @click="adicionarPeso" class="btn-sum"> <strong> + </strong> </button></div>
         <p>Total Kg: <span class="kgs">{{ totalDisplay }} kilogramas </span></p>
        </div>
       
      <div class="field">
        <label for="kgArroba">Kg por arroba</label>
        <input
          id="kgArroba"
          v-model.number="kgPorArroba"
          type="number"
          min="0.0"
          step="1"
        />
         <small>Valor padrão: 15 kg/@</small>
        
       
      </div>
      <div class="field">
        <label for="qtd">Valor do Arroba (R$)</label>
        <input
          id="qtd"
          v-model.number="preco"
          type="number"
          min="0"
          step="10"
        />
      </div>

      <section class="results">
        <p><strong>Valor total:</strong> R$ {{ precoTotal}}</p>
      <p><strong>Arrobas totais:</strong> {{ arrobasPorAnimalDisplay  }}</p>
      </section>

      <section class="actions">
        <button @click="reset">Resetar</button>
      
      </section>

      <footer class="note">
        Obs: 1 arroba = <em>{{ kgPorArroba }}</em> kg (configurável)
      </footer>
      <hr>
      <div  class="resultados">
        <h2>
          Resultados:
        </h2>
        <div class="box-results">
          <div id="results">
              <p class="rslt-item"><strong>Total Kg: </strong>{{ totalDisplay }} kilogramas </p>
              <p class="rslt-item"><strong>Arrobas totais:</strong> {{ arrobasPorAnimalDisplay  }}</p>
              <p class="rslt-item"><strong>Valor do Arroba: </strong>R$ {{ precoTt }}</p>
              <p class="rslt-item"><strong>Valor total:</strong> R$ {{ precoTotal}}</p>
          </div>
          <button @click="baixarPDF">Exportar resultado</button>
        </div>
    </div>
    </main>
    
  </div>
</template>

<script setup>
import minhaImg from '../assets/cow.png'
import { ref, computed } from "vue";
import html2pdf from 'html2pdf.js';


const pesoKg = ref();
const total = ref(0);
const preco = ref(300);
const kgPorArroba = ref(15);

function adicionarPeso(){
  total.value += pesoKg.value;
  pesoKg.value = 0
}
const arrobasPorAnimal = computed(() => {
  return kgPorArroba.value > 0 ? total.value / kgPorArroba.value : 0;
});

const precosTotais = computed(() => arrobasPorAnimal.value * preco.value);
const pesoTotal = computed(() => pesoKg.value * preco.value);

const format = (v, d = 2) =>
  Number(v).toLocaleString("pt-BR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

const arrobasPorAnimalDisplay = computed(() =>
  format(arrobasPorAnimal.value, 2)
);
const precoTotal= computed(() => format(precosTotais.value, 2));
const pesoTotalDisplay = computed(() => format(pesoTotal.value, 2));
const totalDisplay = computed(() => format(total.value,1)) ;
const precoTt = computed(() => format(preco.value, 2))


function reset() {
  pesoKg.value = 0;
  preco.value = 300;
  kgPorArroba.value = 15;
  total.value = 0;
}

async function copiar() {
  const text = `Arrobas totais: ${precosTotaisDisplay.value} @ — Peso total: ${pesoTotalDisplay.value} kg`;
  try {
    await navigator.clipboard.writeText(text);
    alert("Resultado copiado para a área de transferência");
  } catch (e) {
    alert("Não foi possível copiar automaticamente.");
  }
}

// PDF 

  function baixarPDF() {
  const element = document.getElementById('results')
  const opt = {
    margin: 10,
    filename: 'relatorio-gado.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  html2pdf().set(opt).from(element).save()
}

</script>

<style scoped>

.app {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial;
  padding: 20px;
}
.title{
  display: flex;
  flex-direction: row;
  align-items: center;
  
}
h2{
  margin-left: 40px;
}
label{
  font-weight: 800;
}
.kgs{
  font-weight: 500;
}
.cow{
  width: 70px;
  height: 70px;
}
.card {
  max-width: 540px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow:  2px 10px 20px rgba(0, 0, 0, 0.20);
  
}
.field {
  margin-bottom: 12px;
}
.btn-sum{
  font-size: 20px;
  padding: px;
  padding-left: 12px;
  padding-right: 12px;
  margin-left: 3px;
  background: rgb(144, 240, 195);
  border: none;

}
.box-results{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
#results{
  display: flex;
  flex-direction: column;

}
.rslt-item{
  margin: 6px;
}
.resultados{
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}   
input {
  width: 100%;
  padding: 8px;
  margin-top: 6px;
  box-sizing: border-box;
  border-radius: 8px;
}
.results {
  margin-top: 12px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
#peso{
  width: 460px;
}
button {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f7f7f7;
  cursor: pointer;
}
.note {
  display: block;
  margin-top: 10px;
  padding-bottom: 10px;
  color: #666;
}
.box-p{
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
}
</style>
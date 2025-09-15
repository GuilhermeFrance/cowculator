

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
              <p>{{ nomeResultado }}</p>
              <p class="rslt-item"><strong>Total Kg: </strong>{{ totalDisplay }} kilogramas </p>
              <p class="rslt-item"><strong>Arrobas totais:</strong> {{ arrobasPorAnimalDisplay  }}</p>
              <p class="rslt-item"><strong>Valor do Arroba: </strong>R$ {{ precoTt }}</p>
              <p class="rslt-item"><strong>Valor total:</strong> R$ {{ precoTotal}}</p>
          </div>
          <div class="rslt-sect">
            <label for="input">Nome do arquivo:</label>
             <input
          id="inpult"
          v-model.number="nomeResultado"
          type="text"
          placeholder="ex.: pesagem-1"
        />
            <button @click="baixarPDF">Exportar resultado</button>

          </div>
          
        </div>
    </div>
    <hr> 
     <div  class="resultados">
        <h2>
          Histórico
        </h2>
        <div id="history">
          <div v-if="history.length === 0" class="empty">Nenhum histórico ainda — adicione valores para preencher.</div>

          <ul v-else class="history-list">
            <li v-for="(h, idx) in history" :key="h.id" class="history-item">
              <div class="entry" @click="selecionarHistorico(idx)" title="Clique para copiar o valor para o input">
                <div class="value"><strong>{{ Number(h.value).toLocaleString('pt-BR') }}</strong></div>
                <div class="meta"><small>{{ h.label }} — total após: {{ Number(h.totalAfter).toLocaleString('pt-BR') }}</small></div>
              </div>
              <div class="item-actions">
                <button @click.stop="removeHistorico(idx)">✕</button>
              </div>
            </li>
          </ul>
        </div>
    </div>
    </main>
    
  </div>
</template>

<script setup>
import minhaImg from '../assets/cow.png'
import { ref, computed, watch, onMounted } from "vue";
import html2pdf from 'html2pdf.js';

const STORAGE_KEY = 'cowculator_history_v1'

const pesoKg = ref();
const total = ref(0);
const preco = ref(300);
const kgPorArroba = ref(15);
const nomeResultado = ref("")
const history = ref([])

function adicionarPeso(){
  const parsed = Number(pesoKg.value) || 0
  total.value += parsed;
  pesoKg.value = 0
  adicionarHistoricoEntrada(parsed, total.value)
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
// HISTÓRICO

function generateId() {
  return  `${Date.now()}-${Math.floor(Math.random()*1000)}`
}

function nowLabel(ts = Date.now()){
  return new Date(ts).toLocaleString()
}

function carregarHistorico(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [] 
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return [] 
  } catch (e) {
    console.log('Erro ao carregar o histórico', e)
    return []
  }
}

function salvarHistorico(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch (e) {
    console.log('Erro ao salvar o histórico', e)
  }
}

console.log(history)

function adicionarHistoricoEntrada(){
  if (value === null || value === undefined || Number.isNaN(Number(value))) return
  const entry = {
    id: generateId(),
    value:Number(value),
    totalAfter: Number(totalAfter),
    timestamp: Date.now(),
    label: nowLabel()
  }
  history.value.unshift(entry)
  if(history.length > 1000) history.value.splice(1000)
}

console.log(history)

function limparHistorico(){
  if(!confirm('Deseja limpar todo o historico?')) return
  history.value = []
}

function selecionarHistorico(index){
  const e = history.value[index]
  if(!e) return
  pesoKg = e.value
}

watch(history, () => salvarHistorico())

onMounted(() => {
  history.value = carregarHistorico()
})
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
  margin-bottom: 2px;
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
#inpults{

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
  align-content: center;
}
.rslt-sect  {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 7px  ;
  height: 164px;
}
#results{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.rslt-item{
  margin: 6px;
}
.resultados{
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  justify-content: center;
  margin-bottom: 30px;
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
<template>
<div  class="resultados">
        <h2>
          Resultados:
        </h2>
        <div id="box-results">
          <div id="results">
              <p class="rslt-item"><strong>Total Kg: </strong>{{ totalDisplay }} kilogramas </p>
              <p class="rslt-item"><strong>Arrobas totais:</strong> {{ arrobasPorAnimalDisplay  }}</p>
              <p class="rslt-item"><strong>Valor do Arroba: </strong>R$ {{ precoTt }}</p>
              <p class="rslt-item"><strong>Valor total:</strong> R$ {{ precoTotal}}</p>
          </div>
          <button  @click="baixarPDF">Exportar resultado</button>
        </div>
    </div>
</template>

<script setup>
    import html2pdf from 'html2pdf.js';
    import { defineProps } from 'vue';

    const props = defineProps({
        totalDisplay: {type: [Number, String], required: true},
        arrobasPorAnimalDisplay: {type: [Number, String], required: true},
        precoTt: {type: [Number, String], required: true},
        precoTotal: {type: [Number, String], required: true}
    })

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
h2{
  margin-left: 40px;
}
#box-results{
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
</style>
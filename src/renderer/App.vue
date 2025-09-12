<template>
  <div class="app">
    <header>
      <h1>Calculadora de Arroba — Gado</h1>
    </header>

    <main class="card">
      <div class="field">
        <label for="peso">Peso (kg) por animal</label>
        <input
          id="peso"
          v-model.number="pesoKg"
          type="number"
          min="0"
          step="0.01"
        />
      </div>

      <div class="field">
        <label for="qtd">Quantidade de animais</label>
        <input
          id="qtd"
          v-model.number="quantidade"
          type="number"
          min="1"
          step="1"
        />
      </div>

      <div class="field">
        <label for="kgArroba">Kg por arroba</label>
        <input
          id="kgArroba"
          v-model.number="kgPorArroba"
          type="number"
          min="0.1"
          step="0.01"
        />
        <small>Valor padrão: 15 kg/@</small>
      </div>

      <section class="results">
        <p>
          <strong>Arrobas por animal:</strong> {{ arrobasPorAnimalDisplay }}
        </p>
        <p><strong>Arrobas totais:</strong> {{ arrobasTotaisDisplay }}</p>
        <p><strong>Peso total (kg):</strong> {{ pesoTotalDisplay }}</p>
      </section>

      <section class="actions">
        <button @click="reset">Resetar</button>
        <button @click="copiar">Copiar resultado</button>
      </section>

      <footer class="note">
        Obs: 1 arroba = <em>{{ kgPorArroba }}</em> kg (configurável)
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const pesoKg = ref(250);
const quantidade = ref(10);
const kgPorArroba = ref(15);

const arrobasPorAnimal = computed(() => {
  return kgPorArroba.value > 0 ? pesoKg.value / kgPorArroba.value : 0;
});

const arrobasTotais = computed(() => arrobasPorAnimal.value * quantidade.value);
const pesoTotal = computed(() => pesoKg.value * quantidade.value);

const format = (v, d = 2) =>
  Number(v).toLocaleString("pt-BR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

const arrobasPorAnimalDisplay = computed(() =>
  format(arrobasPorAnimal.value, 3)
);
const arrobasTotaisDisplay = computed(() => format(arrobasTotais.value, 3));
const pesoTotalDisplay = computed(() => format(pesoTotal.value, 2));

function reset() {
  pesoKg.value = 0;
  quantidade.value = 1;
  kgPorArroba.value = 15;
}

async function copiar() {
  const text = `Arrobas totais: ${arrobasTotaisDisplay.value} @ — Peso total: ${pesoTotalDisplay.value} kg`;
  try {
    await navigator.clipboard.writeText(text);
    alert("Resultado copiado para a área de transferência");
  } catch (e) {
    alert("Não foi possível copiar automaticamente.");
  }
}
</script>

<style scoped>
.app {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial;
  padding: 20px;
}
.card {
  max-width: 540px;
  background: #fff;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.field {
  margin-bottom: 12px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 6px;
  box-sizing: border-box;
}
.results {
  margin-top: 12px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
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
  color: #666;
}
</style>
<script setup>
import { onMounted, ref } from 'vue'
import { useTodosStore } from './stores/todos'

const store = useTodosStore()
const newTitle = ref('')

onMounted(() => {
  store.init()
})

function add() {
  store.addTodo(newTitle.value)
  newTitle.value = ''
}

function handleEnter(e) {
  if (e.key === 'Enter') add()
}
</script>

<template>
  <section class="page">
    <div class="container">
      <header class="header">
        <h1 class="title">Tasks</h1>
        <p class="subtitle">Plan your day and track progress</p>
      </header>

      <div class="card">
        <div class="input-row">
          <input
            v-model="newTitle"
            class="input"
            placeholder="Add a new activity"
            @keyup="handleEnter"
          />
          <button class="btn primary" @click="add">Add</button>
        </div>

        <div class="toolbar">
          <div class="filters">
            <button
              class="chip"
              :class="{ active: store.filter==='all' }"
              @click="store.setFilter('all')"
            >All</button>
            <button
              class="chip"
              :class="{ active: store.filter==='active' }"
              @click="store.setFilter('active')"
            >Active</button>
            <button
              class="chip"
              :class="{ active: store.filter==='completed' }"
              @click="store.setFilter('completed')"
            >Completed</button>
          </div>
          <div class="spacer"></div>
          <div class="meta">Remaining: {{ store.remainingCount }}</div>
          <button class="btn subtle" @click="store.clearCompleted">Clear completed</button>
        </div>

        <ul class="list" v-if="store.filteredItems.length">
          <li class="item" v-for="todo in store.filteredItems" :key="todo.id">
            <label class="checkbox">
              <input type="checkbox" :checked="todo.completed" @change="store.toggleTodo(todo.id)" />
              <span class="control"></span>
            </label>
            <span class="text" :class="{ done: todo.completed }">{{ todo.title }}</span>
            <button class="icon-btn" @click="store.deleteTodo(todo.id)" aria-label="Delete">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </li>
        </ul>

        <div v-else class="empty">
          <div class="empty-icon">🗒️</div>
          <div class="empty-title">No tasks yet</div>
          <div class="empty-subtitle">Add your first activity to get started</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page { padding: 48px 16px; }
.container { max-width: 720px; margin: 0 auto; }
.header { text-align: center; margin-bottom: 24px; }
.title { font-size: 28px; line-height: 32px; margin: 0; letter-spacing: -0.02em; }
.subtitle { margin: 6px 0 0 0; color: #6b7280; }

.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(17, 24, 39, 0.06);
  padding: 16px;
}

.input-row { display: flex; gap: 10px; }
.input {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  outline: none;
  background: #f9fafb;
  transition: border-color .2s, background-color .2s, box-shadow .2s;
}
.input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: #f3f4f6;
  color: #111827;
  cursor: pointer;
  transition: background-color .2s, color .2s, border-color .2s, opacity .2s;
}
.btn:hover { background: #e5e7eb; }
.btn:disabled { opacity: .6; cursor: not-allowed; }
.btn.primary { background: #3b82f6; color: #fff; }
.btn.primary:hover { background: #2563eb; }
.btn.subtle { background: #fff; border-color: #e5e7eb; }
.btn.subtle:hover { background: #f9fafb; }

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.filters { display: flex; gap: 8px; }
.chip {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}
.chip.active { background: #111827; color: #fff; border-color: #111827; }
.spacer { flex: 1; }
.meta { color: #6b7280; }

.list { list-style: none; padding: 0; margin: 12px 0 0 0; }
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  border-top: 1px solid #f3f4f6;
}
.item:first-child { border-top: none; }

.checkbox { position: relative; display: inline-flex; align-items: center; }
.checkbox input { position: absolute; opacity: 0; pointer-events: none; }
.checkbox .control {
  width: 18px;
  height: 18px;
  border: 2px solid #9ca3af;
  border-radius: 6px;
  display: inline-block;
  transition: all .2s;
}
.checkbox input:checked + .control {
  background: #10b981;
  border-color: #10b981;
  box-shadow: inset 0 0 0 2px #ffffff;
}

.text { flex: 1; }
.text { color: #111827; }
.text.done { color: #6b7280; text-decoration: line-through; }

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  cursor: pointer;
}
.icon-btn:hover { background: #fee2e2; }

.empty { text-align: center; padding: 36px 8px; color: #6b7280; }
.empty-icon { font-size: 32px; }
.empty-title { font-weight: 600; color: #111827; margin-top: 8px; }
.empty-subtitle { margin-top: 4px; }

@media (prefers-color-scheme: dark) {
  .card { background: #0b1220; border-color: #111827; box-shadow: 0 10px 25px rgba(0,0,0,.4); }
  .subtitle, .meta { color: #9ca3af; }
  .input { background: #0f172a; border-color: #111827; color: #e5e7eb; }
  .input:focus { background: #0f172a; }
  .btn { background: #0f172a; color: #e5e7eb; border-color: #1f2937; }
  .btn:hover { background: #111827; }
  .btn.subtle { background: transparent; }
  .chip { background: #0f172a; border-color: #1f2937; color: #e5e7eb; }
  .chip.active { background: #2563eb; border-color: #2563eb; }
  .item { border-top-color: #111827; }
  .text { color: #e5e7eb; }
  .text.done { color: #94a3b8; }
  .icon-btn { background: #1b0b0b; border-color: #3b0f0f; color: #f87171; }
  .icon-btn:hover { background: #2a0f0f; }
}
</style>

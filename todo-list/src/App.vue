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

        <div class="progress" aria-label="Progress">
          <div
            class="bar"
            :style="{ width: (store.items.length ? Math.round(((store.items.length - store.remainingCount) / store.items.length) * 100) : 0) + '%' }"
          ></div>
          <div class="progress-text">
            {{ store.items.length ? Math.round(((store.items.length - store.remainingCount) / store.items.length) * 100) : 0 }}%
            completed
          </div>
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
.page {
  padding: 48px 16px;
  min-height: 100vh;
  background: radial-gradient(1200px 600px at 10% -10%, #a78bfa15 0%, transparent 60%),
              radial-gradient(1000px 500px at 110% 10%, #60a5fa20 0%, transparent 60%),
              linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}
.container { max-width: 760px; margin: 0 auto; }
.header { text-align: center; margin-bottom: 24px; }
.title { font-size: 34px; line-height: 36px; margin: 0; letter-spacing: -0.02em; background: linear-gradient(90deg, #111827, #1f2937); -webkit-background-clip: text; background-clip: text; color: white; }
.subtitle { margin: 6px 0 0 0; color: #6b7280; }

.card {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 16px;
  box-shadow: 0 30px 60px rgba(2, 6, 23, 0.12), inset 0 1px 0 rgba(255,255,255,.6);
  backdrop-filter: saturate(140%) blur(10px);
  padding: 18px;
  animation: cardIn .4s ease;
}
@keyframes cardIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.input-row { display: flex; gap: 10px; }
.input {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
  background: linear-gradient(180deg, #f9fafb, #f3f4f6);
  transition: border-color .2s, background-color .2s, box-shadow .2s, transform .08s;
}
.input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.04);
  background: linear-gradient(180deg, #ffffff, #f3f4f6);
  color: #111827;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .2s ease, background-color .2s, color .2s, border-color .2s, opacity .2s;
  box-shadow: 0 1px 0 rgba(255,255,255,.8) inset, 0 6px 16px rgba(2,6,23,.08);
}
.btn:hover { background: #ffffff; box-shadow: 0 1px 0 rgba(255,255,255,.8) inset, 0 10px 24px rgba(2,6,23,.12); }
.btn:disabled { opacity: .6; cursor: not-allowed; }
.btn.primary { background: linear-gradient(180deg, #60a5fa, #3b82f6); color: #fff; border-color: rgba(59,130,246,.5); }
.btn.primary:hover { background: linear-gradient(180deg, #7db5ff, #3b82f6); }
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
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  transition: background-color .2s, color .2s, border-color .2s, box-shadow .2s;
  box-shadow: 0 6px 16px rgba(2,6,23,.06);
}
.chip:hover { background: #f8fafc; }
.chip.active { background: linear-gradient(180deg, #111827, #0b1220); color: #fff; border-color: #0b1220; box-shadow: 0 10px 24px rgba(2,6,23,.2); }
.spacer { flex: 1; }
.meta { color: #6b7280; }

.list { list-style: none; padding: 0; margin: 16px 0 0 0; }
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  border-top: 1px solid #f3f4f6;
  transition: background-color .2s, transform .08s ease, border-color .2s;
}
.item:first-child { border-top: none; }
.item:hover { background: rgba(15, 23, 42, 0.03); }

.checkbox { position: relative; display: inline-flex; align-items: center; }
.checkbox input { position: absolute; opacity: 0; pointer-events: none; }
.checkbox .control {
  width: 18px;
  height: 18px;
  border: 2px solid #9ca3af;
  border-radius: 6px;
  display: inline-block;
  transition: all .2s; box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
}
.checkbox input:checked + .control {
  background: #10b981;
  border-color: #10b981;
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
  transition: transform .08s ease, box-shadow .2s ease, background-color .2s;
}
.icon-btn:hover { background: #fee2e2; box-shadow: 0 8px 20px rgba(239,68,68,.15); }

.empty { text-align: center; padding: 36px 8px; color: #6b7280; }
.empty-icon { font-size: 32px; }
.empty-title { font-weight: 600; color: #111827; margin-top: 8px; }
.empty-subtitle { margin-top: 4px; }

.progress {
  position: relative;
  margin-top: 14px;
  background: linear-gradient(180deg, #f1f5f9, #e5e7eb);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  height: 14px;
  overflow: hidden;
}
.progress .bar {
  height: 100%;
  background: linear-gradient(90deg, #34d399, #3b82f6);
  transition: width .3s ease;
}
.progress-text {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

@media (prefers-color-scheme: dark) {
  .page {
    background: radial-gradient(1200px 600px at 10% -10%, #6d28d920 0%, transparent 60%),
                radial-gradient(1000px 500px at 110% 10%, #1d4ed820 0%, transparent 60%),
                linear-gradient(180deg, #0b1220 0%, #0a1020 100%);
  }
  .card { background: rgba(11, 18, 32, 0.75); border-color: #111827; box-shadow: 0 30px 60px rgba(0,0,0,.4); }
  .subtitle, .meta { color: #9ca3af; }
  .input { background: linear-gradient(180deg, #0f172a, #0b1220); border-color: #111827; color: #e5e7eb; }
  .input:focus { background: #0f172a; }
  .btn { background: linear-gradient(180deg, #0f172a, #0b1220); color: #e5e7eb; border-color: #1f2937; }
  .btn:hover { background: #111827; }
  .btn.subtle { background: transparent; }
  .chip { background: #0f172a; border-color: #1f2937; color: #e5e7eb; box-shadow: 0 10px 20px rgba(0,0,0,.2); }
  .chip.active { background: linear-gradient(180deg, #1f2937, #0b1220); border-color: #1f2937; }
  .item { border-top-color: #111827; }
  .item:hover { background: rgba(255, 255, 255, 0.04); }
  .text { color: #e5e7eb; }
  .text.done { color: #94a3b8; }
  .icon-btn { background: #1b0b0b; border-color: #3b0f0f; color: #f87171; }
  .icon-btn:hover { background: #2a0f0f; }
  .progress { background: linear-gradient(180deg, #0b1220, #0a0f1d); border-color: #111827; }
}
</style>

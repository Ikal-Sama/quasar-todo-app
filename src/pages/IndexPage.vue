<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h5">My Todos</div>
      <q-space />
      <q-btn color="primary" icon="add" label="New" no-caps :to="{ name: 'todo.new' }" />
    </div>

    <q-banner v-if="todos.error" class="bg-negative text-white q-mb-md" rounded>
      {{ todos.error }}
    </q-banner>

    <q-inner-loading :showing="todos.loading" />

    <q-list v-if="todos.todos.length" bordered separator>
      <q-item v-for="todo in todos.todos" :key="todo.id">
        <!-- FIX: Added a checkbox so users can click to change the status -->
        <q-item-section avatar>
          <q-checkbox
            :model-value="Boolean(todo.is_completed)"
            @click.stop.prevent="toggleStatus(todo)"
          />
        </q-item-section>

        <q-item-section>
          <!-- FIX: Only apply the text-strikethrough and grey out text when todo.is_completed is true -->
          <q-item-label :class="{ 'text-strikethrough text-grey-6': todo.is_completed }">
            {{ todo.task }}
          </q-item-label>
        </q-item-section>

        <q-item-section side class="flex gap-3">
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            @click.stop.prevent="confirmRemove(todo)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <div v-else-if="!todos.loading" class="text-center q-pa-xl text-grey-7">
      <q-icon name="checklist" size="4em" />
      <div class="q-mt-md">No todos yet. Create your first one.</div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useTodoStore } from '@/stores/todo-store'

const $q = useQuasar()
const todos = useTodoStore()

onMounted(() => {
  todos.fetchAll().catch(() => {
    // error is already in store state
  })
})

async function toggleStatus(todo) {
  try {
    await todos.update(todo.id, {
      is_completed: !todo.is_completed,
    })
    $q.notify({ type: 'positive', message: 'Status updated', timeout: 1000 })
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  }
}

function confirmRemove(todo) {
  $q.dialog({
    title: 'Delete todo?',
    message: todo.title,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await todos.remove(todo.id)
      $q.notify({ type: 'positive', message: 'Todo deleted' })
    } catch (err) {
      $q.notify({ type: 'negative', message: err.message })
    }
  })
}
</script>

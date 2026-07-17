<template>
  <q-page padding>
    <div class="q-mx-auto" style="max-width: 600px">
      <h4 class="q-my-md">New Todo</h4>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          v-model="form.task"
          label="Todo"
          outlined
          autofocus
          :rules="[(v) => !!v || 'Todo is required']"
        />

        <div class="row q-gutter-sm">
          <q-btn type="submit" color="primary" label="Create" :loading="submitting" no-caps />
          <q-btn flat label="Cancel" :to="{ name: 'home' }" no-caps />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTodoStore } from '@/stores/todo-store'

const $q = useQuasar()
const router = useRouter()
const todos = useTodoStore()

const form = ref({ task: '' })
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
  try {
    await todos.create(form.value)
    $q.notify({ type: 'positive', message: 'Todo created' })
    router.replace({ name: 'home' })
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    submitting.value = false
  }
}
</script>

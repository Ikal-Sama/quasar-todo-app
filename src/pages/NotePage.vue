<template>
  <q-page padding>
    <q-inner-loading :showing="todos.loading && !form.id" />

    <div v-if="notFound" class="text-center q-pa-xl text-grey-7">
      <q-icon name="error_outline" size="4em" />
      <div class="q-mt-md">Todo not found.</div>
      <q-btn class="q-mt-md" flat :to="{ name: 'home' }" label="Back to list" no-caps />
    </div>

    <div v-else-if="form.id" class="q-mx-auto" style="max-width: 600px">
      <q-form @submit.prevent="onSave" class="q-gutter-md">
        <q-input
          v-model="form.title"
          label="Title"
          outlined
          :rules="[(v) => !!v || 'Title is required']"
        />
        <q-input
          v-model="form.description"
          label="Description"
          outlined
          type="textarea"
          autogrow
        />
        <q-toggle v-model="form.completed" label="Completed" />

        <div class="row q-gutter-sm">
          <q-btn
            type="submit"
            color="primary"
            label="Save"
            :loading="saving"
            no-caps
          />
          <q-btn flat label="Back" :to="{ name: 'home' }" no-caps />
          <q-space />
          <q-btn
            flat
            color="negative"
            icon="delete"
            label="Delete"
            no-caps
            @click="confirmRemove"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTodoStore } from '@/stores/todo-store'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const todos = useTodoStore()

const form = reactive({ id: null, title: '', description: '', completed: false })
const saving = ref(false)
const notFound = ref(false)

onMounted(async () => {
  try {
    const todo = await todos.fetchOne(route.params.id)
    Object.assign(form, {
      id: todo.id,
      title: todo.title,
      description: todo.description || '',
      completed: Boolean(todo.completed),
    })
  } catch (err) {
    if (err.status === 404) notFound.value = true
    else $q.notify({ type: 'negative', message: err.message })
  }
})

async function onSave() {
  saving.value = true
  try {
    await todos.update(form.id, {
      title: form.title,
      description: form.description,
      completed: form.completed,
    })
    $q.notify({ type: 'positive', message: 'Saved' })
    router.replace({ name: 'home' })
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    saving.value = false
  }
}

function confirmRemove() {
  $q.dialog({
    title: 'Delete this todo?',
    message: form.title,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await todos.remove(form.id)
      $q.notify({ type: 'positive', message: 'Deleted' })
      router.replace({ name: 'home' })
    } catch (err) {
      $q.notify({ type: 'negative', message: err.message })
    }
  })
}
</script>

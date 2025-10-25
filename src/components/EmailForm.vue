<script setup>
import { ref, computed } from 'vue'
import { sendMail } from '../firebase' // Firebase Functions wrapper


const to = ref('djia0019@student.monash.edu') 
const subject = ref('')
const body = ref('')
const asHtml = ref(true)               
const files = ref([])                  
const attachmentsBase64 = ref([])      


const loading = ref(false)
const notice = ref('')                 
const noticeType = ref('success')      

const emailList = computed(() =>
  to.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emailError = computed(() => {
  // No validation needed since recipient is fixed
  return null
})
const subjectError = computed(() => (subject.value ? null : 'Subject is required.'))
const bodyError = computed(() => (body.value ? null : 'Message is required.'))

/* ------- Attachments: Convert to base64 ------- */
function onFileChange(e) {
  const selected = Array.from(e.target.files || [])
  files.value = selected
  attachmentsBase64.value = []
  selected.forEach(f => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = String(reader.result).split('base64,')[1]
      attachmentsBase64.value.push({
        filename: f.name,
        type: f.type || 'application/octet-stream',
        contentBase64: base64
      })
    }
    reader.readAsDataURL(f)
  })
}

async function handleSend() {
  notice.value = ''
  if (emailError.value || subjectError.value || bodyError.value) {
    noticeType.value = 'error'
    notice.value = 'Please fix the errors before sending.'
    return
  }

  loading.value = true
  try {
    const payload = {
      to: emailList.value,
      subject: subject.value,
      attachmentsBase64: attachmentsBase64.value
    }
    if (asHtml.value) {
      payload.html = `<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; white-space: pre-wrap;">${body.value}</div>`
    } else {
      payload.text = body.value
    }

    const res = await sendMail(payload)
    console.log(res.data)
    noticeType.value = 'success'
    notice.value = 'Email sent successfully!'
    // Clear form 
    clearForm()
  } catch (err) {
    console.error(err)
    noticeType.value = 'error'
    notice.value = 'Failed to send email: ' + (err.message || 'Unknown error')
  } finally {
    loading.value = false
  }
}

function clearForm() {
  // Keep recipient fixed, only clear other fields
  subject.value = ''
  body.value = ''
  files.value = []
  attachmentsBase64.value = []
  const fileInput = document.getElementById('attachments')
  if (fileInput) fileInput.value = ''
}
</script>

<template>
  <div class="container my-4 email-page">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="email-card card-soft p-5">
          <!-- Header consistent with login page style -->
          <div class="text-center mb-5">
            <div class="email-header">
              <div class="macaron-dots">
                <div class="dot dot-peach"></div>
                <div class="dot dot-lavender"></div>
                <div class="dot dot-pink"></div>
                <div class="dot dot-blue"></div>
              </div>
              <h1 class="email-title">Give Feedback</h1>
              <p class="email-subtitle">Share your thoughts and suggestions with the Sheswell team</p>
            </div>
          </div>

          <!-- Success/failure notification -->
          <div
            v-if="notice"
            :class="['alert', noticeType === 'success' ? 'alert-success' : 'alert-danger']"
            role="status"
            aria-live="polite"
          >
            {{ notice }}
          </div>

          <form @submit.prevent="handleSend" novalidate>
            <!-- Recipients -->
            <div class="mb-4">
              <label for="to" class="form-label fw-semibold">
                <span class="label-icon"></span> Send to
              </label>
              <input
                id="to"
                class="form-control form-control-soft"
                type="text"
                v-model="to"
                readonly
                style="background-color: #f8f9fa; cursor: not-allowed;"
              />
              <small class="text-muted d-block mt-2">Your feedback will be sent to the Sheswell development team</small>
            </div>

            <!-- Subject -->
            <div class="mb-4">
              <label for="subject" class="form-label fw-semibold">
                <span class="label-icon"></span> Subject
              </label>
              <input
                id="subject"
                class="form-control form-control-soft"
                type="text"
                v-model="subject"
                placeholder="e.g. Bug report, Feature request, General feedback"
                :aria-invalid="!!subjectError"
              />
              <div v-if="subjectError" class="text-danger mt-2">{{ subjectError }}</div>
            </div>

            <!-- Message -->
            <div class="mb-4">
              <label class="form-label fw-semibold">
                <span class="label-icon"></span> Message
              </label>
              <div class="d-flex align-items-center gap-3 mb-2">
                <label class="d-inline-flex align-items-center gap-2">
                  <input type="checkbox" v-model="asHtml" />
                  <span>Send as HTML (recommended for better formatting)</span>
                </label>
              </div>
              <textarea
                class="form-control form-control-soft"
                rows="8"
                v-model="body"
                placeholder="Please describe your feedback, suggestions, or any issues you've encountered. The more details you provide, the better we can help!"
                :aria-invalid="!!bodyError"
              ></textarea>
              <div v-if="bodyError" class="text-danger mt-2">{{ bodyError }}</div>
            </div>

            <!-- Attachments -->
            <div class="mb-5">
              <label for="attachments" class="form-label fw-semibold">
                <span class="label-icon"></span> Attachments (optional)
              </label>
              <input
                id="attachments"
                class="form-control form-control-soft"
                type="file"
                multiple
                @change="onFileChange"
              />
              <small class="text-muted d-block mt-2">
                Selected:
                <template v-if="files.length">
                  {{ files.map(f => f.name).join(', ') }}
                </template>
                <template v-else>None</template>
              </small>
            </div>

            <!-- Buttons -->
            <div class="d-flex gap-3 justify-content-center">
              <button type="submit" class="btn btn-cta px-4 py-2" :disabled="loading">
                {{ loading ? 'Sending...' : 'Send Feedback' }}
              </button>
              <button type="button" class="btn btn-ghost px-4 py-2" @click="clearForm" :disabled="loading">
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-page { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
.email-card { background:#fff; border:0; border-radius:var(--radius); box-shadow:var(--shadow-soft); position:relative; overflow:hidden; }
.email-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px;
  background:linear-gradient(90deg, var(--c-peach), var(--c-lavender), var(--c-pink), var(--c-babyblue)); }
.email-header { position:relative; }
.macaron-dots { display:flex; justify-content:center; gap:8px; margin-bottom:1rem; }
.dot { width:12px; height:12px; border-radius:50%; box-shadow:var(--shadow-soft); }
.dot-peach { background: var(--c-peach); } .dot-lavender { background: var(--c-lavender); }
.dot-pink { background: var(--c-pink); } .dot-blue { background: var(--c-babyblue); }
.email-title { color:#2f3b52; font-weight:700; font-size:2.2rem; margin-bottom:.5rem;
  background:linear-gradient(135deg, var(--c-peach), var(--c-pink)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.email-subtitle { color:#6b7280; font-size:1.05rem; margin:0; }
.form-control-soft { border:2px solid #f1f5f9; border-radius:16px; padding:.875rem 1.25rem; font-size:1rem; transition:.3s ease; background:#fafafa; box-shadow:inset 0 2px 4px rgba(0,0,0,.05); }
.form-control-soft:focus { outline:none; border-color:var(--c-lavender); box-shadow: inset 0 2px 4px rgba(0,0,0,.05), 0 0 0 3px rgba(196,181,253,.1); background:#fff; }
.form-label { color:#374151; margin-bottom:.75rem; display:flex; align-items:center; gap:.5rem; font-weight:600; }
.btn-cta { background:linear-gradient(135deg, var(--c-peach), var(--c-pink)); color:#fff; border:0; border-radius:999px; padding:.875rem 2rem; box-shadow:var(--shadow-soft); font-weight:600; transition:.2s ease; }
.btn-cta:hover { transform:translateY(-2px); box-shadow:0 15px 35px rgba(0,0,0,.15); color:#fff; }
.btn-ghost { background:#fff; border:2px solid #e5e7eb; border-radius:999px; padding:.875rem 2rem; box-shadow:var(--shadow-soft); color:#6b7280; font-weight:600; transition:.2s ease; }
.btn-ghost:hover { transform:translateY(-2px); box-shadow:0 15px 35px rgba(0,0,0,.1); color:#374151; border-color:var(--c-lavender); }
.text-danger { font-size:.875rem; color:#dc2626; font-weight:500; }
.alert { border-radius:12px; padding:.75rem 1rem; margin-bottom:1rem; }
.alert-success { background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
.alert-danger { background:#fef2f2; color:#7f1d1d; border:1px solid #fecaca; }
@media (max-width: 768px) {
  .email-card { padding: 2rem !important; }
  .email-title { font-size: 1.8rem; }
}
</style>


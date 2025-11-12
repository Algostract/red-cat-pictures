<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { render } from '@vue-email/render'
import emailTemplate from '~~/server/emails'

const templateName = 'content' as const
const templateData = {
  fromCompanyName: 'RED CAT PICTURES',
  fromPersonName: 'RED CAT PICTURES',
  fromEmail: 'admin@shirsendu-bairagi.dev',
  fromCompanyLogo: 'https://redcatpictures.com/logo-dark.svg',
  fromCompanyPhone: '+91 93305 04883',
  fromCompanyLink: 'https://redcatpictures.com',
  emailSubject: 'test subject',
  toCompanyName: 'Test 2',
  toPersonName: 'Test',
  toEmail: 'test@gmail.com',
  // toProjectDescription: 'Test',
  // toMeetingTime: new Date().toISOString(),
  // toMeetingLink: 'test',
}

const emailHtml = await render(emailTemplate[templateName].template, templateData)
</script>

<template>
  <server-only>
    <div class="border p-4" v-html="emailHtml" />
  </server-only>
</template>

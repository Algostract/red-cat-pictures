export default async function (file: File) {
  const formData = new FormData()
  formData.append('UPLOADCARE_PUB_KEY', import.meta.env.UPLOADCARE_PUBLIC_KEY!)
  formData.append('UPLOADCARE_STORE', 'auto')
  formData.append('file', file)

  try {
    const response = await $fetch<{ file: string }>('/base/', {
      baseURL: 'https://upload.uploadcare.com',
      method: 'POST',
      body: formData,
    })

    return response
  } catch (error) {
    console.log(error)
    throw Error('Upload failed uploadcare')
  }
}

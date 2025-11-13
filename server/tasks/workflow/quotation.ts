import MarkdownIt from 'markdown-it'
import puppeteer from 'puppeteer'
import { NotionToMarkdown } from 'notion-to-md'

let n2m: NotionToMarkdown
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export function formatDate(dt: Date | string) {
  if (typeof dt === 'string') dt = new Date(dt)
  return dt.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export async function imageUrlToBase64(url: string): Promise<string> {
  const res = await $fetch.raw(url, { responseType: 'arrayBuffer' })
  const type = res.headers.get('content-type') || 'application/octet-stream'
  const ab = res._data as ArrayBuffer

  // Server (Node) path: use Buffer
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    const base64 = Buffer.from(ab).toString('base64')
    return `data:${type};base64,${base64}`
  }

  // Browser path: use FileReader for robust conversion
  const blob = new Blob([ab], { type })
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
  return dataUrl
}

/*  */
async function headerTemplate() {
  return `<section style="width:100%; font-size:16px; padding:0 0 0 0; display:block; text-align:center; font-family:system-ui;">
 <div style="margin:0 0 6mm 0;">
  <img 
    src="${await imageUrlToBase64('https://redcatpictures.com/logo-dark.svg')}"
    alt="RED CAT PICTURES Logo"
    style="height:64px; margin-right:14px; display:inline-block; vertical-align:middle;" />
  <span style="font-size:36px; font-weight:500; letter-spacing:0.5px; display:inline-block; vertical-align:middle;">
    RED CAT PICTURES
  </span>
</div>
  <div style="margin-bottom:8px;padding:0 12mm;">
    <span style="font-weight:600;">Registered Address:</span> 
    17, Netaji Subhash Road, Beltala, P.O.- Harinavi SO, P.S.- Sonarpur, District: South 24 Parganas, 
    Pincode: 700148, Ward No. 23
  </div>
  <div style="margin-bottom:6px;">
    Email: <a href="mailto:contact@redcatpictures.com" style="color:#1565C0; text-decoration:underline;">contact@redcatpictures.com</a>
    &nbsp;&nbsp;
    Phone: +918910489578
  </div>
  <div>
    Website: <a href="https://redcatpictures.com" style="color:#1565C0; text-decoration:underline;">https://redcatpictures.com</a>
  </div>
</section>`
}

async function footerTemplate() {
  return `
  <section style="position:relative; width:100%; font-size:14px; padding:0 20mm 4mm 20mm; display:flex; justify-content:space-between; align-items:center;">
    <img
      src="${await imageUrlToBase64('https://redcatpictures.com/logo-dark.svg')}"
      alt="RED CAT PICTURES Logo"
      style="
        position:absolute;
        right:0;
        top:0;
        transform: translateX(15%) translateY(-60%);
        opacity:0.1;
        width:300px;
        pointer-events:none;
        user-select:none;
      "
    />
    <span>
      <span style="font-size:14px; font-weight:bold">Signature: ______________________</span>
    </span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    <style>
      @media (min-width: 768px) {
        section > img[alt="RED CAT PICTURES Logo"] {
          left: -104px;
          transform: translateY(-37%);
          width: 560px;
        }
      }
    </style>
  </section>`
}

async function wrapHtml(html: string, title: string) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      @page { margin: 12mm 18mm 28mm 18mm; size: A4; }
      body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; color: #222; }
      table { border-collapse: collapse; width: 100%; margin: 2em 0; }
      th, td { border: 1px solid #bbb; padding: 7px 10px; }
      th { background: #f3f3f3; }
      h1, h2 {
        text-align: center;
        margin: auto;
        margin-top: 1.2em;
      }
      h3, h4, h5, h6, li {
        text-align: left;
        margin-top: 0.6em;
      }
      .page-break { 
        page-break-before: always; break-before: page; 
      }
      table:last-of-type {
        border-collapse: separate;
        border-spacing: 0 22px;
        width: 100%;
      }
      table:last-of-type th,
      table:last-of-type td {
        width: 50%;
        border: none !important;
        padding: 9px 10px;
        font-size: 15px;
        text-align: left;
      }
    </style>
  </head>
  <body>
    ${await headerTemplate()}
    ${html}
  </body>
  </html>`
}

async function createDocument({
  termsMarkdown,
  budgetMarkdown,
  projectDetails,
  clientDetails,
}: {
  termsMarkdown: string
  budgetMarkdown: string
  clientDetails: {
    name: string
    address: string
    phone: string
    email: string
  }
  projectDetails: {
    quoteNumber: string
    quoteDate: string
    quoteExpiry: string
    shootDate: string
    shootLocation: string
  }
}) {
  const mdContent = `
## Photography & Videography Quotation

**Client Name:** ${clientDetails.name}  
**Client Address:** ${clientDetails.address}  
**Client Phone No:** ${clientDetails.phone.toString()}  
**Client Email:** [${clientDetails.email}](mailto:${clientDetails.email})

**Quote Number:** ${projectDetails.quoteNumber}  
**Quote Date:** ${projectDetails.quoteDate}  
**Quote Expiry:** ${projectDetails.quoteExpiry}

**Shoot Date:** ${projectDetails.shootDate}  
**Shoot Location:** ${projectDetails.shootLocation}

## Scope of Work
${budgetMarkdown}

***

## Terms & Conditions
${termsMarkdown}

***

## Acceptance of Quotation

<br>

I, _____________________________, accept the quotation and agree to the terms and conditions stated above.

| For RED CAT PICTURES    | For Client              |
| ------------------------| ----------------------- |
| Signature:              | Signature:              |
| Name:                   | Name:                   |
| Date:                   | Date:                   |
| Place:                  | Place:                  |


_N.B: This Letter consists of 5 pages including this one. Please sign on all pages._
`
  // Markdown → HTML
  const html = md.render(mdContent)
  const pageHtml = await wrapHtml(html.replace(/\n<hr>\n/g, '<div class="page-break"></div>'), `${projectDetails.quoteNumber}.pdf`)

  let pdfBuffer: Uint8Array<ArrayBufferLike>
  let browser

  try {
    if (import.meta.env.NODE_ENV === 'production') {
      browser = await puppeteer.connect({
        browserWSEndpoint: import.meta.env.BROWSER_ENDPOINT,
      })
    } else {
      browser = await puppeteer.launch({
        headless: true,
      })
    }

    const page = await browser.newPage()
    await page.setContent(pageHtml, { waitUntil: 'networkidle0' })

    pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: await footerTemplate(),
      margin: { top: '28mm', right: '15mm', bottom: '28mm', left: '15mm' },
    })
  } catch (error) {
    console.error('Failed to generate PDF:', error)
  } finally {
    if (browser) {
      if (import.meta.env.NODE_ENV === 'production') {
        await browser.disconnect()
      } else {
        await browser.close()
      }
    }
  }

  return { fileName: `${projectDetails.quoteNumber}.pdf`, fileBuffer: pdfBuffer }
}
/*  */

/*  */
type Recipient = {
  name: string
  email: string
  role: 'CC' | 'SIGNER' | 'VIEWER' | 'APPROVER' | 'ASSISTANT' // use SIGNER for signing
  signingOrder: number
}

type Field = {
  type: 'SIGNATURE' | 'NAME' | 'TEXT' | 'DATE'
  page: number
  x: number
  y: number
  width: number
  height: number
  recipient: string // recipient email
  label?: string
  required?: boolean
  fieldMeta?: unknown
}

/* async function getAllDocuments() {
  const config = useRuntimeConfig()
  const { documensoApi, documensoApiKey } = config.private

  const res = await $fetch<{
    documents: {
      id: number;
      externalId: string;
      userId: number;
      teamId: number;
      title: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      completedAt: string;
    }[];
    totalPages: number;
  }
  >('/documents', {
    baseURL: documensoApi,
    headers: {
      Authorization: `Bearer ${documensoApiKey}`
    }
  });

  if (!res.documents) throw new Error('No documents found');
  return res.documents;
}

async function getDocument(documentId: number | string) {
  const config = useRuntimeConfig()
  const { documensoApi, documensoApiKey } = config.private

  return $fetch(`/documents/${documentId}`, {
    baseURL: documensoApi,
    headers: {
      Authorization: `Bearer ${documensoApiKey}`
    }
  });
} */

interface DocumentField {
  recipientId: number
  type: string
  pageNumber: number
  pageX: number
  pageY: number
  pageWidth: number
  pageHeight: number
}

export async function sendDocument({
  title,
  pdfBuffer,
  recipients,
  fields,
  meta = {},
}: {
  title: string
  pdfBuffer: Buffer | ArrayBuffer | Uint8Array
  recipients: Recipient[]
  fields: Field[]
  meta?: Record<string, unknown>
}) {
  const config = useRuntimeConfig()
  const { documensoApi, documensoApiKey } = config.private

  const {
    uploadUrl,
    documentId,
    recipients: recipientsDetails,
  } = await $fetch<{
    uploadUrl: string
    documentId: number
    recipients: {
      recipientId: number
      name: string
      email: string
      token: string
      role: string
      signingOrder: null
      signingUrl: string
    }[]
  }>('/documents', {
    baseURL: documensoApi,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${documensoApiKey}`,
    },
    body: {
      title,
      recipients,
      ...meta,
    },
  })

  await $fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/pdf',
    },
    body: pdfBuffer,
  })

  // 3. Define signing fields using the fields API
  await $fetch(`/documents/${documentId}/fields`, {
    baseURL: documensoApi,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${documensoApiKey}`,
    },
    body: fields.map<DocumentField>(({ recipient, type, page, x, y, width, height, fieldMeta }) => ({
      recipientId: recipientsDetails.find((r) => r.email === recipient)!.recipientId,
      type,
      pageNumber: page,
      pageX: x,
      pageY: y,
      pageWidth: width,
      pageHeight: height,
      fieldMeta,
    })),
  })

  // 4. Send invitation if not automatic in your instance
  await $fetch(`${documensoApi}/documents/${documentId}/send`, {
    baseURL: documensoApi,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${documensoApiKey}`,
    },
    body: {
      sendEmail: true,
      sendCompletionEmails: true,
    },
  })

  return { documentId }
}
/*  */

export default defineTask({
  meta: {
    name: 'workflow:quotation',
    description: 'Create quotation from CMS',
  },
  async run() {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB

    const today = new Date()
    const expiry = new Date(today)
    expiry.setDate(expiry.getDate() + 29)

    n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })

    const projectStorage = useStorage<Resource<'project'>>(`data:resource:project`)

    await Promise.allSettled(
      (await projectStorage.getItems(await projectStorage.getKeys())).map(async ({ value: project }) => {
        const projectId = project.record.id
        const status = project.record.properties.Status.status.name

        if (!(status === 'Quotation')) return

        console.log('✅ Quotation Started:', notionTextStringify(project.record.properties.Name.title))

        const client = (await notion.pages.retrieve({ page_id: project.record.properties.Client.relation[0].id })) as unknown as NotionProjectClient

        const redcatpicturesDetails = {
          name: 'Aratrik Nandy',
          email: 'ceo@redcatpictures.com',
        }
        const clientDetails = {
          name: notionTextStringify(client.properties.Company.rich_text),
          address: notionTextStringify(client.properties.Address.rich_text),
          phone: client.properties.Phone?.phone_number,
          email: import.meta.env.NODE_ENV === 'production' ? client.properties.Email.email : 'redcatpictures24@gmail.com',
        }
        const projectDetails = {
          quoteNumber: `RCP-Q-${project.record.properties.Index.number}-${project.record.properties.Quotation.number}`,
          quoteDate: formatDate(today),
          quoteExpiry: formatDate(expiry),
          shootDate: formatDate(project.record.properties.Date.date.start),
          shootLocation: notionTextStringify(project.record.properties.Address.rich_text),
        }

        const termsUpdateDate = ((await notion.pages.retrieve({ page_id: notionDbId.terms })) as unknown as NotionAsset).last_edited_time
        const termsMarkdown = `**Last Updated**: ${formatDate(termsUpdateDate)}\n` + (await convertNotionPageToMarkdown(n2m, notionDbId.terms, false))
        const budgetMarkdown = (await convertNotionPageToMarkdown(n2m, projectId, false)).split('\n---\n')[0]

        console.log('📥 Quotation Details Fetched', { clientDetails, projectDetails })

        const pdf = await createDocument({
          termsMarkdown,
          budgetMarkdown,
          clientDetails,
          projectDetails,
        })

        console.log('📄 Quotation Created:', pdf.fileName)

        // const documentStorage = useStorage('fs')
        // await documentStorage.setItemRaw(`documents/${pdf.fileName}`, pdf.fileBuffer)

        // const doc = (await getAllDocuments())[0];
        // const meta = await getDocument(doc.id);

        await sendDocument({
          title: pdf.fileName,
          recipients: [
            { name: clientDetails.name, email: clientDetails.email, role: 'SIGNER', signingOrder: 1 },
            { name: redcatpicturesDetails.name, email: redcatpicturesDetails.email, role: 'SIGNER', signingOrder: 2 },
          ],
          pdfBuffer: pdf.fileBuffer,
          fields: [
            { type: 'SIGNATURE', page: 1, x: 18.7, y: 91.3, width: 21.3, height: 5.3, recipient: clientDetails.email },
            { type: 'SIGNATURE', page: 2, x: 18.7, y: 91.3, width: 21.3, height: 5.3, recipient: clientDetails.email },
            { type: 'SIGNATURE', page: 3, x: 18.7, y: 91.3, width: 21.3, height: 5.3, recipient: clientDetails.email },
            { type: 'SIGNATURE', page: 4, x: 18.7, y: 91.3, width: 21.3, height: 5.3, recipient: clientDetails.email },
            { type: 'NAME', page: 5, x: 11.06, y: 9.1, width: 21.3, height: 4, recipient: clientDetails.email },
            { type: 'SIGNATURE', page: 5, x: 61, y: 22.6, width: 21.3, height: 4, recipient: clientDetails.email },
            { type: 'NAME', page: 5, x: 61, y: 28.47, width: 21.3, height: 4, recipient: clientDetails.email },
            { type: 'DATE', page: 5, x: 61, y: 34.33, width: 21.3, height: 4, recipient: clientDetails.email },
            {
              type: 'TEXT',
              page: 5,
              x: 61,
              y: 40.2,
              width: 21.3,
              height: 4,
              recipient: clientDetails.email,
              fieldMeta: {
                label: 'Place',
                required: true,
                readOnly: false,
                type: 'text',
                fontSize: 12,
                textAlign: 'left',
              },
            },
            { type: 'SIGNATURE', page: 5, x: 21, y: 22.6, width: 21.3, height: 4, recipient: redcatpicturesDetails.email },
            { type: 'NAME', page: 5, x: 21, y: 28.47, width: 21.3, height: 4, recipient: redcatpicturesDetails.email },
            { type: 'DATE', page: 5, x: 21, y: 34.33, width: 21.3, height: 4, recipient: redcatpicturesDetails.email },
            {
              type: 'TEXT',
              page: 5,
              x: 21,
              y: 40.2,
              width: 21.3,
              height: 4,
              recipient: redcatpicturesDetails.email,
              fieldMeta: {
                label: 'Place',
                required: true,
                readOnly: false,
                type: 'text',
                fontSize: 12,
                textAlign: 'left',
              },
            },
          ],
          meta: {
            subject: 'RED CAT PICTURES Quotation',
            message: 'Please review and sign',
            timezone: 'Asia/Kolkata',
            dateFormat: 'MMMM dd, yyyy hh:mm a',
            signingOrder: 'SEQUENTIAL',
            redirectUrl: '',
            language: 'en',
            typedSignatureEnabled: false,
            drawSignatureEnabled: false,
            distributionMethod: 'EMAIL',
          },
        })

        await notion.pages.update({
          page_id: projectId,
          properties: {
            Status: {
              status: {
                name: 'Shoot',
              },
            },
          },
        })

        console.log('📤 Quotation Sent')

        project.record.properties.Status.status.name = 'Shoot'
        await projectStorage.setItem(normalizeNotionId(projectId), project)
      })
    )

    return { result: 'success' }
  },
})

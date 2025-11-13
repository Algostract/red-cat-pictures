import { NotionToMarkdown } from 'notion-to-md'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const termsPageId = (config.private.notionDbId as unknown as NotionDB).terms
  const privacyPageId = (config.private.notionDbId as unknown as NotionDB).privacy
  const cancellationPageId = (config.private.notionDbId as unknown as NotionDB).cancellation

  const n2m = new NotionToMarkdown({ notionClient: notion })

  const termsContent = (await notion.pages.retrieve({ page_id: termsPageId })) as unknown as NotionContent
  const termsLastUpdated = termsContent.last_edited_time
  const termsMarkdown = await convertNotionPageToMarkdown(n2m, termsPageId, true)

  const privacyContent = (await notion.pages.retrieve({ page_id: privacyPageId })) as unknown as NotionContent
  const privacyLastUpdated = privacyContent.last_edited_time
  const privacyMarkdown = await convertNotionPageToMarkdown(n2m, privacyPageId, true)

  const cancellationContent = (await notion.pages.retrieve({ page_id: cancellationPageId })) as unknown as NotionContent
  const cancellationLastUpdated = cancellationContent.last_edited_time
  const cancellationMarkdown = await convertNotionPageToMarkdown(n2m, cancellationPageId, true)

  // 2aa15a2f8cf08078aed3e366abed2bc0

  return {
    terms: {
      content: termsMarkdown,
      lastUpdated: termsLastUpdated,
    },
    privacy: {
      content: privacyMarkdown,
      lastUpdated: privacyLastUpdated,
    },
    cancellation: {
      content: cancellationMarkdown,
      lastUpdated: cancellationLastUpdated,
    },
  }
})

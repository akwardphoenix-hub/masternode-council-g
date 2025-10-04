import { Page, test } from '@playwright/test'

// Pull indexUrl from config metadata
export function indexUrl(): string {
  // @ts-ignore
  const meta = test.info().config.metadata || {}
  return meta.indexUrl as string
}

// Basic guard to block accidental external fetches during E2E
export async function blockExternal(page: Page) {
  await page.route('**/*', (route) => {
    const url = route.request().url()
    const isLocalFile = url.startsWith('file://')
    const isLocalhost = url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')
    const isAsset = /\.(js|css|png|svg|ico|json|map)(\?.*)?$/.test(url)

    if (isLocalFile || isLocalhost || isAsset) return route.continue()
    return route.fulfill({ status: 204 })
  })
}

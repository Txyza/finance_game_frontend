import { FC, useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
}

const DEFAULT_TITLE = 'Cash-lvl - Образовательная финансовая игра'
const DEFAULT_DESCRIPTION = 'Cash-lvl - уникальная игра, которая научит вас взаимодействовать с финансовыми инструментами через ключевую ставку и инфляцию. Управляйте бюджетом, инвестируйте и достигайте финансовой независимости!'
const DEFAULT_KEYWORDS = 'финансовая игра, обучение финансам, ключевая ставка, инфляция, банковские продукты, вклады, кредиты, ипотека, управление бюджетом, cash-lvl, финансовая грамотность'
const DEFAULT_OG_IMAGE = 'https://cash-lvl.ru/og-image.png'

export const SEO: FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonicalUrl
}) => {
  useEffect(() => {
    // Update title
    document.title = title

    // Update or create meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: 'Cash-lvl' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
      { name: 'author', content: 'Cash-lvl Team' },
      { name: 'robots', content: 'index, follow' }
    ]

    metaTags.forEach(({ name, property, content }) => {
      const attribute = name ? 'name' : 'property'
      const attributeValue = name || property
      let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`)

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, attributeValue!)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    })

    // Update or create canonical link
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]')
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.setAttribute('href', canonicalUrl)
    }

    // Add structured data for SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Cash-lvl',
      'description': description,
      'url': 'https://cash-lvl.ru',
      'applicationCategory': 'GameApplication',
      'genre': 'Educational',
      'educationalUse': 'Financial Literacy',
      'inLanguage': 'ru',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'RUB'
      }
    }

    let scriptTag = document.querySelector('script[type="application/ld+json"]')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.setAttribute('type', 'application/ld+json')
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(structuredData)

    return () => {
      // Cleanup is optional since we want meta tags to persist
    }
  }, [title, description, keywords, ogImage, ogType, canonicalUrl])

  return null
}
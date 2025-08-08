import React from 'react'
import type { HomeBannerBlock as HomeBannerBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import './styles.scss'

export const HomeBannerBlock: React.FC<HomeBannerBlockProps> = (props) => {
  const { title, content } = props

  return (
    <section className="home-banner">
      <div className="container">
        <div className="home-banner__text">
          <h2 className="home-banner__title">{title}</h2>
          {content && <RichText data={content} />}
        </div>
      </div>
    </section>
  )
}

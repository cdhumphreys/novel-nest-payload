import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { HomeBannerBlock } from '@/blocks/HomeBannerBlock/Component'

const blockComponents = {
  homeBannerBlock: HomeBannerBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['blocks'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}

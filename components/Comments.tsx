'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  // Comments are loaded automatically
  if (!siteMetadata.comments?.provider) {
    return null
  }
  return (
    <>
      <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
    </>
  )
}

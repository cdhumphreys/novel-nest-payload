import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

type NodeTypes = DefaultNodeTypes

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string => {
  // Value contains the default populated fields of the document
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }

  if (relationTo === 'pages') {
    // For pages, use the fullBreadcrumbUrl directly (it already includes the leading slash)
    // or construct from slug if fullBreadcrumbUrl is not available
    return (value.fullBreadcrumbUrl as string) || `/${value.slug}`
  }

  // For other collections, use slug-based URL
  return `/${value.slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  // blocks: {
  //   banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
  //   mediaBlock: ({ node }) => (
  //     <MediaBlock
  //       className="col-start-1 col-span-3"
  //       imgClassName="m-0"
  //       {...node.fields}
  //       captionClassName="mx-auto max-w-[48rem]"
  //       enableGutter={false}
  //       disableInnerContainer={true}
  //     />
  //   ),
  //   code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
  //   cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  // },
})

type Props = {
  data: DefaultTypedEditorState
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, ...rest } = props
  return <ConvertRichText converters={jsxConverters} className={className} {...rest} />
}


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



type NodeTypes =
  | DefaultNodeTypes

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
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
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={className}
      {...rest}
    />
  )
}
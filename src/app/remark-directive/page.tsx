export default function RemarkDirective() {
  const markdownStr = `
  ## 给你看看 AI 带货是什么样的
  :::div{.content-wrapper}
  ::div[这里是正常的文字，可能是有 AI 生成的，吧啦吧啦吧啦吧啦一大堆哦；这里是正常的文字，可能是有 AI 生成的，吧啦吧啦吧啦吧啦一大堆哦；这里是正常的文字，可能是有 AI 生成的，吧啦吧啦吧啦吧啦一大堆哦；]{.text}
  :::div{.ad-container}
  ::img{.image src="./images/6.jpg"}
  :::div{.content-container}
  ::div[米娜桑孔你七哇]{.ad-title}
  ::div[嘿嘿嘿嘿嘿嘿，一起加入吧～]{.ad-content}
  ::div[广告]{.ad-icon}
  :::
`
  return (
    <div className="h-screen flex">
      <div className="flex-1 border h-full">{markdownStr}</div>
      <div className="flex-1">2</div>
    </div>
  )
}

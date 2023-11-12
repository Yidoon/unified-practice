"use client"
import { useEffect, useState } from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

function myPlugin() {
  return function (tree) {
    console.log(tree, "tree")
  }
}

function hPlugin() {
  return function (tree) {
    console.log(tree, "tree")
  }
}

function useProcessor(text: string) {
  const [parseContent, setParseContent] = useState("")
  console.log(text, "ttt")

  async function fn() {
    if (!text) return
    const processser = unified()
      .use(myPlugin)
      .use(remarkParse)
      .use(remarkRehype)
      .use(hPlugin)
      .use(rehypeStringify)
    const res = await processser.process(text)
    console.log(res.toString(), "resss")
  }

  useEffect(() => {
    fn()
  }, [text, fn])

  return parseContent
}
export default function Unist() {
  const [mdStr, setMdStr] = useState("")

  const parseContent = useProcessor(mdStr)

  const handleMdStr = (e) => {
    setMdStr(e.target.value)
  }

  return (
    <div className="flex h-screen gap-6">
      <textarea
        className="h-5/6 flex-1 box-border"
        autoFocus
        value={mdStr}
        onChange={handleMdStr}
        style={{ outline: "none" }}
      />
      <div
        className="h-5/6 flex-1 box-border border"
        style={{ border: "1px solid black" }}
      >
        {parseContent}
      </div>
    </div>
  )
}

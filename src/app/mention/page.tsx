"use client"

import { useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { unified } from "unified"
import remarkRehype from "remark-rehype"
import remarkParse from "remark-parse"
import { findAndReplace as mFindAndReplace } from "mdast-util-find-and-replace"
import { findAndReplace as HFindAndReplace } from "hast-util-find-and-replace"
import { useEffect } from "react"
import * as prod from "react/jsx-runtime"
import { u } from "unist-builder"
import rehypeStringify from "rehype-stringify"
import remarkStringify from "remark-stringify"
import { h } from "hastscript"
import { Card, Popover } from "antd"
import { useMemo } from "react"

function decodeEntities(encodedStr) {
  const textarea = document.createElement("textarea")
  textarea.innerHTML = encodedStr
  return textarea.value
}

function Ad(props: any) {
  const { href } = props

  const regex = /type=([^&]*)|platform=([^&]*)|description=([^&]*)/g

  let match
  const params = {}

  while ((match = regex.exec(href))) {
    const key = match[0].split("=")[0]
    const value = match[0].split("=")[1]
    params[key] = value
  }

  console.log(params.type) // 输出 "ad"
  console.log(params.platform) // 输出 "jd"
  console.log(params.description) // 输出 "这个真的绝绝子"

  return (
    <Card title={`这是来自 ${params.platform} 的广告`} style={{ width: 300 }}>
      <a href="https://item.jd.com/100068388451.html?bbtf=1">
        <img
          style={{ width: 120, height: 120 }}
          src="https://img11.360buyimg.com/n1/s450x450_jfs/t1/191924/40/41885/60758/654cd349Fb2f1c038/852ef839fbe67bce.jpg.avif"
          alt=""
          target="_blank"
        />
        <p>{params.description}</p>
      </a>
    </Card>
  )
}
function User(props: any) {
  const href = props.href
  const user = href.split("=")[1]
  return (
    <div className=" text-green-600 cursor-pointer">
      <Popover content={user} title="Hi~">
        {user}
      </Popover>
    </div>
  )
}

function Link(props: any) {
  const href = decodeEntities(decodeURIComponent(props.href))
  console.log(props.href, "props")
  console.log(href, "href")

  const type = useMemo(() => {
    const regex = /#(\w+)?/
    const match = regex.exec(href)
    return match[1]
  }, [href])

  if (type === "ad") {
    return <Ad {...props} href={href} />
  }

  if (type === "user") {
    return <User {...props} href={href} />
  }

  return <a {...props} href={href}></a>
}

function mPlugin() {
  return function (tree) {
    mFindAndReplace(tree, [
      [
        /@(\S+)/g,
        function ($0) {
          const name = $0.split("@")[1]
          return u("link", { url: "#user?name=" + $0 }, [u("text", $0)])
        },
      ],
      [
        /:::(?<type>\w+)\?(?<params>[^\n]+)\n(?<description>[\s\S]+?)\n:::/g,
        function (...parameters) {
          const [_match, type, params, description] = parameters
          console.log(_match, "_match")
          console.log(type, "type")
          console.log(params, "params")
          console.log(description, "description")

          return u(
            "link",
            { url: `#ad?type=${type}&${params}&description=${description}` },
            [u("text", "sss")]
          )
        },
      ],
    ])
  }
}
function hPlugin() {
  return function (tree) {
    HFindAndReplace(tree, [
      [
        /@Jack/g,
        function ($0) {
          const name = $0.split("@")[1]
          console.log(name, "name")
          return h("a", { href: "//example.com#" + $0 }, $0)
        },
      ],
      [
        /:::(?<type>\w+)\?(?<params>[^\n]+)\n(?<description>[\s\S]+?)\n:::/g,
        function ($0) {
          return h("text", "<LimitAd />")
        },
      ],
    ])
  }
}

function useProcessor(text) {
  const [content, setContent] = useState("")
  const [mdContent, setMdContent] = useState("")

  useEffect(
    function () {
      ;(async function () {
        if (!text) return
        const p1 = unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(hPlugin)
          .use(rehypeStringify)
        const htmlRes = await p1.process(text)
        setContent(htmlRes.value.toString())

        const p2 = unified().use(remarkParse).use(mPlugin).use(remarkStringify)
        const p2Res = await p2.process(text)
        setMdContent(p2Res.value.toString())
      })()
    },
    [text]
  )

  return {
    content,
    mdContent,
  }
}
const initialMdStr = `
# 接下来你要看到的是来自 Limit精心给你挑选的广告
这个广告很大你一定要完
下面这位是本次的金主爸爸 👇

@JD

下面请欣赏金主爸爸带来的广告 👇

:::ad?platform=jd
这个真的绝绝子, 点击就可以进入购买哦～
:::
`

export default function Mention() {
  const [mdStr, setMdStr] = useState(initialMdStr)

  const { content, mdContent } = useProcessor(mdStr)
  const handleEditorChange = (e) => {
    setMdStr(e.target.value)
  }
  return (
    <div
      className="flex h-screen gap-4 overflow-hidden p-6"
      style={{ overflow: "hidden" }}
    >
      {/* markdown editor */}
      <div className=" h-5/6 flex-1 flex flex-col">
        <h2>Markdown editor</h2>
        <textarea
          className="w-full h-full flex-1 p-4 box-border"
          autoFocus
          value={mdStr}
          onChange={handleEditorChange}
          style={{ outline: "none" }}
        />
      </div>

      {/* react-markdown */}
      <div className="h-5/6 flex-1 overflow-y-auto overflow-x-hidden flex flex-col p-1">
        <h2>Markdown preview</h2>

        <div
          className="w-full h-full flex-1"
          style={{ border: "1px solid black" }}
        >
          <Markdown components={{ a: Link }} className="p-4">
            {mdContent}
          </Markdown>
        </div>
      </div>

      {/* markdown to html */}
      <div className="  h-5/6 border flex-1 flex flex-col">
        <h2>Markdown to html</h2>
        <div
          className="flex-1 p-4"
          style={{ border: "1px solid black" }}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </div>
  )
}

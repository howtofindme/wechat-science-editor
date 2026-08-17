import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"研排 ResearchPress｜微信公众号一键排版工具",description:"面向科研作者的本地优先 Markdown 微信公众号排版与富文本复制工具。",other:{"codex-preview":"development"},icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>}

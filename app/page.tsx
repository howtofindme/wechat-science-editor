"use client";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";

type ThemeKey = "academic" | "nature" | "cell" | "ink";
const themes: Record<ThemeKey,{name:string;color:string;soft:string;dark:string}> = {
  academic:{name:"学术蓝",color:"#1769aa",soft:"#eef6fc",dark:"#123c5a"},
  nature:{name:"Nature 绿",color:"#25845b",soft:"#eef8f2",dark:"#174f39"},
  cell:{name:"期刊红",color:"#b9414a",soft:"#fff1f2",dark:"#6d2930"},
  ink:{name:"水墨黑",color:"#343434",soft:"#f4f3ef",dark:"#181818"},
};
const sample=`# 巨噬细胞如何重塑纤维化微环境？

> **导读**：单细胞与空间组学正在把“细胞有哪些”推进到“细胞在哪里、如何交流、是否构成因果”。这份示例展示科研公众号常用版式。

## 一个值得重新审视的问题

组织纤维化并非单一细胞失控，而是免疫细胞、基质细胞与局部力学环境共同驱动的动态过程。尤其值得关注的是，单核细胞来源巨噬细胞（MoAM）可能通过 **SPP1–Integrin** 等信号持续塑造成纤维细胞状态。

### 核心发现

1. 疾病组织中出现具有空间偏好的巨噬细胞亚群；
2. 配体–受体分析提示巨噬细胞与成纤维细胞存在定向通信；
3. 干预候选轴后，胶原沉积和肌成纤维细胞活化下降。

| 证据层级 | 推荐方法 | 能回答的问题 |
| --- | --- | --- |
| 描述 | scRNA-seq | 哪些细胞状态发生变化？ |
| 空间 | Spatial transcriptomics | 细胞是否真正邻近？ |
| 因果 | 条件敲除 / 阻断抗体 | 该信号是否必需？ |

## 如何把相关性推进到因果性？

作者需要避免只依赖通信算法评分。更稳妥的证据链应包括：**空间共定位 → 受体激活 → 细胞特异性干预 → 表型救援**。

> 研究提示：算法生成的是候选机制，而不是机制本身。真正的创新，往往来自对候选轴进行可证伪的实验设计。

### 可复用的实验框架

\`\`\`text
临床样本发现 → 动物模型复现 → 空间定位
→ 细胞特异性干预 → 体外互作验证 → 临床回证
\`\`\`

---

**结语**：一篇好的科研推文，不只是复述结果，还应帮助读者判断证据边界，并把发现转化为下一步可执行的问题。`;

const esc=(v:string)=>v.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
function inline(s:string){let o=esc(s);o=o.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<figure><img src="$2" alt="$1"><figcaption>$1</figcaption></figure>');o=o.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,"<code>$1</code>");return o}
function md(source:string){const lines=source.replace(/\r/g,"").split("\n"),out:string[]=[];let list:"ul"|"ol"|null=null,quote:string[]=[],code:string[]|null=null,table:string[][]=[];
 const closeList=()=>{if(list)out.push(`</${list}>`);list=null};const closeQuote=()=>{if(quote.length)out.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);quote=[]};
 const closeTable=()=>{if(!table.length)return;const rows=table.filter((_,i)=>i!==1);out.push(`<div class="table-wrap"><table><thead><tr>${rows[0].map(c=>`<th>${inline(c.trim())}</th>`).join("")}</tr></thead><tbody>${rows.slice(1).map(r=>`<tr>${r.map(c=>`<td>${inline(c.trim())}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);table=[]};const flush=()=>{closeList();closeQuote();closeTable()};
 for(const raw of lines){if(raw.trim().startsWith("```")){flush();if(code===null)code=[];else{out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);code=null}continue}if(code!==null){code.push(raw);continue}if(/^\|.*\|$/.test(raw.trim())){closeList();closeQuote();table.push(raw.trim().slice(1,-1).split("|"));continue}closeTable();const h=raw.match(/^(#{1,4})\s+(.+)/),b=raw.match(/^[-*]\s+(.+)/),n=raw.match(/^\d+\.\s+(.+)/);if(h){flush();out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`)}else if(raw.startsWith("> ")){closeList();quote.push(raw.slice(2))}else if(b||n){closeQuote();const wanted=b?"ul":"ol";if(list!==wanted){closeList();list=wanted;out.push(`<${wanted}>`)}out.push(`<li>${inline((b||n)![1])}</li>`)}else if(/^---+$/.test(raw.trim())){flush();out.push("<hr>")}else if(!raw.trim())flush();else{flush();out.push(`<p>${inline(raw)}</p>`)}}flush();if(code!==null)out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);return out.join("")}
function styled(root:HTMLElement){const clone=root.cloneNode(true) as HTMLElement,s=[root,...Array.from(root.querySelectorAll<HTMLElement>("*"))],t=[clone,...Array.from(clone.querySelectorAll<HTMLElement>("*"))],keep=["color","background-color","font-size","font-weight","font-style","font-family","line-height","letter-spacing","text-align","text-decoration","border","border-left","border-radius","padding","margin","margin-top","margin-bottom","width","max-width","display","word-break","white-space","overflow-x"];s.forEach((e,i)=>{const c=getComputedStyle(e);t[i].setAttribute("style",keep.map(k=>`${k}:${c.getPropertyValue(k)}`).join(";"));t[i].removeAttribute("class")});return clone.innerHTML}

export default function Home(){const [text,setText]=useState(sample),[theme,setTheme]=useState<ThemeKey>("academic"),[notice,setNotice]=useState("内容仅保存在本机浏览器"),[tab,setTab]=useState<"edit"|"preview">("edit");const preview=useRef<HTMLElement>(null),fileRef=useRef<HTMLInputElement>(null),imageRef=useRef<HTMLInputElement>(null),html=useMemo(()=>md(text),[text]),words=text.replace(/[#>*`|\-\s]/g,"").length;
 useEffect(()=>{const s=localStorage.getItem("researchpress-draft");if(s)setText(s)},[]);useEffect(()=>{const x=setTimeout(()=>localStorage.setItem("researchpress-draft",text),350);return()=>clearTimeout(x)},[text]);
 const addImage=(f?:File)=>{if(!f?.type.startsWith("image/"))return;const r=new FileReader();r.onload=()=>{setText(v=>`${v}\n\n![请填写图注](${r.result})\n`);setNotice("图片已插入草稿")};r.readAsDataURL(f)};
 const importMd=(e:ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{setText(String(r.result||""));setNotice(`已导入 ${f.name}`)};r.readAsText(f)};
 const drop=(e:DragEvent<HTMLDivElement>)=>{e.preventDefault();addImage(e.dataTransfer.files?.[0])};
 const copy=async()=>{if(!preview.current)return;try{const rich=styled(preview.current);await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([rich],{type:"text/html"}),"text/plain":new Blob([preview.current.innerText],{type:"text/plain"})})]);setNotice("已复制富文本，可直接粘贴到公众号编辑器")}catch{const r=document.createRange();r.selectNodeContents(preview.current);const s=getSelection();s?.removeAllRanges();s?.addRange(r);document.execCommand("copy");s?.removeAllRanges();setNotice("已复制，请粘贴到公众号编辑器")}};
 const download=()=>{const b=new Blob([text],{type:"text/markdown;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="科研推文草稿.md";a.click();URL.revokeObjectURL(a.href)};
 return <main className="app-shell" style={{"--accent":themes[theme].color,"--soft":themes[theme].soft,"--deep":themes[theme].dark} as React.CSSProperties}>
  <header className="topbar"><div className="brand"><span className="brand-mark">研</span><div><strong>研排 ResearchPress</strong><small>科研人的微信公众号一键排版工具</small></div></div><div className="actions"><label className="theme-select"><span>主题</span><select value={theme} onChange={e=>setTheme(e.target.value as ThemeKey)}>{Object.entries(themes).map(([k,v])=><option value={k} key={k}>{v.name}</option>)}</select></label><button className="ghost" onClick={()=>fileRef.current?.click()}>导入 .md</button><button className="ghost" onClick={download}>导出草稿</button><button className="primary" onClick={copy}>一键复制到公众号</button></div><input ref={fileRef} hidden type="file" accept=".md,.txt" onChange={importMd}/><input ref={imageRef} hidden type="file" accept="image/*" onChange={e=>addImage(e.target.files?.[0])}/></header>
  <div className="statusbar"><span className="live-dot"/>{notice}<span className="stats">约 {words} 字 · {Math.max(1,Math.ceil(words/500))} 分钟阅读</span></div>
  <nav className="mobile-tabs"><button className={tab==="edit"?"active":""} onClick={()=>setTab("edit")}>编辑</button><button className={tab==="preview"?"active":""} onClick={()=>setTab("preview")}>预览</button></nav>
  <section className="workspace"><div className={`pane editor-pane ${tab!=="edit"?"mobile-hidden":""}`} onDragOver={e=>e.preventDefault()} onDrop={drop}><div className="pane-head"><div><span className="eyebrow">MARKDOWN</span><h2>内容编辑</h2></div><div className="mini-actions"><button onClick={()=>imageRef.current?.click()}>＋ 图片</button><button onClick={()=>{setText(sample);setNotice("已恢复示例内容")}}>示例</button></div></div><textarea aria-label="Markdown 内容编辑器" value={text} onChange={e=>setText(e.target.value)} spellCheck={false}/><p className="drop-hint">支持拖入图片 · 自动保存草稿 · 使用 Markdown 语法</p></div>
  <div className={`pane preview-pane ${tab!=="preview"?"mobile-hidden":""}`}><div className="pane-head"><div><span className="eyebrow">WECHAT PREVIEW</span><h2>公众号预览</h2></div><span className="theme-chip"><i/>{themes[theme].name}</span></div><div className="paper-wrap"><article ref={preview} className="wechat-article" dangerouslySetInnerHTML={{__html:html}}/></div></div></section>
  <footer><span>本地优先：草稿与图片不会上传服务器</span><span>开源 · 适配桌面与移动端 · 建议粘贴后在微信编辑器中终检</span></footer>
 </main>}

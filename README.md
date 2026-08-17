# 研排 ResearchPress

面向科研作者的微信公众号一键排版工具。输入或导入 Markdown，即时生成适合微信公众号的富文本样式，并一键复制。

## 功能

- Markdown 实时编辑与预览
- 学术蓝、Nature 绿、期刊红、水墨黑四套主题
- 针对科研内容优化标题、导读、引文、表格、代码、图片与图注
- 本地图片拖放与 Markdown 导入、导出
- 自动保存到浏览器，不上传文章或图片
- 复制时内联关键样式，便于粘贴到微信公众号编辑器
- 响应式桌面/移动端界面

## 本地开发

```bash
npm ci
npm run dev
```

生产构建：`npm run build`

## 使用提示

不同版本的微信公众号编辑器可能会过滤部分 CSS。正式发布前，建议在公众号后台检查图片、表格和段落间距。

## 致谢

产品方向参考了 [huasheng_editor](https://github.com/alchaincyf/huasheng_editor)。本项目为独立实现，面向科研公众号写作场景重新设计。

## License

MIT

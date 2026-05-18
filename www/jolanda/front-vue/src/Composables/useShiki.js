import { getHighlighter } from 'shiki'

const highlighter = await getHighlighter({
  theme: 'material-theme-palenight', // nebo jiné jako 'github-light', 'nord', ...
  langs: ['vue', 'html', 'js', 'ts']
})

export function highlight(code, lang = 'vue') {
  return highlighter.codeToHtml(code, { lang })
}

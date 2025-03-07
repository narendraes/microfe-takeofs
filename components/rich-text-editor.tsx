'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Heading3,
  Undo,
  Redo,
  Link as LinkIcon,
  Code
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  required?: boolean
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Write something...',
  required = false
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  
  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm prose prose-sm dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Handle client-side rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setLink = () => {
    if (!linkUrl) {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // Add https:// if no protocol is specified
    const url = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') 
      ? linkUrl 
      : `https://${linkUrl}`

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    setLinkUrl('')
    setLinkDialogOpen(false)
  }

  const handleLinkButtonClick = () => {
    // If text is selected and it's a link, get the URL
    if (editor?.isActive('link')) {
      const attrs = editor.getAttributes('link')
      setLinkUrl(attrs.href || '')
    } else {
      setLinkUrl('')
    }
    setLinkDialogOpen(true)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="rich-text-editor">
      <div className="toolbar flex flex-wrap gap-1 mb-2 p-1 border border-input rounded-md bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-muted' : ''}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-muted' : ''}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor?.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'bg-muted' : ''}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'bg-muted' : ''}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={editor?.isActive('codeBlock') ? 'bg-muted' : ''}
          aria-label="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        {/* Link Button */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLinkButtonClick}
            className={editor?.isActive('link') ? 'bg-muted' : ''}
            aria-label="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editor?.isActive('link') ? 'Edit Link' : 'Add Link'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              {editor?.isActive('link') && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
                    setLinkDialogOpen(false)
                  }}
                >
                  Remove Link
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={setLink}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="ml-auto flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            aria-label="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            aria-label="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent 
        editor={editor} 
        required={required}
        className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm prose prose-sm dark:prose-invert"
      />
    </div>
  )
} 
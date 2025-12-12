'use client';

import React, { useState, useTransition } from 'react';

import { Loader2, WandSparklesIcon, Check, Copy, X } from 'lucide-react';
import { useEditorRef } from 'platejs/react';
import { toast } from 'sonner';

import { askAI } from '@/app/actions/ai';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToolbarButton } from '@/components/ui/toolbar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AIToolbarButton() {
  const editor = useEditorRef();
  const [isPending, startTransition] = useTransition();
  const [generatedContent, setGeneratedContent] = useState('');
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const savedSelectionRef = React.useRef<any>(null);
  const [isFullContentMode, setIsFullContentMode] = useState(false);

  const handleAICommand = (command: string) => {
    // 保存当前选择
    savedSelectionRef.current = editor.selection;

    // 获取当前内容
    let context = '';
    let isFull = false;
    
    // 首先尝试获取选择
    if (editor.selection) {
       // @ts-ignore: Dynamic access to editor.api
       const fragment = editor.api.string(editor.selection);
       if (fragment) {
         context = fragment;
       }
    } 
    
    // 如果没有选择，则回退到全部内容
    if (!context) {
        // 安全访问 Markdown API
        try {
          // PlateJS 编辑器实例结构可能有所不同，检查 Markdown 插件是否可用
          // @ts-ignore: Dynamic access to editor.api.markdown
          if (editor.api && editor.api.markdown && typeof editor.api.markdown.serialize === 'function') {
            // @ts-ignore: Dynamic access to editor.api.markdown
            context = editor.api.markdown.serialize();
          } else {
             // 回退：尝试仅获取文本内容
             context = (editor.children || []).map((n: any) => n.text || '').join('\n');
          }
        } catch (e) {
          console.warn('Failed to serialize markdown:', e);
        }
        
        isFull = true;
    }

    setIsFullContentMode(isFull);

    if (!context && command !== '帮我写个开头') {
        toast.error('请先输入一些内容或选中文字');
        return;
    }

    startTransition(async () => {
      try {
        const result = await askAI(command, context);
        
        if (result) {
            setGeneratedContent(result);
            setShowReviewDialog(true);
        }
      } catch (error) {
        console.error(error);
        toast.error('AI 请求失败');
      }
    });
  };

  const handleApply = (mode: 'replace' | 'insert') => {
    // 首先恢复编辑器焦点
    // @ts-ignore: Dynamic call
    editor.tf.focus();
    
    // 解析 Markdown 内容为节点
    let nodes: any = null;
    try {
      // @ts-ignore: Dynamic access to editor.api.markdown
      if (editor.api && editor.api.markdown && typeof editor.api.markdown.deserialize === 'function') {
         // @ts-ignore: Dynamic access to editor.api.markdown
         nodes = editor.api.markdown.deserialize(generatedContent);
      }
    } catch (e) {
      console.warn('Failed to deserialize markdown:', e);
    }

    if (mode === 'replace') {
      if (isFullContentMode) {
          // 如果我们是在全内容上操作，则全选内容
          // @ts-ignore: Dynamic call
          editor.tf.select([]); 
          // 注意：在某些版本的 Plate/Slate 中，select([]) 会选择开头的空范围。
          // 如果失败，我们可能需要更健壮的方法来全选，但先尝试标准方法。
          // 或者，如果是完全替换，我们可以直接替换 children，但 insertText 对历史记录更安全。
          // 为了安全起见，让我们手动构建整个文档的范围。
          if (editor.children.length > 0) {
             try {
                // @ts-ignore
                const start = editor.api.start([]);
                // @ts-ignore
                const end = editor.api.end([]);
                // @ts-ignore
                editor.tf.select({ anchor: start, focus: end });
             } catch (e) {
                // 回退
                // @ts-ignore
                editor.tf.select([]);
             }
          }
      } else if (savedSelectionRef.current) {
          // 恢复原始选择
          // @ts-ignore: Dynamic call
          editor.tf.select(savedSelectionRef.current);
      }
      
      if (nodes) {
          // @ts-ignore: Dynamic call
          editor.insertFragment(nodes);
      } else {
          // @ts-ignore: Dynamic call
          editor.insertText(generatedContent);
      }
    } else {
      // 移动光标到末尾并插入
      if (savedSelectionRef.current) {
          // 首先恢复选择，以便我们有一个参考点
           // @ts-ignore: Dynamic call
           editor.tf.select(savedSelectionRef.current);
           // 折叠到选择末尾
           // @ts-ignore: Dynamic call
           editor.tf.collapse({ edge: 'end' });
      } else {
           // 如果没有先前的选择，只需转到文档末尾
           // @ts-ignore: Dynamic call
           editor.tf.select([]);
           // @ts-ignore: Dynamic call
           editor.tf.collapse({ edge: 'end' });
      }
      
      // 插入换行
      // @ts-ignore: Dynamic call
      editor.insertText('\n\n');
      
      if (nodes) {
          // @ts-ignore: Dynamic call
          editor.insertFragment(nodes);
      } else {
          // @ts-ignore: Dynamic call
          editor.insertText(generatedContent);
      }
    }
    setShowReviewDialog(false);
    toast.success('已应用更改');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton tooltip="AI 助手 (DeepSeek)" pressed={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin text-purple-500" />
            ) : (
              <WandSparklesIcon className="size-4 text-purple-600 dark:text-purple-400" />
            )}
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            DeepSeek AI 助手
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleAICommand('续写这段文字')}>
            ✏️ 续写
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAICommand('润色这段文字，使其更通顺优美')}>
            💅 润色
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAICommand('总结核心内容，列出要点')}>
            📝 总结
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAICommand('修正错别字和语法错误')}>
            ✅ 纠错
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleAICommand('扩充这段内容，增加细节')}>
            ➕ 扩写
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAICommand('精简这段内容，保留核心意思')}>
            ➖ 精简
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               <WandSparklesIcon className="size-5 text-purple-600" />
               AI 生成内容预览
            </DialogTitle>
            <DialogDescription>
              请审阅 AI 生成的内容，您可以选择替换当前选中内容，或追加到后方。
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 rounded-md border bg-muted/50 p-4">
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {generatedContent}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
             <div className="flex w-full items-center justify-between">
                <Button variant="ghost" onClick={() => setShowReviewDialog(false)}>
                   取消
                </Button>
                <div className="flex gap-2">
                   <Button variant="outline" onClick={() => handleApply('insert')}>
                      <Copy className="mr-2 size-4" />
                      追加到后方
                   </Button>
                   <Button onClick={() => handleApply('replace')}>
                      <Check className="mr-2 size-4" />
                      替换选中/当前
                   </Button>
                </div>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

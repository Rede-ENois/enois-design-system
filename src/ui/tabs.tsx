import * as React from "react";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../lib/utils.js";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  // A faixa nunca passa da largura da página nem alarga o que está em volta: com muitas abas ela
  // passava da largura do celular e a tela inteira ia para o lado junto (#1146, #1147). `w-full`
  // prende a faixa ao container e `max-w-full` funciona mesmo quando quem usa muda o `flex` para
  // embrulhar as abas em linhas (`flex-wrap`: a largura do conteúdo deixaria de ser a da tela).
  // `min-w-0` deixa a faixa encolher dentro da coluna do pai em vez de ser esticada pelo conteúdo;
  // o que não couber rola só dentro dela (`overscroll-x-contain` não entrega o arrasto à página).
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex w-full max-w-full min-w-0 items-center gap-1 overflow-x-auto overscroll-x-contain pb-1 scrollbar-on-hover",
      // Mesma borda de encostar da PillRow: o conteúdo da casca tem px-3 no celular e px-6 do sm;
      // a margem negativa (igual ao px-3) põe a faixa na largura cheia da tela para quem embrulha
      // as abas em linhas. Numa linha só, o padding de novo no começo devolve o alinhamento.
      "-mx-3 px-3 sm:mx-0 sm:px-0",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  // Ativa nos tokens (mesmo padrão do Pill): os hex do protótipo de reações davam
  // contraste 1,1–1,5:1 no tema claro, abaixo da aba inativa.
  // `shrink-0` fica no `className` do DS e não na base: quem quebra a faixa em linhas (feed) passa
  // `basis-… shrink` e precisa mandar nas próprias abas — utility de componente vence a base.
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-normal text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 data-[state=active]:bg-primary-soft data-[state=active]:text-primary-text data-[state=active]:ring-1 data-[state=active]:ring-inset data-[state=active]:ring-primary/40",
      "shrink-0",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2 focus-visible:outline-none", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

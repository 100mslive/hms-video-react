import { RefObject } from 'react';

export function scrollToBottom(messageListRef: RefObject<HTMLDivElement>, behavior: ScrollBehavior = 'auto'): void {
  messageListRef.current!.scrollTo({
    top: messageListRef.current!.scrollHeight,
    behavior: behavior,
  });
}

export function isTotallyScrolled(refHavingScroll: RefObject<HTMLDivElement>) {
  const fullScrollHeight = refHavingScroll.current!.scrollHeight;
  const heightVisibleAtOnce = refHavingScroll.current!.clientHeight;
  const heightScrolledFromTop = refHavingScroll.current!.scrollTop;
  return (fullScrollHeight - heightScrolledFromTop) === heightVisibleAtOnce;
}

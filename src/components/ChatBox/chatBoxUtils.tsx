import React from 'react';
import { RefObject } from 'react';

export function ChatLink({ text }: { text: string }) {
  const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  return (
    <>
      {text
        .trim()
        .split(' ')
        .map(part =>
          URL_REGEX.test(part) ? (
            <a
              href={part}
              target="_blank"
              rel="noopener"
              className="text-brand-tint"
            >
              {part}{' '}
            </a>
          ) : (
            part + ' '
          ),
        )}
    </>
  );
}

export function scrollToBottom(
  messageListRef: RefObject<HTMLDivElement>,
  behavior: ScrollBehavior = 'auto',
): void {
  messageListRef.current!.scrollTo({
    top: messageListRef.current!.scrollHeight,
    behavior: behavior,
  });
}

export function isTotallyScrolled(refHavingScroll: RefObject<HTMLDivElement>) {
  const fullScrollHeight = refHavingScroll.current?.scrollHeight;
  const heightVisibleAtOnce = refHavingScroll.current?.clientHeight;
  const heightScrolledFromTop = refHavingScroll.current?.scrollTop;
  if (fullScrollHeight && heightScrolledFromTop && heightVisibleAtOnce) {
    return fullScrollHeight - heightScrolledFromTop === heightVisibleAtOnce;
  }
  return false;
}

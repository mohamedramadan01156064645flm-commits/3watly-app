import React from 'react';

export function RichText({ text }: {text: string;}) {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, i) =>
      i % 2 === 1 ?
      <strong key={i} className="font-bold text-ink-900">
            {part}
          </strong> :

      <React.Fragment key={i}>{part}</React.Fragment>

      )}
    </>);

}
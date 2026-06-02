import { useState } from 'react';

const ZALO_PHONE = '84346437915';
const ZALO_LINK = `https://zalo.me/${ZALO_PHONE}`;

export function FloatZalo() {
  const [iconSrc, setIconSrc] = useState('/icons/zalo.png');

  return (
    <a
      href={ZALO_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Zalo DOSU Gem"
      className="float-zalo"
      title="Tư vấn qua Zalo"
    >
      <img
        src={iconSrc}
        alt="Zalo"
        width={52}
        height={52}
        onError={() => {
          if (iconSrc !== '/icons/zalo.svg') setIconSrc('/icons/zalo.svg');
        }}
      />
    </a>
  );
}

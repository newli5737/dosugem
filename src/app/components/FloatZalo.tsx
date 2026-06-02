const ZALO_PHONE = '84346437915';
const ZALO_LINK = `https://zalo.me/${ZALO_PHONE}`;
const ZALO_ICON = '/icons/Icon_of_Zalo.svg.png';

export function FloatZalo() {
  return (
    <a
      href={ZALO_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Zalo DOSU Gem"
      className="float-zalo"
      title="Tư vấn qua Zalo"
    >
      <img src={ZALO_ICON} alt="Zalo" width={52} height={52} />
    </a>
  );
}

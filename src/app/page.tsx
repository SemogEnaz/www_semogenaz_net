import Link from 'next/link';

import './homePage.css'

function Buttons({ buttons, css }: { buttons: { link: string, content: string }[], css: string}) {

  const Button = ({ link, content, css}: { link: string, content: string, css: string}) => {
    return <Link className={css} href={link}>{content}</Link>
  };

  return (
    <>
      {buttons.map(button => (
        <Button key={button.link} link={button.link} content={button.content} css={css} />
      ))}
    </>
  );
}

export default function Page() {

  const buttons = [
    { link: '/weaklyPrices', content: 'weaklyPrices' }, 
    { link: '/mp3', content: '.mp3' }
  ];

  const css = 'button glass-button';

  return (
    <div className='homePage'>
      <div className="heading">Applications</div>
      <div className='button-container'>
          <Buttons buttons={buttons} css={css}/>
      </div>
    </div>
  );
}
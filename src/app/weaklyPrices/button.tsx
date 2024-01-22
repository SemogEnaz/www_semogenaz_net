import Link from 'next/link';

import styles from './button.module.css'

export function TopButton({ link, text }) {
    return (
        <Link 
            href={link}
            className={styles['button-top']}
        >
          {text}
        </Link>
    )
}

export function Button({ link, text }) {
    return (
        <Link 
            href={link}
            className={styles.button}
        >
          {text}
        </Link>
    )
}

export function HomeButton() {
    return (
        <TopButton link={'/'} text={"Home"} />
    );
}
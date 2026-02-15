import styles from '@/Header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <img src="/logo.webp" alt="Site Logo" className={styles.logo} />
        </header>
    )
}

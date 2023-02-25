import Head from 'next/head';
import styles from './layout.module.css';

export const siteTitle = "VulcanWM's GuestBook";

export default function Layout({ pageTitle, children }) {
  const title = `${siteTitle} - ${pageTitle}`;
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="description"
          content="VulcanWM's GuestBook"
        />
        <meta
          property="og:image"
          content="/logo.png"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:url" content="https://guest-book.vulcanwm.repl.co" />
        <meta property="og:site_name" content="VulcanWM's GuestBook" />
        <meta name="robots" content="index, follow"/>
        <meta property="og:type" content="Website" />
        <title>{title}</title>
      </Head>
      <main>{children}</main>
    </div>
  );
}
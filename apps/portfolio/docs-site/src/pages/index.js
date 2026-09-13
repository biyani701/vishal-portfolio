import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className={styles.primaryButton}
            to="/intro">
            Get Started
          </Link>
          <Link
            className={styles.secondaryButton}
            to="/architecture/overview">
            Architecture
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({title, description, icon, link}) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
      {link && (
        <Link to={link} className={styles.featureLink}>
          Learn More →
        </Link>
      )}
    </div>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: 'Documentation',
      description: 'Comprehensive guides and documentation for the portfolio project.',
      icon: '📚',
      link: '/intro',
    },
    {
      title: 'Architecture',
      description: 'Explore the technical architecture and design patterns used.',
      icon: '🏗️',
      link: '/architecture/overview',
    },
    {
      title: 'Libraries',
      description: 'Learn about the libraries and frameworks used in this project.',
      icon: '📦',
      link: '/libraries/mui',
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.featuresContainer}>
        {features.map((props, idx) => (
          <FeatureCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation for Vishal Biyani's portfolio">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

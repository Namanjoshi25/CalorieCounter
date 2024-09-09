import React from 'react';
import styles from './loader.module.css'; // Create a CSS module for styling

const Loader: React.FC = () => {
  return (
    <div className={styles.loader}></div>
  );
};

export default Loader;

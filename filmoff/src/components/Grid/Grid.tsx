import React from 'react';
import styles from './Grid.module.css'

const Grid = () => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>Item 1</div>
      <div className={styles.item}>Item 2</div>
      <div className={styles.item}>Item 3</div>
      <div className={styles.item}>Item 4</div>
      <div className={styles.item}>Item 5</div>
      <div className={styles.item}>Item 6</div>
      <div className={styles.item}>Item 7</div>
      <div className={styles.item}>Item 8</div>
      <div className={styles.item}>Item 9</div>
      <div className={styles.item}>Item 10</div>
      <div className={styles.item}>Item 11</div>
      <div className={styles.item}>Item 12</div>
    </div>
  );
};

export default Grid;
import styles from './ScoreBlock.module.css';

const getBgStyle = score => {
    if (typeof score !== 'number')
        return;

    if (score * 100 < 50)
        return styles.bad;

    if (score * 100 < 90)
        return styles.average;

    return styles.good;
}

const ScoreBlock = props => {
    const { score, title, overallCategory, visible } = props;

    if (!visible && visible !== undefined)
        return;

    return (
        <div className={`${styles.scoreblock} ${getBgStyle(score)}`}>
            <div className={styles.score}>{overallCategory}</div>
            <div className={styles.score}>{typeof score === 'number' ? Math.floor(score * 100) + '%' : score}</div>
            <div className={styles.title}>{title}</div>
        </div>
    )
};

export default ScoreBlock

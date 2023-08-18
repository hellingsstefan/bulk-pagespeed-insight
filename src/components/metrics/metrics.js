import styles from './Metrics.module.css';

const Metric = props => {
    const { title, category, percentile } = props;
    return <div className={styles.metric}>
        <div>{title}</div>
        <div>{category}</div>
        <div>{percentile}</div>
    </div>
};

const Metrics = props => {
    console.log('metrics', { ...props });
    const items = Object.entries(props.metrics);

    return (
        <div className={styles.metrics}>
            {items.map(([title, metric], index) => <Metric key={index} title={title} {...metric} />)}
        </div>
    )

};

export default Metrics;

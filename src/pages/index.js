import { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Row from '../components/row';

const PageHead = () => <Head>
    <title>Bulk Pagespeed Insights</title>
    <meta name="description" content="Test pages with pagespeed insight in bulk" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
</Head>

const StrategyChoice = props => (
    <div className={styles.entrygroup}>
        <div className="entry">
            <input
                onChange={event => props.onChange(event)}
                type="radio"
                name="strategy"
                id="strategy-mobile"
                value="MOBILE"
                checked />
            <label htmlFor="strategy-mobile">Mobile</label>
        </div>
        <div className="entry">
            <input
                onChange={event => props.onChange(event)}
                type="radio"
                name="strategy"
                id="strategy-desktop"
                value="DESKTOP" />
            <label htmlFor="strategy-desktop">Desktop</label>
        </div>
    </div>
);

const VisibleScoresChoice = props => {
    const baseMetrics = [ 'performance', 'accessibility', 'best-practices', 'seo', 'pwa' ];

    return (
        <div className={styles.entrygroup}>
            {baseMetrics.map(metric => (
                <div key={metric.toUpperCase()} className={styles.entry}>
                    <input
                        onChange={event => props.onChange(event)}
                        type="checkbox"
                        name="visibleScore"
                        id={`score-${metric}`}
                        value={metric.toUpperCase()}
                        checked={props.visibleScores.includes(metric.toUpperCase())} />
                    <label htmlFor={`score-${metric}`}>{metric}</label>
                </div>
            ))}
        </div>
    );
};

const Home = () => {
    const defaultValue = "e.g.:\nhttps://www.ambassify.com/\nhttps://www.ambassify.com/glossary\nhttps://www.ambassify.com/employee-advocacy-roi"
    const [ list, setList ] = useState('');
    const [ rows, setRows ] = useState([]);
    const [ strategy, setStrategy ] = useState('mobile');
    const [ visibleScores, setVisibleScores ] = useState(['PERFORMANCE', 'ACCESSIBILITY']);

    const handleRadioGroup = event => setStrategy(event.target.value);
    const handleCheckboxGroup = event => {
        const value = event.target.value;

        if (visibleScores.includes(value))
            setVisibleScores(prev => prev.filter(visible => visible !== value));
        else
            setVisibleScores(prev => [...prev, value]);
    };

    const startBulk = () => {
        const urls = list.length > 0  ? list.split('\n') : [];

        urls.forEach(url => setRows(prevUrls => [...prevUrls, { url, strategy }]));
    }

    return (
        <>
            <PageHead />
            <main className={styles.main}>
                <div className={styles['input-container']}>
                    <label htmlFor="list">Insert list of pages:</label>
                    <textarea
                        className={styles.input}
                        id="list"
                        value={list}
                        placeholder={defaultValue}
                        onInput={event => setList(event.target.value)} />
                    <StrategyChoice onChange={handleRadioGroup} />
                    <VisibleScoresChoice visibleScores={visibleScores} onChange={handleCheckboxGroup} />
                    <button
                        className={styles.button}
                        onClick={startBulk}>
                        Start
                    </button>
                </div>
                {(rows.length > 0) &&
                    <div className={styles['output-container']}>
                        {rows.map((row, index) => (
                            <Row key={index} {...row} visibleScores={visibleScores} />
                        ))}
                    </div>
                }
            </main>
        </>
    )
}

export default Home;


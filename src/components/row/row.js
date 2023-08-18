import useSWR from 'swr';
import _get from 'lodash/get';
import styles from './Row.module.css';
import Loader from '../loader';
import ScoreBlock from '../scoreblock';
import Metrics from '../metrics';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const Row = props => {
    const { url, strategy: s, visibleScores } = props;
    const encodedUrl = encodeURIComponent(url);
    const strategy = s.toUpperCase();
    const { data, error } = useSWR(`http://localhost:5000/performance?url=${encodedUrl}&strategy=${strategy}`, fetcher);

    if (error)
        return <div>Failed to load</div>

    if (!data)
        return <div className={styles.loading}><Loader /><span>{url}</span></div>

    const { code, message } = _get(data, 'result.error', false);

    if (code)
        return <div className={styles.row}>
            <span>{url}</span>
            <span>{code}: {message}</span>
        </div>

    const { requestedUrl, finalUrl } = _get(data, 'result.lighthouseResult', url);
    const categoriesObject = _get(data, 'result.lighthouseResult.categories', {});
    const metricsObject = _get(data, 'result.loadingExperience.metrics', {});
    console.log('', { metricsObject });
    const overallCategory = _get(data, 'result.loadingExperience.overall_category');
    const overallTiming = Math.ceil(_get(data, 'result.lighthouseResult.timing.total'));
    const categories = Object.entries(categoriesObject);
    const externalUrl = `https://pagespeed.web.dev/report?url=${encodeURIComponent(finalUrl)}`;

    return (
        <details className={styles.row}>
            <summary className={styles.main}>
                <div className={styles.title}>
                    <span>{requestedUrl} <small>(Requested Url)</small></span>
                    <span>{finalUrl} <small>(Final Url)</small></span>
                </div>
                <div className={styles.scores}>
                    <ScoreBlock overallCategory={overallCategory} title={`${overallTiming / 1000} s`} />
                    {categories.map(([key, value]) => (
                        <ScoreBlock key={key} {...value} visible={visibleScores.includes(key.toUpperCase())} />
                    ))}
                </div>
                <div className={styles.links}>
                    <a
                        className={styles.external}
                        target="_blank"
                        href={finalUrl}>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 194.818 194.818">
                            <path d="M185.818 2.161h-57.04c-4.971 0-9 4.029-9 9s4.029 9 9 9h35.312l-86.3 86.3c-3.515 3.515-3.515 9.213 0 12.728 1.758 1.757 4.061 2.636 6.364 2.636s4.606-.879 6.364-2.636l86.3-86.3v35.313c0 4.971 4.029 9 9 9s9-4.029 9-9v-57.04c0-4.972-4.029-9.001-9-9.001z"/>
                            <path d="M149 77.201c-4.971 0-9 4.029-9 9v88.456H18v-122h93.778c4.971 0 9-4.029 9-9s-4.029-9-9-9H9c-4.971 0-9 4.029-9 9v140c0 4.971 4.029 9 9 9h140c4.971 0 9-4.029 9-9V86.201c0-4.971-4.029-9-9-9z"/>
                        </svg>
                    </a>
                    <a
                        className={styles.external}
                        target="_blank"
                        href={externalUrl}>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 194.818 194.818">
                            <path d="M185.818 2.161h-57.04c-4.971 0-9 4.029-9 9s4.029 9 9 9h35.312l-86.3 86.3c-3.515 3.515-3.515 9.213 0 12.728 1.758 1.757 4.061 2.636 6.364 2.636s4.606-.879 6.364-2.636l86.3-86.3v35.313c0 4.971 4.029 9 9 9s9-4.029 9-9v-57.04c0-4.972-4.029-9.001-9-9.001z"/>
                            <path d="M149 77.201c-4.971 0-9 4.029-9 9v88.456H18v-122h93.778c4.971 0 9-4.029 9-9s-4.029-9-9-9H9c-4.971 0-9 4.029-9 9v140c0 4.971 4.029 9 9 9h140c4.971 0 9-4.029 9-9V86.201c0-4.971-4.029-9-9-9z"/>
                        </svg>
                    </a>
                </div>
            </summary>
            <div className={styles.details}>
                <Metrics metrics={metricsObject} />
            </div>
        </details>
    )
}

export default Row;

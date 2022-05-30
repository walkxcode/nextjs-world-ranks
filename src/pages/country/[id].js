import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import styles from "./Country.module.css";

const getCountry = async (id) => {
  const res = await fetch(`https://restcountries.com/v2/alpha/${id}`);

  const country = await res.json();

  return country;
};

const Country = ({ country }) => {
  const [borders, setBorders] = useState([]);

  const getBorders = async () => {
    const borders = await Promise.all(
      country.borders.map((border) => getCountry(border))
    );

    setBorders(borders);
  };

  useEffect(() => {
    getBorders();
  }, []);

  console.log(borders);

  return (
    <Layout title={country.name}>
      <div className={styles.container}>
        <div className={styles.containerLeft}>
          <div className={styles.overviewPanel}>
            <img src={country.flag} alt={country.name} />

            <h1 className={styles.overviewName}>{country.name}</h1>
            <div className={styles.overviewRegion}>{country.region}</div>

            <div className={styles.overviewNumbers}>
              <div className={styles.overviewPopulation}>
                <div className={styles.overviewValue}>{country.population}</div>
                <div className={styles.overviewLabel}>Population</div>
              </div>

              <div className={styles.overviewArea}>
                <div className={styles.overviewValue}>{country.area}</div>
                <div className={styles.overviewLabel}>Area</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.containerRight}>
          <div className={styles.detailsPanel}>
            <h4 className={styles.detailsPanelHeader}>Details</h4>

            <div className={styles.detailsPanelRow}>
              <div className={styles.detailsPanelLabel}>Capital</div>
              <div className={styles.detailsPanelValue}>{country.capital}</div>
            </div>

            <div className={styles.detailsPanelRow}>
              <div className={styles.detailsPanelLabel}>Languages</div>
              <div className={styles.detailsPanelValue}>
                {country.languages.map(({ name }) => name).join(", ")}
              </div>
            </div>

            <div className={styles.detailsPanelRow}>
              <div className={styles.detailsPanelLabel}>Currencies</div>
              <div className={styles.detailsPanelValue}>
                {country.currencies.map(({ name }) => name).join(", ")}
              </div>
            </div>

            <div className={styles.detailsPanelRow}>
              <div className={styles.detailsPanelLabel}>Native name</div>
              <div className={styles.detailsPanelValue}>
                {country.nativeName}
              </div>
            </div>

            <div className={styles.detailsPanelRow}>
              <div className={styles.detailsPanelLabel}>Gini</div>
              <div className={styles.detailsPanelValue}>{country.gini} %</div>
            </div>

            <div className={styles.detailsPanelBorders}>
              <div className={styles.detailsPanelBordersLabel}>
                Neighbouring Countries
              </div>

              <div className={styles.detailsPanelBordersContainer}>
                {borders.map(({ flag, name }, i) => (
                  <div key={i} className={styles.detailsPanelBordersCountry}>
                    <img src={flag} alt={name} />

                    <div className={styles.detailsPanelBordersName}>{name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Country;

export const getStaticPaths = async () => {
  const res = await fetch("https://restcountries.com/v2/all");
  const countries = await res.json();

  const paths = countries.map((country) => ({
    params: { id: country.alpha3Code },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const country = await getCountry(params.id);

  return {
    props: {
      country,
    },
  };
};

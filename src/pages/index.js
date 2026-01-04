import Mermaid from "@theme/Mermaid";
import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function Feature({ title, children }) {
	return (
		<div className="col col--4">
			<div className="text--center padding-horiz--md">
				<h3>{title}</h3>
				<p>{children}</p>
			</div>
		</div>
	);
}

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={clsx("hero hero--primary", styles.heroBanner)}>
			<div className="container">
				<h1 className="hero__title">{siteConfig.title}</h1>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<div className={styles.buttons}>
					<Link
						className="button button--primary button--lg"
						to="/docs/basics/getting-started"
					>
						🌱 Get Seeding 🌱
					</Link>
				</div>
			</div>
		</header>
	);
}

function IntroducingCrossSeed() {
	return (
		<section className={styles.whatIsCrossSeed}>
			<div className="container margin-top--lg">
				<p>
					<strong>
						New private trackers make ratio tough at first.
					</strong>{" "}
					You can’t upload until you’ve downloaded, so progress starts
					slow — unless you can seed what you already have. cross-seed
					changes that by matching torrents you already have and
					seeding them on other trackers, so you can contribute
					immediately without extra downloads or manual searching.
				</p>
				<p>
					<strong>
						The result is stronger swarms and healthier trackers.
					</strong>{" "}
					More seeds means faster downloads, longer retention, and
					better availability for trackers — while you build ratio
					and seed size without babysitting your client or
					duplicating data.
				</p>
			</div>
		</section>
	);
}

export default function Home() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={siteConfig.title}
			description="An app to find cross-seeds automatically"
		>
			<HomepageHeader />
			<main>
				<IntroducingCrossSeed />
				<center>
					<Mermaid
						value={`flowchart BT
						A[Tracker A]
    					B[Tracker B]
    					C[Tracker C]
						X[Your torrent client • cross-seed 🌱] 
    					
    					X <== DL, Seeding ==> A
    					X == 🌱 ==> B
    					X == 🌱 ==> C
					`}
					/>
				</center>
				<section className={styles.features}>
					<div className="container">
						<div className="row">
							<div className="col col--12">
								<h2 className="text--center">Benefits</h2>
								<hr />
							</div>
							<Feature title="Download once, seed everywhere">
								Share your existing torrents across multiple
								trackers automatically — no manual searching, no
								duplicate downloads.
							</Feature>
							<Feature title="Maximize seed size and seed time">
								cross-seed runs in the background, automatically
								cross-seeding new downloads to all your trackers
								and watching for new uploads that match what’s
								already in your library.
							</Feature>
							<Feature title="Stronger swarms, longer retention">
								Increase availability on every tracker, helping
								torrents stay alive and healthy for the whole
								community.
							</Feature>
							<div className="col col--12 margin-top--lg">
								<h2 className="text--center">
									Advanced Features
								</h2>
								<hr />
							</div>
							<Feature title="Seamless matching, even with renamed files">
								Renamed or reorganized your media library?
								cross-seed can still match and seed it.
							</Feature>
							<Feature title="Partial Matching">
								Match and seed torrents with samples, NFOs, or
								other extra files you don't have, as long as you
								have the core data files.
							</Feature>
							<Feature title="Integrates with your setup">
								Works with qBittorrent, rTorrent, Deluge, and
								Transmission, plus Torznab providers like
								Jackett and Prowlarr.
							</Feature>
							<Feature title="Supports IMDb/TMDB IDs">
								Finds cross-seeds based on unique movie and TV
								show IDs, so you get accurate matches even if
								titles vary across trackers.
							</Feature>
							<Feature title="Rescue lost torrent libraries">
								As long as you still have the data files in some
								form, cross-seed can figure out the rest and
								re-seed your library.
							</Feature>
							<Feature title="Win races before they start">
								Enter swarms as a 100% seeder the moment they’re
								announced by pairing cross-seed with{" "}
								<a
									href="https://autobrr.com"
									rel="noopener noreferrer"
									target="_blank"
								>
									autobrr
								</a>{" "}
								— before the uploader even finishes connecting.
							</Feature>
						</div>
					</div>
				</section>
				<div className="container padding-vert--lg text--center">
					<div className={styles.buttons}>
						<Link
							className="button button--primary button--lg"
							to="/docs/basics/getting-started"
						>
							Get Started
						</Link>
					</div>
				</div>
			</main>
		</Layout>
	);
}

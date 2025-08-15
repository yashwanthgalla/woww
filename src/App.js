import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

function useInterval(callback, delay) {
	useEffect(() => {
		if (delay == null) return;
		const id = setInterval(callback, delay);
		return () => clearInterval(id);
	}, [callback, delay]);
}

function BackgroundRotator() {
	const images = useMemo(() => [
		'/Pics/IMG-20250815-WA0003.jpg',
		'/Pics/IMG-20250815-WA0004.jpg',
		'/Pics/IMG-20250815-WA0005.jpg',
		'/Pics/IMG-20250815-WA0006.jpg',
	], []);
	const [index, setIndex] = useState(0);
	useInterval(() => setIndex((i) => (i + 1) % images.length), 5000);
	return (
		<div className="background-container">
			{images.map((src, i) => (
				<div key={src} className={`background-image ${i === index ? 'active' : ''}`} style={{ backgroundImage: `url(${src})` }} />
			))}
		</div>
	);
}

function FloatingElements() {
	return (
		<div className="floating-elements">
			<div className="flower flower-1">🌸</div>
			<div className="flower flower-2">🌺</div>
			<div className="flower flower-3">🌹</div>
			<div className="flower flower-4">🌻</div>
			<div className="flower flower-5">🌷</div>
			<div className="heart heart-1">💖</div>
			<div className="heart heart-2">💝</div>
			<div className="heart heart-3">💕</div>
			<div className="heart heart-4">💗</div>
			<div className="heart heart-5">💓</div>
			<div className="sparkle sparkle-1">✨</div>
			<div className="sparkle sparkle-2">⭐</div>
			<div className="sparkle sparkle-3">💫</div>
			<div className="butterfly butterfly-1">🦋</div>
			<div className="butterfly butterfly-2">🦋</div>
		</div>
	);
}

function useIntersectionFadeIn(selectors) {
	useEffect(() => {
		const elements = document.querySelectorAll(selectors);
		elements.forEach((el) => {
			(el).style.opacity = '0';
			(el).style.transform = 'translateY(30px)';
			(el).style.transition = 'all 0.8s ease';
		});
		const obs = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					(entry.target).style.opacity = '1';
					(entry.target).style.transform = 'translateY(0)';
				}
			});
		}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
		elements.forEach((el) => obs.observe(el));
		return () => obs.disconnect();
	}, [selectors]);
}

function BirthdayCard() {
	useIntersectionFadeIn('.birthday-card');
	return (
		<div className="container">
			<div className="birthday-card">
				<div className="card-header">
					<div className="title-decoration">
						<span className="decoration-star">⭐</span>
						<h1 className="birthday-title">Happy Birthday! 🎂</h1>
						<span className="decoration-star">⭐</span>
					</div>
					<div className="birthday-subtitle">Wishing you a day filled with joy and laughter! 🎉</div>
				</div>
				<div className="card-content">
					<div className="message-section">
						<p className="birthday-message">
							Chinnoda❤️<br/><br/>
							On this special day, I want you to know how much you mean to me.
							Your friendship has brought so much happiness into my life, and I'm
							grateful for every moment we've shared together.<br/><br/>
							May your birthday be as wonderful and beautiful as you are! Here's to another amazing year ahead filled with love, success, and countless beautiful memories.<br/><br/>
							With lots of love and warmest wishes,<br/>
							Your Friend 💖
						</p>
					</div>
					<div className="celebration-section">
						<div className="celebration-icons">
							<span className="celebration-icon">🎈</span>
							<span className="celebration-icon">🎁</span>
							<span className="celebration-icon">🎊</span>
							<span className="celebration-icon">🎉</span>
							<span className="celebration-icon">🍰</span>
						</div>
					</div>
				</div>
				<div className="card-footer">
					<div className="footer-hearts">
						<span className="footer-heart">💖</span>
						<span className="footer-heart">💝</span>
						<span className="footer-heart">💕</span>
						<span className="footer-heart">💗</span>
						<span className="footer-heart">💓</span>
					</div>
					<p className="footer-text">May all your dreams come true! ✨</p>
				</div>
			</div>
		</div>
	);
}

function Gallery() {
	const photos = useMemo(() => [
		'/Pics/IMG-20250815-WA0002.jpg',
		'/Pics/IMG-20250815-WA0003.jpg',
		'/Pics/IMG-20250815-WA0004.jpg',
		'/Pics/IMG-20250815-WA0005.jpg',
		'/Pics/IMG-20250815-WA0006.jpg',
		'/Pics/IMG-20250815-WA0007.jpg',
	], []);
	const [index, setIndex] = useState(0);
	const containerRef = useRef(null);
	const throttleRef = useRef(false);
	const SCROLL_COOLDOWN_MS = 700; // adjust to make it slower/faster
	useIntersectionFadeIn('.gallery-section, .message-card');

	useEffect(() => {
		const el = containerRef.current?.parentElement?.parentElement; // .photo-gallery
		if (!el) return;
		const onWheel = (e) => {
			e.preventDefault();
			if (throttleRef.current) return;
			throttleRef.current = true;
			setIndex((i) => Math.min(Math.max(i + (e.deltaY > 0 ? 1 : -1), 0), photos.length - 1));
			setTimeout(() => { throttleRef.current = false; }, SCROLL_COOLDOWN_MS);
		};
		el.addEventListener('wheel', onWheel, { passive: false });
		return () => el.removeEventListener('wheel', onWheel);
	}, [photos.length]);

	useEffect(() => {
		const el = containerRef.current?.parentElement?.parentElement;
		if (!el) return;
		let startX = 0, endX = 0;
		const onStart = (e) => { startX = (e.changedTouches?.[0]?.screenX) ?? 0; };
		const onEnd = (e) => {
			endX = (e.changedTouches?.[0]?.screenX) ?? 0;
			const diff = startX - endX;
			if (Math.abs(diff) > 50) {
				if (throttleRef.current) return;
				throttleRef.current = true;
				setIndex((i) => Math.min(Math.max(i + (diff > 0 ? 1 : -1), 0), photos.length - 1));
				setTimeout(() => { throttleRef.current = false; }, SCROLL_COOLDOWN_MS);
			}
		};
		el.addEventListener('touchstart', onStart);
		el.addEventListener('touchend', onEnd);
		return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd); };
	}, [photos.length]);

	useEffect(() => {
		const x = -index * 100;
		if (containerRef.current) containerRef.current.style.transform = `translateX(${x}%)`;
	}, [index]);

	return (
		<div className="gallery-section">
			<div className="gallery-header">
				<h2 className="gallery-title">📸 Special One 💕</h2>
				<p className="gallery-subtitle">Scroll to see more photos</p>
			</div>
			<div className="photo-counter"><span>{index + 1}</span> / <span>{photos.length}</span></div>
			<div className="photo-gallery">
				<div className="gallery-container" ref={containerRef}>
					{photos.map((src, i) => (
						<div className="photo-item" key={src}>
							<img src={src} alt={`Memory ${i + 1}`} />
						</div>
					))}
				</div>
			</div>
			<div className="gallery-navigation">
				<div className="nav-dots">
					{photos.map((_, i) => (
						<span key={i} className={`nav-dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} />
					))}
				</div>
			</div>
		</div>
	);
}

function SpecialMessage() {
	useIntersectionFadeIn('.message-card');
	return (
		<div className="special-message-section">
			<div className="message-card">
				<div className="message-icon">💌</div>
				<h3 className="message-title">A Special Note</h3>
				<p className="special-message">
					Every moment with you is a treasure, every laugh we share is precious, and every memory we create together is priceless. You make the world a more beautiful place just by being in it! 🌍✨
				</p>
				<div className="message-decoration">
					<span className="decoration-heart">💖</span>
					<span className="decoration-flower">🌺</span>
					<span className="decoration-heart">💖</span>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<>
			<BackgroundRotator />
			<FloatingElements />
			<BirthdayCard />
			<Gallery />
			<SpecialMessage />
		</>
	);
}

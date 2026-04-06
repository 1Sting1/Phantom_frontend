import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import Features from "@/components/Features";
import ForumCTA from '@/components/ForumCTA';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-[#050505]">
            <Header />
            <Hero />
            <Features />
            {/* Carousel Section */}
            <Carousel />

            {/* Forum Section */}
            <ForumCTA />

            {/* Download Section */}
            <DownloadCTA />

            {/* Footer */}
            <Footer />
        </main>
    )
}

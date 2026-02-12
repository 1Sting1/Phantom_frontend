import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DownloadCTA from "@/components/DownloadCTA";

export default function InstallPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#050505]">
            <Header />
            <div className="flex-1 px-12 lg:px-24 xl:px-32 2xl:px-40 py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Установка Phantom
                    </h1>
                    <p className="text-gray-400 text-lg mb-12">
                        Выберите вашу платформу для скачивания
                    </p>
                    <DownloadCTA />
                </div>
            </div>
            <Footer />
        </main>
    );
}


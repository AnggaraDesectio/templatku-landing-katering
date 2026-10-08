// Landing page SAJI RAYA CATERING, jasa katering acara di Bandung.
// Self-contained: tidak memakai AuthenticatedLayout, tidak menerima props.
// Header/nav + footer inline.
import { useMemo, useState, type FormEvent } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import { StatCounter } from '@/components/stat-counter';
import {
    Baby,
    Briefcase,
    CheckCircle2,
    ChefHat,
    ClipboardList,
    Handshake,
    Heart,
    MapPin,
    Menu,
    Phone,
    Star,
    UtensilsCrossed,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia.
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

interface Paket {
    nama: string;
    hargaPerPax: number;
    minPax: number;
    icon: typeof Heart;
    deskripsi: string;
    isi: string[];
    unggulan?: boolean;
}

const PAKET: Paket[] = [
    {
        nama: 'Pernikahan',
        hargaPerPax: 65000,
        minPax: 500,
        icon: Heart,
        deskripsi: 'Prasmanan lengkap untuk hari bahagia, dari akad hingga resepsi.',
        isi: ['10 menu prasmanan + 3 stall live cooking', 'Dekorasi meja prasmanan', 'Pramusaji & koordinator acara', 'Tes food untuk 4 orang'],
        unggulan: true,
    },
    {
        nama: 'Korporat',
        hargaPerPax: 45000,
        minPax: 100,
        icon: Briefcase,
        deskripsi: 'Nasi box, prasmanan kantor, dan coffee break untuk segala acara perusahaan.',
        isi: ['Nasi box / prasmanan kantor', 'Paket coffee break 2x', 'Pengiriman tepat waktu', 'Faktur & laporan resmi'],
    },
    {
        nama: 'Aqiqah & Syukuran',
        hargaPerPax: 35000,
        minPax: 50,
        icon: Baby,
        deskripsi: 'Paket syukuran hangat untuk keluarga, kambing aqiqah tersedia.',
        isi: ['Menu rumahan khas Sunda', 'Opsi kambing guling aqiqah', 'Kemasan besek cantik', 'Bisa antar ke rumah'],
    },
];

const GALERI = [
    { judul: 'Prasmanan pernikahan 800 pax', foto: '/images/landing-katering/galeri-prasmanan.jpg' },
    { judul: 'Stall live cooking siomay', foto: '/images/landing-katering/galeri-live-cooking.jpg' },
    { judul: 'Nasi box korporat', foto: '/images/landing-katering/galeri-nasi-box.jpg' },
    { judul: 'Dekorasi meja dessert', foto: '/images/landing-katering/galeri-dessert.jpg' },
    { judul: 'Kambing guling aqiqah', foto: '/images/landing-katering/galeri-kambing-guling.jpg' },
];

const TESTIMONI = [
    {
        kutip: 'Prasmanan untuk 700 tamu habis tanpa sisa dan tamu-tamu sampai nambah. Pelayanan pramusajinya rapi banget.',
        klien: 'PT Maju Jaya Abadi, gathering tahunan',
    },
    {
        kutip: 'Tes food-nya bikin yakin. Di hari-H, dekorasi prasmanannya cantik dan makanannya enak semua kata keluarga.',
        klien: 'Keluarga H. Suparman, resepsi pernikahan',
    },
    {
        kutip: 'Pesan 150 box untuk rapat direksi, datang 30 menit lebih awal dan masih hangat. Langganan tiap ada event kantor sekarang.',
        klien: 'PT Cahaya Digital Nusantara, rapat kerja',
    },
];

const FAQ = [
    { q: 'Berapa minimal pemesanan?', a: 'Prasmanan pernikahan minimal 500 pax, korporat 100 pax, dan aqiqah/syukuran 50 pax. Untuk jumlah di bawah itu, kami punya paket nasi box mulai 30 box.' },
    { q: 'Apakah bisa tes food dulu?', a: 'Bisa. Paket pernikahan mendapat tes food gratis untuk 4 orang setelah DP. Paket lain bisa tes food dengan biaya Rp150.000 untuk 2 orang, yang dikembalikan jika jadi memesan.' },
    { q: 'Bagaimana jika jumlah tamu berubah?', a: 'Jumlah pax bisa disesuaikan maksimal H-7 sebelum acara (tambah atau kurang maksimal 10%). Setelah H-7, jumlah sudah dikunci.' },
    { q: 'Apakah melayani di luar Bandung?', a: 'Ya, kami melayani Bandung Raya, Cimahi, dan Sumedang tanpa biaya tambahan. Untuk kota lain di Jawa Barat, ada biaya transportasi yang dihitung transparan.' },
    { q: 'Apakah ada opsi menu vegetarian / diet khusus?', a: 'Ada. Kami menyediakan menu vegetarian, dan bisa menyesuaikan untuk kebutuhan alergi atau diet tertentu, sampaikan saat konsultasi.' },
];

const STATS = [
    { label: 'Acara dilayani', value: 1200, suffix: '+' },
    { label: 'Porsi per bulan', value: 25000, suffix: '+' },
    { label: 'Tahun pengalaman', value: 14, suffix: '' },
    { label: 'Klien puas', value: 99, suffix: '%' },
];

export default function KateringLanding() {
    const [menuBuka, setMenuBuka] = useState(false);

    // Form pemesanan dengan estimasi.
    const [nama, setNama] = useState('');
    const [jenisAcara, setJenisAcara] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jumlahPax, setJumlahPax] = useState('');
    const [catatan, setCatatan] = useState('');
    const [pesanOk, setPesanOk] = useState(false);

    const hariIni = useMemo(() => {
        const d = new Date();
        const bln = String(d.getMonth() + 1).padStart(2, '0');
        const tgl = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${bln}-${tgl}`;
    }, []);

    const estimasi = useMemo(() => {
        const p = PAKET.find((x) => x.nama === jenisAcara);
        const pax = parseInt(jumlahPax, 10);
        if (!p || !pax || pax <= 0) return null;
        return { total: pax * p.hargaPerPax, dp: Math.round(pax * p.hargaPerPax * 0.5) };
    }, [jenisAcara, jumlahPax]);

    function kirimPesan(e: FormEvent) {
        e.preventDefault();
        if (!nama.trim() || !jenisAcara || !tanggal || !jumlahPax) return;
        setPesanOk(true);
    }

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#paket', label: 'Paket' },
        { href: '#galeri', label: 'Galeri' },
        { href: '#cara', label: 'Cara Pesan' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <div className="min-h-screen bg-yellow-50/60 pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-700">
                            <ChefHat className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                            SAJI RAYA <span className="text-amber-700">CATERING</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 lg:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-amber-900/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-amber-600 hover:bg-amber-700 sm:inline-flex" asChild>
                        <a href="#paket">Minta Penawaran</a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-amber-900/10 px-4 py-2 lg:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-amber-900/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-900 text-white">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,.14) 0, transparent 40%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">Katering Acara • Bandung & Sekitarnya</Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Tes Food Gratis <span className="text-yellow-200">Sebelum Bayar DP.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-amber-100/95">
                            Cicipi dulu untuk 4 orang, cocok baru deal. 14 tahun pengalaman, 1.200+ acara,
                            prasmanan pernikahan mulai Rp65rb/pax, dapur bersertifikat higienis.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-white text-amber-800 hover:bg-amber-50" asChild>
                                <a href="#paket">Lihat Paket</a>
                            </Button>
                            <a href="#cara" className="text-sm font-semibold text-yellow-100 underline-offset-4 hover:underline">
                                atau lihat alur pemesanannya →
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-amber-100/95">
                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-200 text-yellow-200" /> 4.9 (1.800+ ulasan)</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Dapur higienis tersertifikasi</span>
                            <span className="flex items-center gap-1.5"><UtensilsCrossed className="h-4 w-4" /> 1.200+ acara</span>
                        </div>
                    </div>
                    <div className="relative mx-auto hidden w-full max-w-md sm:flex lg:max-w-lg">
                        <img src="/images/landing-katering/hero.jpg" alt="Prasmanan buffet Saji Raya Catering" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
                        <div className="absolute top-4 right-4 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-amber-800 shadow-lg">Mulai Rp35rb/pax</div>
                        <div className="absolute bottom-4 left-4 rounded-2xl bg-amber-950 px-4 py-2 text-xs font-semibold text-amber-100 shadow-lg">Sejak 2012</div>
                    </div>
                </div>
            </section>

            {/* Statistik */}
            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {STATS.map((s) => (
                        <Card key={s.label} className="text-center">
                            <CardContent className="p-5">
                                <StatCounter value={s.value} suffix={s.suffix} className="text-3xl font-extrabold text-amber-700" />
                                <p className="mt-1 text-sm text-stone-600">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Paket */}
            <section id="paket" className="mx-auto max-w-6xl px-4 py-10">
                <div className="text-center">
                    <Badge variant="outline" className="border-amber-700/30 text-amber-700">Paket Acara</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Pilih Paket Sesuai Acaramu</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Harga per pax, sudah termasuk peralatan, pramusaji, dan dekorasi meja prasmanan.</p>
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                    {PAKET.map((p) => (
                        <Card key={p.nama} className={cn('relative flex flex-col', p.unggulan && 'border-2 border-amber-600 shadow-lg')}>
                            {p.unggulan && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 hover:bg-amber-600">Paling Laris</Badge>}
                            <CardContent className="flex flex-1 flex-col p-6">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600/10">
                                    <p.icon className="h-5 w-5 text-amber-700" />
                                </span>
                                <p className="mt-3 text-lg font-extrabold">{p.nama}</p>
                                <p className="mt-1 text-sm text-stone-600">{p.deskripsi}</p>
                                <p className="mt-4">
                                    <span className="text-3xl font-extrabold text-amber-700">{rupiah(p.hargaPerPax)}</span>
                                    <span className="text-sm text-stone-500">/pax</span>
                                </p>
                                <p className="text-xs text-stone-500">minimal {p.minPax} pax</p>
                                <ul className="mt-4 flex-1 space-y-1.5 text-sm text-stone-600">
                                    {p.isi.map((i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-700" /> {i}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="mt-5 w-full bg-amber-600 hover:bg-amber-700" onClick={() => { setJenisAcara(p.nama); document.getElementById('pesan')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                    Pilih Paket Ini
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Siapa yang biasanya pesan */}
            <section className="mx-auto max-w-6xl px-4 pt-12">
                <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Acara Seperti Apa yang Kami Layani?</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                        { icon: Heart, judul: 'Calon pengantin', teks: 'Prasmanan 500–1.000 pax, dekorasi meja, koordinator acara. Tes food gratis untuk 4 orang.' },
                        { icon: Briefcase, judul: 'HRD & GA perusahaan', teks: 'Nasi box, prasmanan kantor, coffee break. Faktur resmi, pengiriman tepat waktu.' },
                        { icon: Baby, judul: 'Keluarga syukuran', teks: 'Aqiqah 50 pax ke atas, opsi kambing guling, kemasan besek cantik, bisa antar ke rumah.' },
                    ].map((p) => (
                        <div key={p.judul} className="flex gap-3 rounded-2xl border border-amber-900/10 bg-white p-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600/10">
                                <p.icon className="h-5 w-5 text-amber-700" />
                            </span>
                            <div>
                                <p className="font-bold">{p.judul}</p>
                                <p className="mt-0.5 text-sm text-stone-600">{p.teks}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Galeri */}
            <section id="galeri" className="bg-stone-950 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Galeri Acara Kami</h2>
                    <p className="mt-1 text-sm text-stone-400">Dokumentasi prasmanan dan acara yang pernah kami layani.</p>
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                        {GALERI.map((g) => (
                            <div key={g.judul} className="w-60 shrink-0 overflow-hidden rounded-xl sm:w-72">
                                <img src={g.foto} alt={g.judul} loading="lazy" className="h-40 w-full object-cover sm:h-48" />
                                <p className="bg-stone-900 px-3 py-2.5 text-sm font-medium text-stone-200">{g.judul}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cara pesan: timeline mundur dari hari-H */}
            <section id="cara" className="bg-amber-950 py-14 text-white">
                <div className="mx-auto max-w-3xl px-4">
                    <h2 className="font-display text-3xl font-extrabold tracking-tight">Hitung Mundur ke Hari-H</h2>
                    <p className="mt-2 text-sm text-amber-200">Tanggal acaramu sudah pasti? Ini yang terjadi setelah kamu menghubungi kami.</p>
                    <ol className="relative mt-8 space-y-6 border-l-2 border-amber-700/40 pl-6">
                        {[
                            { t: 'H-90', judul: 'Konsultasi gratis', teks: 'Ceritakan tanggal, jumlah tamu, dan budget. Kami kirim penawaran resmi maksimal 2x24 jam.' },
                            { t: 'H-30', judul: 'Tes food & deal', teks: 'Cicipi langsung di dapur kami untuk 4 orang. Cocok? Tanda tangan kontrak, harga dikunci.' },
                            { t: 'H-7', judul: 'Pelunasan & gladi', teks: 'Pelunasan maksimal H-7. Jumlah pax final dikunci, tim survei lokasi dan gladi alur saji.' },
                            { t: 'H-0', judul: 'Tim datang 4 jam sebelum acara', teks: 'Prasmanan rapi sebelum tamu pertama datang. Kamu tinggal terima tamu, dan pujian.' },
                        ].map((s) => (
                            <li key={s.t} className="relative">
                                <span className="absolute -left-[38px] flex h-6 items-center rounded-full bg-amber-500 px-2.5 text-xs font-extrabold text-amber-950">
                                    {s.t}
                                </span>
                                <p className="font-bold">{s.judul}</p>
                                <p className="mt-1 text-sm text-amber-100/85">{s.teks}</p>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-6 text-xs text-amber-200/70">Acara dadakan kurang dari 30 hari? Hubungi kami, selama dapur belum penuh, kami usahakan.</p>
                </div>
            </section>

            {/* Testimoni klien */}
            <section className="mx-auto max-w-6xl px-4 py-14">
                <div className="text-center">
                    <Badge variant="outline" className="border-amber-700/30 text-amber-700">Kata Klien</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Dipercaya Acara Besar & Momen Keluarga</h2>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {TESTIMONI.map((t) => (
                        <Card key={t.klien}>
                            <CardContent className="p-5">
                                <div className="flex gap-0.5" aria-label="Rating 5 dari 5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="mt-3 text-sm italic text-stone-700">“{t.kutip}”</p>
                                <p className="mt-3 text-xs font-semibold text-amber-700">{t.klien}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Form pemesanan */}
            <section id="pesan" className="mx-auto max-w-6xl px-4 pb-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-amber-700/30 text-amber-700">Form Pemesanan</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Minta Penawaran Acaramu</h2>
                        <p className="mt-2 text-stone-600">
                            Isi detail acara, tim kami akan menghubungimu maksimal 1x24 jam dengan penawaran
                            resmi dan jadwal tes food.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-stone-700">
                            {['Konsultasi & survei lokasi gratis', 'Tes food sebelum deal (paket pernikahan)', 'Kontrak tertulis, harga dikunci'].map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {x}
                                </li>
                            ))}
                        </ul>
                        <figure className="mt-6 rounded-2xl border-l-4 border-amber-600 bg-white p-4 shadow-sm">
                            <blockquote className="text-sm italic text-stone-700">
                                “Pesan 150 box untuk rapat direksi, datang 30 menit lebih awal dan masih hangat.
                                Sekarang tiap ada event kantor, langsung ke Saji Raya.”
                            </blockquote>
                            <figcaption className="mt-2 text-xs font-semibold text-stone-500">
                                PT Cahaya Digital Nusantara, langganan 11x event sejak 2024
                            </figcaption>
                        </figure>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-amber-700" /> Form Pemesanan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pesanOk ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Permintaan terkirim!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        Terima kasih, <span className="font-semibold">{nama}</span>. Permintaan {jenisAcara} untuk {jumlahPax} pax
                                        pada {tanggal} sudah kami terima.
                                        {estimasi && <> Estimasi: <span className="font-bold">{rupiah(estimasi.total)}</span> (DP {rupiah(estimasi.dp)}).</>}
                                        Tim kami menghubungimu maksimal 1x24 jam.
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => { setPesanOk(false); setNama(''); setJenisAcara(''); setTanggal(''); setJumlahPax(''); setCatatan(''); }}>
                                        Buat permintaan lain
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimPesan} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ps-nama">Nama</Label>
                                        <Input id="ps-nama" placeholder="cth: H. Suparman" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="ps-jenis">Jenis acara</Label>
                                            <Select value={jenisAcara} onValueChange={setJenisAcara} required>
                                                <SelectTrigger id="ps-jenis"><SelectValue placeholder="Pilih paket" /></SelectTrigger>
                                                <SelectContent>
                                                    {PAKET.map((p) => (
                                                        <SelectItem key={p.nama} value={p.nama}>{p.nama}, {rupiah(p.hargaPerPax)}/pax</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="ps-tanggal">Tanggal acara</Label>
                                            <Input id="ps-tanggal" type="date" min={hariIni} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ps-pax">Estimasi jumlah tamu (pax)</Label>
                                        <Input id="ps-pax" type="number" min={50} placeholder="cth: 500" value={jumlahPax} onChange={(e) => setJumlahPax(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ps-catatan">Catatan (opsional)</Label>
                                        <Textarea id="ps-catatan" rows={3} placeholder="cth: Lokasi di Gedung Sate, butuh menu vegetarian untuk 20 tamu." value={catatan} onChange={(e) => setCatatan(e.target.value)} />
                                    </div>
                                    {estimasi && (
                                        <div className="rounded-xl bg-amber-50 p-4 text-sm">
                                            <div className="flex justify-between"><span className="text-stone-600">Estimasi total</span><span className="text-lg font-extrabold text-amber-700">{rupiah(estimasi.total)}</span></div>
                                            <div className="mt-1 flex justify-between"><span className="text-stone-600">DP 50%</span><span className="font-semibold">{rupiah(estimasi.dp)}</span></div>
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">Kirim Permintaan</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-3xl px-4 pb-14">
                <div className="text-center">
                    <Badge variant="outline" className="border-amber-700/30 text-amber-700">FAQ</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Pertanyaan Umum</h2>
                </div>
                <Accordion type="single" collapsible className="mt-8">
                    {FAQ.map((f, i) => (
                        <AccordionItem key={f.q} value={`item-${i}`}>
                            <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-stone-600">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Kontak */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="relative min-h-64 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100" aria-hidden>
                            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(160,110,30,.08) 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, rgba(160,110,30,.08) 0 2px, transparent 2px 40px)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="relative mx-auto flex h-14 w-14 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-600 opacity-40" />
                                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-amber-700 shadow-lg">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </span>
                                </span>
                                <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow">SAJI RAYA CATERING</p>
                            </div>
                        </div>
                        <CardContent className="p-6 sm:p-8">
                            <h2 className="text-2xl font-extrabold tracking-tight">Kantor & Dapur Pusat</h2>
                            <div className="mt-4 space-y-3 text-sm text-stone-700">
                                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /> Jl. Soekarno Hatta No. 210, Bandung 40286</p>
                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-amber-700" /> (022) 730-5566 • WA: 0812-2233-4455</p>
                                <p className="flex items-center gap-2"><Handshake className="h-4 w-4 shrink-0 text-amber-700" /> Konsultasi: Senin, Sabtu, 08.00, 17.00</p>
                            </div>
                            <Button size="lg" className="mt-6 w-full bg-green-600 hover:bg-green-700 sm:w-auto" asChild>
                                <a href="https://wa.me/6281222334455?text=Halo%20Saji%20Raya%20Catering!%20Saya%20ingin%20konsultasi%20paket%20acara." target="_blank" rel="noreferrer">
                                    Konsultasi via WhatsApp
                                </a>
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-stone-950 text-stone-400">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-700">
                                <ChefHat className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">SAJI RAYA <span className="text-amber-400">CATERING</span></span>
                        </div>
                        <p className="mt-3 text-sm">Katering acara terpercaya Bandung sejak 2012. Enak, higienis, tepat waktu.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Paket</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Pernikahan, Rp65rb/pax</li>
                            <li>Korporat, Rp45rb/pax</li>
                            <li>Aqiqah & Syukuran, Rp35rb/pax</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Jl. Soekarno Hatta No. 210, Bandung</li>
                            <li>(022) 730-5566</li>
                            <li>WA: 0812-2233-4455</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-stone-800 py-4 text-center text-xs">© 2026 Saji Raya Catering, Bandung. PT Saji Raya Boga.</div>
            </footer>

            <StickyMobileCta
                variant="whatsapp"
                title="Saji Raya Catering"
                subtitle="Konsultasi menu gratis"
                actionLabel="Minta Penawaran"
            />
        </div>
    );
}

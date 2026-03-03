import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { X } from "lucide-react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "NextChance" },
        {
            name: "description",
            content: "NextChance — video-first scouting for players and recruiters.",
        },
    ];
}

export default function Home() {
    const navigate = useNavigate();
    const { isSignedIn, signIn } = useOutletContext<AuthContext>();

    const [openStartModal, setOpenStartModal] = useState(false);
    const [pendingRole, setPendingRole] = useState<"player" | "recruiter" | null>(
        null
    );
    const [busy, setBusy] = useState(false);

    // Optional: open modal if URL hash is #get-started
    useEffect(() => {
        const openIfHash = () => {
            if (window.location.hash === "#get-started") setOpenStartModal(true);
        };
        openIfHash();
        window.addEventListener("hashchange", openIfHash);
        return () => window.removeEventListener("hashchange", openIfHash);
    }, []);

    // Close modal with ESC
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenStartModal(false);
        };
        if (openStartModal) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [openStartModal]);

    const openModal = () => setOpenStartModal(true);

    const goToRole = (role: "player" | "recruiter") => {
        // TODO: replace with your real routes when you create them
        navigate(role === "player" ? "/player" : "/recruiter");
    };

    const ensureSignedInThenGo = async (role: "player" | "recruiter") => {
        setBusy(true);
        setPendingRole(role);

        try {
            if (isSignedIn) {
                setOpenStartModal(false);
                goToRole(role);
                return;
            }

            // Same flow as Navbar Log in
            const ok = await signIn(); // returns boolean in your root.tsx
            if (!ok) return;

            setOpenStartModal(false);
            goToRole(role);
        } catch (e) {
            console.error("Get started sign-in failed:", e);
        } finally {
            setBusy(false);
            setPendingRole(null);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Navbar />

            {/* HERO */}
            <section className="py-24 sm:py-28 text-center px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 text-xs tracking-wide text-zinc-600 mb-10">
                        <span className="w-2 h-2 bg-black rounded-full" />
                        NEXTCHANCE — MVP ACCESS
                    </div>

                    <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.05] font-medium tracking-tight text-black">
                        Opportunity{" "}
                        <span className="text-zinc-400 font-normal">should be</span> visible.
                    </h1>

                    <p className="text-sm sm:text-base tracking-[0.18em] uppercase text-zinc-500 max-w-2xl mx-auto leading-relaxed mt-8">
                        A platform for players and recruiters — profiles that feel
                        professional, and scouting that starts with video.
                    </p>

                    {/* more breathing room between subheader and buttons */}
                    <div className="mt-12 flex justify-center gap-4 sm:gap-5">
                        <button
                            onClick={openModal}
                            className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 bg-black text-white rounded-xl text-[13px] font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:opacity-90"
                        >
                            Get started
                            <span className="text-base transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
                        </button>

                        <button
                            onClick={() => {
                                const el = document.getElementById("how");
                                el?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className="px-6 sm:px-7 py-3.5 border border-zinc-300 rounded-xl text-[13px] font-medium tracking-[0.08em] uppercase hover:bg-zinc-100 transition-all duration-200"
                        >
                            How it works
                        </button>
                    </div>
                </div>
            </section>

            {/* FEATURES (stacked: Players then Recruiters) */}
            <section id="how" className="py-24 sm:py-28 border-t border-zinc-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 space-y-24">
                    {/* PLAYERS */}
                    <div>
                        <h2 className="text-3xl font-serif mb-4">For Players</h2>
                        <p className="text-zinc-600 mb-10">
                            Less guessing. More chances. Build a profile recruiters trust.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="rounded-2xl bg-white border border-zinc-200/70 shadow-sm p-8 transition hover:-translate-y-0.5 hover:shadow-md">
                                <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                                    Profile
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-black">
                                    Professional profile
                                </h3>
                                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                                    Position • Age • Height • Foot — instantly readable by recruiters.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white border border-zinc-200/70 shadow-sm p-8 transition hover:-translate-y-0.5 hover:shadow-md">
                                <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                                    Video
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-black">
                                    Highlights that matter
                                </h3>
                                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                                    One full game link + short clips for key actions.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white border border-zinc-200/70 shadow-sm p-8 transition hover:-translate-y-0.5 hover:shadow-md">
                                <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                                    Visibility
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-black">
                                    Be discoverable
                                </h3>
                                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                                    Search-ready profile that you can share in one click.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RECRUITERS */}
                    <div>
                        <h2 className="text-3xl font-serif mb-4">For Recruiters</h2>
                        <p className="text-zinc-600 mb-10">
                            Less noise. More signal. Evaluate players faster with video-first scouting.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="rounded-2xl bg-white border border-zinc-200/70 shadow-sm p-8 transition hover:-translate-y-0.5 hover:shadow-md">
                                <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                                    Search
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-black">
                                    Smart filters
                                </h3>
                                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                                    Position, age, height, foot, country — find matches fast.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white border border-zinc-200/70 shadow-sm p-8 transition hover:-translate-y-0.5 hover:shadow-md">
                                <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                                    Review
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-black">
                                    Watch faster
                                </h3>
                                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                                    Open highlights instantly — no files, no friction.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white border border-zinc-200/70 shadow-sm p-8 transition hover:-translate-y-0.5 hover:shadow-md">
                                <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                                    Contact
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-black">
                                    Reach out instantly
                                </h3>
                                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                                    Contact the player when the fit is clear.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACCESS */}
            <section id="access" className="py-24 border-t border-zinc-200 bg-zinc-50">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-serif mb-4">Access</h2>
                    <p className="text-zinc-600 mb-10">MVP access is open.</p>

                    <div className="p-10 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <p className="mb-6 text-zinc-700">
                            Build your profile or scout players with the first release.
                        </p>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <p className="font-medium">
                                    Start in under <span className="font-bold">2 minutes</span>
                                </p>
                                <p className="text-sm text-zinc-500">
                                    Create a profile • Add highlights • Get discovered
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={openModal}
                                    className="group inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-[13px] font-medium tracking-[0.08em] uppercase hover:opacity-90 transition"
                                >
                                    Get started
                                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GET STARTED MODAL (auth-aware) */}
            {openStartModal && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => (busy ? null : setOpenStartModal(false))}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white border border-zinc-200 shadow-xl">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
                                <div>
                                    <p className="text-sm text-zinc-500">NextChance access</p>
                                    <h3 className="text-lg font-semibold">Choose your role</h3>
                                </div>
                                <button
                                    onClick={() => (busy ? null : setOpenStartModal(false))}
                                    className="p-2 rounded-lg hover:bg-zinc-100 transition"
                                    aria-label="Close"
                                    disabled={busy}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <button
                                    onClick={() => ensureSignedInThenGo("player")}
                                    className="w-full px-5 py-4 rounded-xl border border-zinc-300 hover:bg-zinc-50 transition text-left disabled:opacity-60"
                                    disabled={busy}
                                >
                                    <div className="font-semibold">
                                        {busy && pendingRole === "player" ? "Signing you in…" : "I’m a Player"}
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        Create a profile, add highlights, get discovered.
                                    </div>
                                </button>

                                <button
                                    onClick={() => ensureSignedInThenGo("recruiter")}
                                    className="w-full px-5 py-4 rounded-xl border border-zinc-300 hover:bg-zinc-50 transition text-left disabled:opacity-60"
                                    disabled={busy}
                                >
                                    <div className="font-semibold">
                                        {busy && pendingRole === "recruiter"
                                            ? "Signing you in…"
                                            : "I’m a Recruiter"}
                                    </div>
                                    <div className="text-sm text-zinc-500">
                                        Search players, watch faster, contact instantly.
                                    </div>
                                </button>

                                <p className="text-xs text-zinc-500 pt-2">
                                    {isSignedIn
                                        ? "You’re already signed in — we’ll take you to the next step."
                                        : "You’ll be redirected to sign in via Puter."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
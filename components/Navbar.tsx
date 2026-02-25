import { Target } from "lucide-react";
import { useOutletContext } from "react-router";
import Button from "./ui/Button";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();

    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Puter sign out failed: ${e}`);
            }
            return;
        }

        try {
            await signIn();
        } catch (e) {
            console.error(`Puter sign in failed: ${e}`);
        }
    };

    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Target className="logo" />
                        <span className="name">NextChance</span>
                    </div>

                    <ul className="links">
                        <a href="#players">Players</a>
                        <a href="#recruiters">Recruiters</a>
                        <a href="#how">How it works</a>
                        <a href="#faq">FAQ</a>
                    </ul>
                </div>

                <div className="actions">
                    {!isSignedIn ? (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAuthClick}
                                className="login"
                            >
                                Log in
                            </Button>

                            <a href="#access" className="cta">
                                Get started
                            </a>
                        </>
                    ) : (
                        <>
                            <span className="greeting">
                                {userName ? `Hi ${userName}` : "Signed in"}
                            </span>

                            <Button size="sm" onClick={handleAuthClick}>
                                Log out
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
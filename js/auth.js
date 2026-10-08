// =====================================================
// AI LIFE ASSISTANT — AUTHENTICATION
// =====================================================

const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authMessage = document.getElementById("authMessage");

function showAuthMessage(message, isError = false) {
    if (!authMessage) return;

    authMessage.textContent = message;
    authMessage.style.color = isError ? "red" : "";
}

// -----------------------------------------------------
// SIGN IN
// -----------------------------------------------------

authForm?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!email || !password) {
        showAuthMessage("Please enter your email and password.", true);
        return;
    }

    showAuthMessage("Signing in...");

    const { data, error } =
        await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        console.error("❌ Sign in error:", error);
        showAuthMessage(error.message, true);
        return;
    }

    console.log("✅ User signed in:", data.user);

    showAuthMessage("✅ Signed in successfully.");

    window.location.href = "chat.html";
});


// -----------------------------------------------------
// CREATE ACCOUNT
// -----------------------------------------------------

document
    .getElementById("createAccountBtn")
    ?.addEventListener("click", async () => {

        const email = authEmail.value.trim();
        const password = authPassword.value;

        if (!email || !password) {
            showAuthMessage(
                "Enter your email and password to create your account.",
                true
            );
            return;
        }

        if (password.length < 6) {
            showAuthMessage(
                "Password must be at least 6 characters.",
                true
            );
            return;
        }

        showAuthMessage("Creating your account...");

        const { data, error } =
            await window.supabaseClient.auth.signUp({
                email,
                password
            });

        if (error) {
            console.error("❌ Sign up error:", error);
            showAuthMessage(error.message, true);
            return;
        }

        console.log("✅ Account created:", data.user);

        if (data.session) {
            showAuthMessage("✅ Account created. Opening your assistant...");

            window.location.href = "chat.html";
        } else {
            showAuthMessage(
                "✅ Account created. Please check your email to confirm your account."
            );
        }
    });


// -----------------------------------------------------
// GOOGLE
// -----------------------------------------------------

document.getElementById("googleSignInBtn")?.addEventListener("click", async () => {

    showAuthMessage("Connecting to Google...");

    try {

        console.log("🔵 Starting Google sign-in...");

        const redirectUrl =
            window.location.origin +
            "/ailifeassistant/auth.html";

        console.log("🔵 Redirect URL:", redirectUrl);

        const { data, error } =
            await window.supabaseClient.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: redirectUrl
                }
            });

        console.log("🔵 Supabase OAuth response:", data);
        console.log("🔵 Supabase OAuth error:", error);

        if (error) {
            console.error("❌ Google sign-in error:", error);

            showAuthMessage(
                "Google sign-in error: " + error.message,
                true
            );

            return;
        }

        if (!data?.url) {

            showAuthMessage(
                "Google sign-in failed: Supabase did not return a login URL.",
                true
            );

            return;
        }

        console.log("✅ Google login URL received.");

        window.location.href = data.url;

    } catch (error) {

        console.error("❌ Google sign-in exception:", error);

        showAuthMessage(
            "Google sign-in exception: " +
            (error?.message || String(error)),
            true
        );

    }

});

// -----------------------------------------------------
// APPLE
// -----------------------------------------------------

document.getElementById("appleSignInBtn")?.addEventListener("click", async () => {
    showAuthMessage("Apple sign-in is coming soon.");
});


// -----------------------------------------------------
// FORGOT PASSWORD
// -----------------------------------------------------

document
    .getElementById("forgotPasswordBtn")
    ?.addEventListener("click", async () => {

        const email = authEmail.value.trim();

        if (!email) {
            showAuthMessage(
                "Enter your email first, then tap Forgot password.",
                true
            );
            return;
        }

        showAuthMessage("Sending password reset email...");

        const { error } =
            await window.supabaseClient.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo:
                        window.location.origin +
                        window.location.pathname
                }
            );

        if (error) {
            console.error("❌ Password reset error:", error);
            showAuthMessage(error.message, true);
            return;
        }

        showAuthMessage(
            "✅ Password reset email sent. Check your inbox."
        );
    });


// -----------------------------------------------------
// CHECK CURRENT SESSION
// -----------------------------------------------------

(async function checkCurrentSession() {

    const { data, error } =
        await window.supabaseClient.auth.getSession();

    if (error) {
        console.error("❌ Session check error:", error);
        return;
    }

    if (data.session) {
        console.log(
            "ℹ️ Existing Supabase session:",
            data.session.user.email
        );
    }

})();

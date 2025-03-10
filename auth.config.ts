import { defineConfig } from "auth-astro";
import GitHub from "@auth/core/providers/github";
import { db, eq, User } from "astro:db";

export default defineConfig({
    providers: [
        GitHub({
            clientId: import.meta.env.AUTH_GITHUB_ID,
            clientSecret: import.meta.env.AUTH_GITHUB_SECRET,
        }),
    ],
    events: {
        async signIn({ user }) {
            if (!user.email) {
                throw new Error("User email is required");
            }
            if (!user.name) {
                throw new Error("User name is required");
            }
            if (!user.id) {
              throw new Error("User id is required");
            }
            const u = await db.select().from(User).where(eq(User.email, user.email));
            if (u.length === 0) {
                await db.insert(User).values([
                    {
                        email: user.email,
                        name: user.name,
                        githubId: user.id,
                        isPremium: false,
                    },
                ]);
            }
        },
    },
    callbacks: {
        async signIn({ user }) {
            return true;
        },
    },
});

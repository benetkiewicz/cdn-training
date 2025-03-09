import { defineConfig } from "auth-astro";
import GitHub from "@auth/core/providers/github";

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.AUTH_GITHUB_ID,
      clientSecret: import.meta.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
        console.log("signIn", user.email, user.id, user.name);
        return true;
      },
  },
}); 
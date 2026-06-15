import { db } from "./db";

export const UserRepository = {

    save(user: any) {

        db.runSync(
            `
            INSERT OR REPLACE INTO users (
                id,
                name,
                email,
                role
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                user.id,
                user.name,
                user.email,
                user.role
            ]
        );
    },

    getUser() {

        const user = db.getFirstSync(
            "SELECT * FROM users LIMIT 1"
        ) as any;

        if (!user) return null;

        return {
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        };
    },

    clear() {
        db.runSync("DELETE FROM users");
    }
};
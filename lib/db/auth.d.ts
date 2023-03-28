import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: string;
    }

    interface Session {
        user: User;
        role: string;
    }
}
import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: string;
        hasToken: boolean;
    }

    interface Session {
        user: User;
        role: string;
        hasToken: boolean;
    }
}
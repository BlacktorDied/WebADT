import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import crypto from "crypto";

type Data = {
    error?: string;
    success?: boolean;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const form = formidable();
    form.parse(req, async (err, fields) => {
        const username = fields.username?.[0];
        const password = fields.password?.[0];
        const confirmPassword = fields.confirmPassword?.[0];
        const action = fields.action?.[0];

        if (action === "signUp") {
            if (!username || !password || !confirmPassword) {
                return res.json({
                    error: "Username, password, and confirm password are required",
                });
            }
            if (password !== confirmPassword) {
                return res.json({ error: "Passwords do not match" });
            }
        } else if (action === "logIn") {
            if (!username || !password) {
                return res.json({
                    error: "Username and password are required",
                });
            }
        } else {
            return res.json({ error: "Invalid action" });
        }

        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (action === "signUp") {
            if (user) {
                return res.json({ error: "Username is already taken" });
            }

            await prisma.user.create({
                data: {
                    username: username,
                    password: password,
                },
            });
        } else if (action === "logIn") {
            if (!user || user.password !== password) {
                return res.json({ error: "Invalid username or password" });
            }
        }

        const hash = crypto.createHash("sha256").update(password).digest("hex");
        res.setHeader(
            "Set-Cookie",
            `auth=${username + ":" + hash}; Max-Age=3600; Path=/`,
        );
        res.status(200).json({ success: true });
    });
}
